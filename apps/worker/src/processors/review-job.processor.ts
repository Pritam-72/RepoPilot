import { createHash } from "node:crypto";
import type { Job } from "bullmq";
import { ReviewJobPayloadSchema, type ReviewJobPayload } from "@acr/review-contracts";
import { prisma } from "@acr/database";
import { logger } from "@acr/observability";
import { createInstallationOctokit, getPRMetadata, getChangedFiles } from "@acr/github";
import { runBugReviewAgent } from "@acr/agents";

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
): Promise<{ processed: boolean; findingsCount: number }> {
  const log = logger.child({ jobId: job.id, headSha: job.data.headSha });
  log.info("Review job started");

  const payload = ReviewJobPayloadSchema.parse(job.data);
  const { installationId, repositoryId, pullRequestNumber, headSha, reviewJobId } = payload;

  // 1. Get repository info from DB
  const repo = await prisma.repository.findUnique({ where: { id: repositoryId } });
  if (!repo) {
    throw new Error(`Repository ${repositoryId} not found`);
  }

  // 2. Fetch PR metadata and changed files from GitHub
  const octokit = await createInstallationOctokit(Number(installationId), APP_ID, PRIVATE_KEY);
  const [meta, changedFiles] = await Promise.all([
    getPRMetadata(octokit, repo.owner, repo.name, pullRequestNumber),
    getChangedFiles(octokit, repo.owner, repo.name, pullRequestNumber),
  ]);

  // 3. Ensure PullRequest record exists and upsert ReviewJob
  const pr = await prisma.pullRequest.upsert({
    where: {
      repositoryId_githubPrNumber: {
        repositoryId,
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
      repositoryId,
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
    update: { status: "analyzing", headSha },
    create: {
      repositoryId,
      pullRequestId: pr.id,
      headSha,
      idempotencyKey: reviewJobId,
      status: "analyzing",
    },
  });

  // 4. Record AgentRun
  const agentRun = await prisma.agentRun.create({
    data: {
      reviewJobId: reviewJob.id,
      agentType: "bug",
      status: "running",
      modelProvider: "google",
      modelName: "gemini-2.0-flash-exp",
    },
  });

  // 5. Run BugReviewAgent
  const agentOutput = await runBugReviewAgent({
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
    reviewPolicy: { enabledCategories: ["correctness"], minimumConfidence: 0.5 },
  });

  // 6. Persist findings & update statuses atomically
  await prisma.$transaction([
    prisma.agentRun.update({
      where: { id: agentRun.id },
      data: {
        status: "completed",
        outputJson: { findingsCount: agentOutput.findings.length },
      },
    }),
    ...agentOutput.findings.map((f) =>
      prisma.finding.create({
        data: {
          reviewJobId: reviewJob.id,
          agentRunId: agentRun.id,
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
          verificationStatus: f.verificationStatus,
        },
      })
    ),
    prisma.reviewJob.update({
      where: { id: reviewJob.id },
      data: { status: "completed" },
    }),
  ]);

  log.info({ findings: agentOutput.findings.length }, "Review job completed");
  return { processed: true, findingsCount: agentOutput.findings.length };
}
