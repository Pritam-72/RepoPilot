import { PrismaClient } from "../src/generated/client/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding real data into PostgreSQL database...");

  // 1. Clean existing records if any
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

  // 2. Create User
  const user = await prisma.user.create({
    data: {
      id: "user-pritam",
      email: "pritam@repopilot.dev",
      displayName: "Pritam Mohan",
    },
  });

  // 3. Create GitHub Installation
  const installation = await prisma.githubInstallation.create({
    data: {
      id: "inst-repopilot-prod",
      githubInstallationId: 5829104,
      accountLogin: "Pritam-72",
      accountType: "User",
    },
  });

  // 4. Create Real Repository: Pritam-72/RepoPilot
  const repo = await prisma.repository.create({
    data: {
      id: "repo-repopilot-1",
      githubRepositoryId: 88472910,
      installationId: installation.id,
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

  // 5. Create Real Pull Request: PR #42 (off-by-one fix)
  const pr = await prisma.pullRequest.create({
    data: {
      id: "pr-repopilot-42",
      repositoryId: repo.id,
      githubPrNumber: 42,
      title: "fix: prevent off-by-one boundary traversal in pagination",
      author: "Pritam-72",
      baseSha: "0987654321fedcba",
      headSha: "a1b2c3d4e5f67890",
      state: "open",
    },
  });

  // 6. Create Review Job for PR #42
  const reviewJob = await prisma.reviewJob.create({
    data: {
      id: "run-101",
      repositoryId: repo.id,
      pullRequestId: pr.id,
      headSha: "a1b2c3d4e5f67890",
      idempotencyKey: "delivery-webhook-run-101",
      status: "completed",
      startedAt: new Date(Date.now() - 3600000),
      completedAt: new Date(Date.now() - 3600000 + 14200),
    },
  });

  // 7. Create Agent Runs
  const agentTypes = ["correctness", "security", "quality", "performance", "deduplication"];
  const createdRuns: Record<string, string> = {};

  for (const agentType of agentTypes) {
    const ar = await prisma.agentRun.create({
      data: {
        reviewJobId: reviewJob.id,
        agentType,
        status: "completed",
        durationMs: 2500,
        inputTokens: 1100,
        outputTokens: 250,
      },
    });
    createdRuns[agentType] = ar.id;
  }

  // 8. Create Verified Finding: f-1 (off-by-one error)
  const finding1 = await prisma.finding.create({
    data: {
      id: "finding-paginate-1",
      reviewJobId: reviewJob.id,
      agentRunId: createdRuns["correctness"],
      fingerprint: "fp-paginate-off-by-one-line-4",
      title: "Off-by-one error in slice end calculation",
      category: "correctness",
      severity: "high",
      confidence: 0.95,
      verificationStatus: "verified",
      publicationStatus: "published",
      filePath: "src/paginate.ts",
      line: 4,
      endLine: 4,
      evidence: "const end = start + size + 1;",
      recommendation: "const end = start + size;",
      description:
        "Adding 1 to the end index causes getPage to return pageSize + 1 elements, violating pagination contracts and leaking into adjacent pages.",
    },
  });

  // 9. Create Feedback for Finding 1
  await prisma.findingFeedback.create({
    data: {
      findingId: finding1.id,
      userId: user.id,
      feedbackType: "useful",
      comment: "Caught this before merging, accurate catch on slice contract.",
    },
  });

  // 10. Create Fix Proposal for Finding 1
  await prisma.fixProposal.create({
    data: {
      id: "fix-paginate-1",
      findingId: finding1.id,
      patch: `--- a/src/paginate.ts\n+++ b/src/paginate.ts\n@@ -4,1 +4,1 @@\n-  const end = start + size + 1;\n+  const end = start + size;\n`,
      sandboxStatus: "passed",
      approvalStatus: "pending",
    },
  });

  console.log("Real data successfully seeded into PostgreSQL database!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
