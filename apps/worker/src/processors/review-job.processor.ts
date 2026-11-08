import { createHash } from "node:crypto";
import type { Job } from "bullmq";
import { ReviewJobPayloadSchema, type ReviewJobPayload } from "@acr/review-contracts";
import { prisma } from "@acr/database";
import { logger } from "@acr/observability";
import {
  createInstallationOctokit,
  getPRMetadata,
  getChangedFiles,
  getPRCommits,
  getChangedLineNumbers,
  publishPRReview,
} from "@acr/github";
import { runReviewOrchestrator, verifyAndDeduplicateFindings } from "@acr/agents";

const APP_ID = Number(process.env["GITHUB_APP_ID"] ?? "0");
const PRIVATE_KEY = process.env["GITHUB_PRIVATE_KEY"] ?? "";

function computeFindingFingerprint(
  file: string,
  line: number,
  category: string,
  title: string
): string {
  return createHash("sha256")
    .update(`${file}:${line}:${category}:${title}`)
    .digest("hex");
}

export async function processReviewJob(
  job: Job<ReviewJobPayload>
): Promise<{ processed: boolean; findingsCount: number; status: string; publishedCount?: number }> {
  const log = logger.child({ jobId: job.id, headSha: job.data.headSha });
  log.info("Review job started");

  const payload = ReviewJobPayloadSchema.parse(job.data);
  const { installationId, repositoryId, pullRequestNumber, headSha, reviewJobId } = payload;

  // 1. Get repository info from DB
  let repo = await prisma.repository.findUnique({ where: { id: repositoryId } });
  if (!repo && !isNaN(Number(repositoryId))) {
    repo = await prisma.repository.findFirst({
      where: { githubRepositoryId: Number(repositoryId) },
    });
  }
  if (!repo) {
    throw new Error(`Repository ${repositoryId} not found`);
  }

  // 2. Fetch PR metadata, changed files (paginated), and commits (paginated) from GitHub
  const octokit = await createInstallationOctokit(Number(installationId), APP_ID, PRIVATE_KEY);
  const [meta, changedFiles, commits] = await Promise.all([
    getPRMetadata(octokit, repo.owner, repo.name, pullRequestNumber),
    getChangedFiles(octokit, repo.owner, repo.name, pullRequestNumber),
    getPRCommits(octokit, repo.owner, repo.name, pullRequestNumber),
  ]);

  log.info(
    {
      prNumber: pullRequestNumber,
      fileCount: changedFiles.length,
      commitCount: commits.length,
      headSha,
    },
    "PR snapshot ingested"
  );

  // Compute changed line numbers by file
  const changedLinesByFile = new Map<string, Set<number>>();
  for (const f of changedFiles) {
    if (f.patch) {
      changedLinesByFile.set(f.path, getChangedLineNumbers(f.patch));
    }
  }

  // 3. Ensure PullRequest record exists and upsert ReviewJob
  const pr = await prisma.pullRequest.upsert({
    where: {
      repositoryId_githubPrNumber: {
        repositoryId: repo.id,
        githubPrNumber: pullRequestNumber,
      },
    },
    update: {
      headSha,
      baseSha: meta.baseSha,
      title: meta.title,
      author: meta.author,
    },
    create: {
      repositoryId: repo.id,
      githubPrNumber: pullRequestNumber,
      headSha,
      baseSha: meta.baseSha,
      title: meta.title,
      author: meta.author,
      state: "open",
    },
  });

  const reviewJob = await prisma.reviewJob.upsert({
    where: { idempotencyKey: reviewJobId },
    update: { status: "analyzing", headSha, startedAt: new Date() },
    create: {
      repositoryId: repo.id,
      pullRequestId: pr.id,
      headSha,
      idempotencyKey: reviewJobId,
      status: "analyzing",
      startedAt: new Date(),
    },
  });

  // 4. Run Multi-Agent Orchestrator
  const reviewResult = await runReviewOrchestrator({
    repository: {
      owner: repo.owner,
      name: repo.name,
      repositoryId: repo.githubRepositoryId,
    },
    pullRequest: {
      number: pullRequestNumber,
      baseSha: meta.baseSha,
      headSha: meta.headSha,
      title: meta.title,
    },
    changedFiles,
    context: [],
    reviewPolicy: {
      enabledCategories: ["correctness", "security", "testing", "maintainability"],
      minimumConfidence: 0.5,
    },
  });

  // 5. Verify & Deduplicate Findings
  const fileContents = new Map<string, string>();
  const verification = verifyAndDeduplicateFindings(
    reviewResult.allFindings,
    fileContents,
    changedLinesByFile,
    { minConfidence: 0.75, requireChangedLine: false }
  );

  // 6. Query previously dismissed findings on this repository to suppress repeated warnings (Phase 8)
  const dismissedDbFindings = prisma.finding.findMany
    ? await prisma.finding.findMany({
        where: {
          reviewJob: { repositoryId: repo.id },
          OR: [
            { verificationStatus: "dismissed" },
            { feedbacks: { some: { feedbackType: { in: ["dismissed", "incorrect", "ignored_rule"] } } } },
          ],
        },
        select: { fingerprint: true },
      })
    : [];
  const dismissedFingerprints = new Set(dismissedDbFindings.map((f) => f.fingerprint));

  const activeFindings: typeof verification.verified = [];
  const suppressedFindings: typeof verification.verified = [];

  for (const f of verification.verified) {
    const fp = computeFindingFingerprint(f.file, f.line, f.category, f.title);
    if (dismissedFingerprints.has(fp)) {
      suppressedFindings.push(f);
    } else {
      activeFindings.push(f);
    }
  }

  // 7. Outdate prior published findings on previous review runs for this pull request (avoid stale duplicates)
  if (prisma.finding.updateMany) {
    await prisma.finding.updateMany({
      where: {
        reviewJob: {
          pullRequestId: pr.id,
          id: { not: reviewJob.id },
        },
        publicationStatus: "published",
      },
      data: { publicationStatus: "outdated" },
    });
  }

  // 8. Publish review to GitHub (with dry-run and coverage support)
  const isDryRun = payload.dryRun === true || process.env["DRY_RUN"] === "true";
  let publishedCount = 0;

  if (activeFindings.length > 0) {
    try {
      const pubResult = await publishPRReview({
        octokit,
        owner: repo.owner,
        repo: repo.name,
        prNumber: pullRequestNumber,
        commitSha: headSha,
        findings: activeFindings,
        changedLinesByFile,
        coverage: reviewResult.coverage,
        dryRun: isDryRun,
      });
      publishedCount = pubResult.inlineCommentsCount + pubResult.summaryFindingsCount;
    } catch (err: unknown) {
      log.warn({ error: err instanceof Error ? err.message : String(err) }, "Failed to publish review to GitHub");
    }
  }

  // 9. Persist AgentRuns and Findings atomically
  const agentRunCreates = await Promise.all(
    reviewResult.agentRuns.map((ar) =>
      prisma.agentRun.create({
        data: {
          reviewJobId: reviewJob.id,
          agentType: ar.agentType,
          status: ar.status,
          modelProvider: "google",
          modelName: "gemini-2.0-flash-exp",
          durationMs: ar.durationMs,
          errorMessage: ar.error ?? null,
          outputJson: { findingsCount: ar.findings.length },
        },
      })
    )
  );

  const findingCreates = [
    ...activeFindings.map((f) =>
      prisma.finding.create({
        data: {
          reviewJobId: reviewJob.id,
          agentRunId: agentRunCreates[0]?.id ?? null,
          fingerprint: computeFindingFingerprint(f.file, f.line, f.category, f.title),
          category: f.category,
          severity: f.severity,
          confidence: f.confidence,
          filePath: f.file,
          line: f.line,
          endLine: f.endLine ?? f.line,
          title: f.title,
          description: f.description,
          evidence: f.evidence,
          recommendation: f.recommendation ?? "",
          verificationStatus: "verified",
          publicationStatus: isDryRun ? "dry_run" : publishedCount > 0 ? "published" : "pending",
        },
      })
    ),
    ...suppressedFindings.map((f) =>
      prisma.finding.create({
        data: {
          reviewJobId: reviewJob.id,
          agentRunId: agentRunCreates[0]?.id ?? null,
          fingerprint: computeFindingFingerprint(f.file, f.line, f.category, f.title),
          category: f.category,
          severity: f.severity,
          confidence: f.confidence,
          filePath: f.file,
          line: f.line,
          endLine: f.endLine ?? f.line,
          title: f.title,
          description: f.description,
          evidence: f.evidence,
          recommendation: f.recommendation ?? "",
          verificationStatus: "dismissed",
          publicationStatus: "suppressed",
        },
      })
    ),
  ];

  await prisma.$transaction([
    ...findingCreates,
    prisma.reviewJob.update({
      where: { id: reviewJob.id },
      data: { status: reviewResult.status },
    }),
  ]);

  log.info(
    {
      totalFindings: reviewResult.totalFindings,
      verifiedCount: verification.verified.length,
      publishedCount,
      status: reviewResult.status,
    },
    "Review job completed"
  );

  return {
    processed: true,
    findingsCount: verification.verified.length,
    status: reviewResult.status,
    publishedCount,
  };
}
