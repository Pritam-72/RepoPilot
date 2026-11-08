import { PrismaClient } from "../src/generated/client/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding real data into PostgreSQL database...");

  // 1. Clean existing records in correct foreign key order
  await prisma.findingFeedback.deleteMany();
  await prisma.fixProposal.deleteMany();
  await prisma.finding.deleteMany();
  await prisma.agentRun.deleteMany();
  await prisma.reviewJob.deleteMany();
  await prisma.webhookDelivery.deleteMany();
  await prisma.pullRequest.deleteMany();
  await prisma.repository.deleteMany();
  await prisma.githubInstallation.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const user = await prisma.user.create({
    data: {
      id: "user-pritam",
      email: "pritam@repopilot.dev",
      displayName: "Pritam Mohan",
    },
  });

  // 3. Create GitHub Installations
  const instPritam = await prisma.githubInstallation.create({
    data: {
      id: "inst-repopilot-prod",
      githubInstallationId: 5829104,
      accountLogin: "Pritam-72",
      accountType: "User",
    },
  });

  const instAcme = await prisma.githubInstallation.create({
    data: {
      id: "inst-acme-prod",
      githubInstallationId: 9812401,
      accountLogin: "acme-corp",
      accountType: "Organization",
    },
  });

  // 4. Create Repositories
  const repoRepoPilot = await prisma.repository.create({
    data: {
      id: "repo-repopilot-1",
      githubRepositoryId: 88472910,
      installationId: instPritam.id,
      owner: "Pritam-72",
      name: "RepoPilot",
      defaultBranch: "main",
      isEnabled: true,
      reviewConfig: {
        confidenceThreshold: 0.75,
        automatedPublishing: true,
        agents: {
          correctness: true,
          security: true,
          quality: true,
          performance: true,
          dependency: true,
        },
        conventions: [
          "Always return early to minimize indentation",
          "Never commit API keys or development credentials",
          "Require parameterized queries for raw SQL access",
        ],
      },
    },
  });

  const repoCloudWorker = await prisma.repository.create({
    data: {
      id: "repo-cloud-worker-1",
      githubRepositoryId: 49595731,
      installationId: instPritam.id,
      owner: "Pritam-72",
      name: "cloud-worker",
      defaultBranch: "main",
      isEnabled: true,
      reviewConfig: {
        confidenceThreshold: 0.8,
        automatedPublishing: true,
        agents: {
          correctness: true,
          security: true,
          performance: true,
        },
        conventions: ["Avoid O(N^2) loops in server request hot-paths"],
      },
    },
  });

  const repoEcommerce = await prisma.repository.create({
    data: {
      id: "repo-ecommerce-1",
      githubRepositoryId: 77123901,
      installationId: instAcme.id,
      owner: "acme-corp",
      name: "ecommerce-api",
      defaultBranch: "master",
      isEnabled: true,
      reviewConfig: {
        confidenceThreshold: 0.7,
        automatedPublishing: false,
        agents: {
          security: true,
          correctness: true,
          quality: true,
        },
        conventions: ["Require unit tests on all order checkout paths"],
      },
    },
  });

  const agentTypes = [
    "bug-reviewer",
    "security-reviewer",
    "error-handling-reviewer",
    "test-coverage-reviewer",
    "performance-reviewer",
    "quality-reviewer",
  ];

  // Helper to create agent runs for a review job
  async function createAgentRuns(jobId: string, durationBase: number, tokensBase: number) {
    const runs: Record<string, string> = {};
    for (const at of agentTypes) {
      const ar = await prisma.agentRun.create({
        data: {
          reviewJobId: jobId,
          agentType: at,
          status: "completed",
          durationMs: durationBase + Math.floor(Math.random() * 300),
          inputTokens: tokensBase + Math.floor(Math.random() * 100),
          outputTokens: 180 + Math.floor(Math.random() * 50),
        },
      });
      runs[at] = ar.id;
    }
    return runs;
  }

  // ==========================================
  // CASE 1 (Bug): PR #42 - Off-by-one pagination
  // ==========================================
  const pr42 = await prisma.pullRequest.create({
    data: {
      id: "pr-repopilot-42",
      repositoryId: repoRepoPilot.id,
      githubPrNumber: 42,
      title: "fix: prevent off-by-one boundary traversal in pagination",
      author: "Pritam-72",
      baseSha: "0987654321fedcba",
      headSha: "a1b2c3d4e5f67890",
      state: "open",
    },
  });

  const job101 = await prisma.reviewJob.create({
    data: {
      id: "run-101",
      repositoryId: repoRepoPilot.id,
      pullRequestId: pr42.id,
      headSha: "a1b2c3d4e5f67890",
      idempotencyKey: "delivery-webhook-run-101",
      status: "completed",
      startedAt: new Date(Date.now() - 3600000),
      completedAt: new Date(Date.now() - 3600000 + 14200),
    },
  });

  const runs101 = await createAgentRuns(job101.id, 2400, 640);

  const finding1 = await prisma.finding.create({
    data: {
      id: "finding-paginate-1",
      reviewJobId: job101.id,
      agentRunId: runs101["bug-reviewer"],
      fingerprint: "fp-paginate-off-by-one-line-3",
      title: "Off-by-One Boundary Defect in Pagination Slice",
      category: "correctness",
      severity: "high",
      confidence: 0.95,
      verificationStatus: "verified",
      publicationStatus: "published",
      filePath: "src/paginate.ts",
      line: 3,
      endLine: 3,
      evidence: "  const end = start + size + 1;",
      recommendation: "const end = start + size;",
      description:
        "Slice end index exceeds bounds by 1 leading to off-by-one pagination leaks and returning more elements than the requested page size.",
    },
  });

  await prisma.findingFeedback.create({
    data: {
      findingId: finding1.id,
      userId: user.id,
      feedbackType: "useful",
      comment: "Caught this before merging, accurate catch on slice contract.",
    },
  });

  await prisma.fixProposal.create({
    data: {
      id: "fix-paginate-1",
      findingId: finding1.id,
      patch: `--- a/src/paginate.ts\n+++ b/src/paginate.ts\n@@ -3,1 +3,1 @@\n-  const end = start + size + 1;\n+  const end = start + size;\n`,
      sandboxStatus: "passed",
      approvalStatus: "pending",
    },
  });

  // ==========================================
  // CASE 2 (Security): PR #43 - SQL Injection
  // ==========================================
  const pr43 = await prisma.pullRequest.create({
    data: {
      id: "pr-repopilot-43",
      repositoryId: repoRepoPilot.id,
      githubPrNumber: 43,
      title: "security: raw string concatenation SQL injection in user authentication",
      author: "Pritam-72",
      baseSha: "1122334455667788",
      headSha: "b2c3d4e5f6a1b2c3",
      state: "open",
    },
  });

  const job102 = await prisma.reviewJob.create({
    data: {
      id: "run-102",
      repositoryId: repoRepoPilot.id,
      pullRequestId: pr43.id,
      headSha: "b2c3d4e5f6a1b2c3",
      idempotencyKey: "delivery-webhook-run-102",
      status: "completed",
      startedAt: new Date(Date.now() - 2800000),
      completedAt: new Date(Date.now() - 2800000 + 12800),
    },
  });

  const runs102 = await createAgentRuns(job102.id, 2100, 620);

  const finding2 = await prisma.finding.create({
    data: {
      id: "finding-sec-sql-1",
      reviewJobId: job102.id,
      agentRunId: runs102["security-reviewer"],
      fingerprint: "fp-users-sqli-line-2",
      title: "Raw String Concatenation SQL Injection in User Authentication",
      category: "security",
      severity: "critical",
      confidence: 0.95,
      verificationStatus: "verified",
      publicationStatus: "published",
      filePath: "src/db/users.ts",
      line: 2,
      endLine: 2,
      evidence: "  return db.query(`SELECT * FROM users WHERE email = '${email}'`);",
      recommendation: 'return db.query("SELECT * FROM users WHERE email = $1", [email]);',
      description:
        "Raw string interpolation inside SQL query introduces critical SQL injection vulnerability allowing arbitrary authentication bypass or database exfiltration.",
    },
  });

  await prisma.findingFeedback.create({
    data: {
      findingId: finding2.id,
      userId: user.id,
      feedbackType: "useful",
      comment: "Crucial catch! Parameterized queries must be strictly enforced.",
    },
  });

  await prisma.fixProposal.create({
    data: {
      id: "fix-sec-sql-1",
      findingId: finding2.id,
      patch: `--- a/src/db/users.ts\n+++ b/src/db/users.ts\n@@ -2,1 +2,1 @@\n-  return db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);\n+  return db.query("SELECT * FROM users WHERE email = $1", [email]);\n`,
      sandboxStatus: "passed",
      approvalStatus: "approved",
    },
  });

  // ==============================================================
  // CASE 3 (Error Handling): PR #44 - Unhandled Promise Rejection
  // ==============================================================
  const pr44 = await prisma.pullRequest.create({
    data: {
      id: "pr-repopilot-44",
      repositoryId: repoRepoPilot.id,
      githubPrNumber: 44,
      title: "fix: background repository synchronization worker",
      author: "Pritam-72",
      baseSha: "2233445566778899",
      headSha: "c3d4e5f6a1b2c3d4",
      state: "open",
    },
  });

  const job103 = await prisma.reviewJob.create({
    data: {
      id: "run-103",
      repositoryId: repoRepoPilot.id,
      pullRequestId: pr44.id,
      headSha: "c3d4e5f6a1b2c3d4",
      idempotencyKey: "delivery-webhook-run-103",
      status: "completed",
      startedAt: new Date(Date.now() - 2100000),
      completedAt: new Date(Date.now() - 2100000 + 13500),
    },
  });

  const runs103 = await createAgentRuns(job103.id, 2300, 610);

  const finding3 = await prisma.finding.create({
    data: {
      id: "finding-err-sync-1",
      reviewJobId: job103.id,
      agentRunId: runs103["error-handling-reviewer"],
      fingerprint: "fp-sync-unhandled-rejection-line-2",
      title: "Floating Unhandled Promise Rejection in Background Sync",
      category: "error-handling",
      severity: "high",
      confidence: 0.95,
      verificationStatus: "verified",
      publicationStatus: "published",
      filePath: "src/service/sync.ts",
      line: 2,
      endLine: 2,
      evidence: "  fetchUpdates(repoId);",
      recommendation:
        'try {\n  await fetchUpdates(repoId);\n} catch (error) {\n  logger.error({ error, repoId }, "Failed to sync repo updates");\n}',
      description:
        "Async operation omitted await and try/catch block leading to unhandled promise rejection and node process termination on network failure.",
    },
  });

  await prisma.findingFeedback.create({
    data: {
      findingId: finding3.id,
      userId: user.id,
      feedbackType: "useful",
      comment: "Prevented silent worker process crash.",
    },
  });

  // ==============================================================
  // CASE 4 (Performance): PR #45 - Quadratic Linear Scan
  // ==============================================================
  const pr45 = await prisma.pullRequest.create({
    data: {
      id: "pr-cloudworker-45",
      repositoryId: repoCloudWorker.id,
      githubPrNumber: 45,
      title: "perf: optimize forbidden token filtering in request hot-path",
      author: "Pritam-72",
      baseSha: "3344556677889900",
      headSha: "d4e5f6a1b2c3d4e5",
      state: "open",
    },
  });

  const job104 = await prisma.reviewJob.create({
    data: {
      id: "run-104",
      repositoryId: repoCloudWorker.id,
      pullRequestId: pr45.id,
      headSha: "d4e5f6a1b2c3d4e5",
      idempotencyKey: "delivery-webhook-run-104",
      status: "completed",
      startedAt: new Date(Date.now() - 1500000),
      completedAt: new Date(Date.now() - 1500000 + 11900),
    },
  });

  const runs104 = await createAgentRuns(job104.id, 2000, 630);

  const finding4 = await prisma.finding.create({
    data: {
      id: "finding-perf-filter-1",
      reviewJobId: job104.id,
      agentRunId: runs104["performance-reviewer"],
      fingerprint: "fp-filter-quadratic-line-2",
      title: "Quadratic O(N*M) Linear Scan in Hot-Path Filter",
      category: "performance",
      severity: "medium",
      confidence: 0.95,
      verificationStatus: "verified",
      publicationStatus: "published",
      filePath: "src/utils/filter.ts",
      line: 2,
      endLine: 2,
      evidence: "  return items.filter(x => !blacklist.some(b => b === x));",
      recommendation:
        "const forbiddenSet = new Set(blacklist);\nreturn items.filter(x => !forbiddenSet.has(x));",
      description:
        "Nested linear array scan inside filter creates an O(N*M) algorithmic bottleneck instead of O(N+M) set lookup on large datasets.",
    },
  });

  await prisma.findingFeedback.create({
    data: {
      findingId: finding4.id,
      userId: user.id,
      feedbackType: "useful",
      comment: "Saved high CPU latency on high-throughput requests.",
    },
  });

  // ==============================================================
  // CASE 5 (Test): PR #46 - Missing Assertions in Async Route Test
  // ==============================================================
  const pr46 = await prisma.pullRequest.create({
    data: {
      id: "pr-ecommerce-46",
      repositoryId: repoEcommerce.id,
      githubPrNumber: 46,
      title: "test: route dispatcher middleware execution coverage",
      author: "acme-corp",
      baseSha: "4455667788990011",
      headSha: "e5f6a1b2c3d4e5f6",
      state: "open",
    },
  });

  const job105 = await prisma.reviewJob.create({
    data: {
      id: "run-105",
      repositoryId: repoEcommerce.id,
      pullRequestId: pr46.id,
      headSha: "e5f6a1b2c3d4e5f6",
      idempotencyKey: "delivery-webhook-run-105",
      status: "completed",
      startedAt: new Date(Date.now() - 900000),
      completedAt: new Date(Date.now() - 900000 + 10500),
    },
  });

  const runs105 = await createAgentRuns(job105.id, 1900, 610);

  const finding5 = await prisma.finding.create({
    data: {
      id: "finding-test-assert-1",
      reviewJobId: job105.id,
      agentRunId: runs105["test-coverage-reviewer"],
      fingerprint: "fp-test-assert-line-3",
      title: "Missing Assertions in Asynchronous Route Test",
      category: "testing",
      severity: "medium",
      confidence: 0.95,
      verificationStatus: "verified",
      publicationStatus: "published",
      filePath: "test/route-execution.test.ts",
      line: 3,
      endLine: 4,
      evidence: "    await route.dispatch({ url: \"/test\" }, {});",
      recommendation:
        "const res = await route.dispatch({ url: \"/test\" }, {});\nexpect(res.status).toBe(200);\nexpect(res.body).toBeDefined();",
      description:
        "Async integration test executes dispatcher without asserting HTTP response status code or response payload, masking silent failures.",
    },
  });

  await prisma.findingFeedback.create({
    data: {
      findingId: finding5.id,
      userId: user.id,
      feedbackType: "useful",
      comment: "Good catch, test was passing vacuously.",
    },
  });

  // ==============================================================
  // CASE 6 (Quality / Control): PR #47 - Clean Clamping Refactor
  // ==============================================================
  const pr47 = await prisma.pullRequest.create({
    data: {
      id: "pr-repopilot-47",
      repositoryId: repoRepoPilot.id,
      githubPrNumber: 47,
      title: "refactor: modern clamp utility implementation (Clean Control PR)",
      author: "Pritam-72",
      baseSha: "5566778899001122",
      headSha: "f6a1b2c3d4e5f6a1",
      state: "open",
    },
  });

  const job106 = await prisma.reviewJob.create({
    data: {
      id: "run-106",
      repositoryId: repoRepoPilot.id,
      pullRequestId: pr47.id,
      headSha: "f6a1b2c3d4e5f6a1",
      idempotencyKey: "delivery-webhook-run-106",
      status: "completed",
      startedAt: new Date(Date.now() - 300000),
      completedAt: new Date(Date.now() - 300000 + 8500),
    },
  });

  await createAgentRuns(job106.id, 1400, 590);
  // Zero findings for Case 6: Verified Clean Pass!

  console.log("All 6 specialized test cases and real database entities successfully seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
