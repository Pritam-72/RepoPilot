import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Job } from "bullmq";
import type { ReviewJobPayload } from "@acr/review-contracts";

// Mock dependencies
vi.mock("@acr/database", () => {
  const mockRepo = {
    id: "repo-123",
    githubRepositoryId: 999,
    owner: "test-owner",
    name: "test-repo",
  };

  const mockPr = {
    id: "pr-123",
    repositoryId: "repo-123",
    githubPrNumber: 42,
  };

  const mockJob = {
    id: "review-job-123",
    repositoryId: "repo-123",
    pullRequestId: "pr-123",
  };

  const mockAgentRun = {
    id: "agent-run-123",
  };

  return {
    prisma: {
      repository: {
        findUnique: vi.fn().mockResolvedValue(mockRepo),
      },
      pullRequest: {
        upsert: vi.fn().mockResolvedValue(mockPr),
      },
      reviewJob: {
        upsert: vi.fn().mockResolvedValue(mockJob),
        update: vi.fn().mockResolvedValue(mockJob),
      },
      agentRun: {
        create: vi.fn().mockResolvedValue(mockAgentRun),
        update: vi.fn().mockResolvedValue(mockAgentRun),
      },
      finding: {
        create: vi.fn().mockResolvedValue({ id: "finding-1" }),
      },
      $transaction: vi.fn().mockImplementation(async (promises: unknown[]) => {
        return Promise.all(promises);
      }),
    },
  };
});

vi.mock("@acr/github", () => ({
  createInstallationOctokit: vi.fn().mockResolvedValue({}),
  getPRMetadata: vi.fn().mockResolvedValue({
    baseSha: "base-sha-123",
    headSha: "head-sha-456",
    title: "Fix bug in calculation",
    author: "dev-user",
  }),
  getChangedFiles: vi.fn().mockResolvedValue([
    {
      path: "src/calc.ts",
      status: "modified",
      patch: "@@ -1,2 +1,2 @@\n-let x = 0;\n+let x = 1;",
      additions: 1,
      deletions: 1,
    },
  ]),
}));

vi.mock("@acr/agents", () => ({
  runBugReviewAgent: vi.fn().mockResolvedValue({
    findings: [
      {
        title: "Off-by-one bug",
        category: "correctness",
        severity: "high",
        confidence: 0.9,
        file: "src/calc.ts",
        line: 2,
        description: "Index offset incorrect",
        evidence: "let x = 1;",
        recommendation: "Use zero indexing",
        verificationStatus: "unverified",
      },
    ],
  }),
}));

const { processReviewJob } = await import("../processors/review-job.processor.js");
const { prisma } = await import("@acr/database");
const { runBugReviewAgent } = await import("@acr/agents");

describe("Review Job Processor - End to End Slice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("processes a review job and saves findings in Prisma", async () => {
    const mockJob = {
      id: "job-abc",
      data: {
        reviewJobId: "idemp-key-1",
        repositoryId: "repo-123",
        installationId: "12345",
        pullRequestNumber: 42,
        headSha: "head-sha-456",
        deliveryId: "deliv-789",
      },
    } as unknown as Job<ReviewJobPayload>;

    const result = await processReviewJob(mockJob);

    expect(result.processed).toBe(true);
    expect(result.findingsCount).toBe(1);

    expect(prisma.repository.findUnique).toHaveBeenCalledWith({
      where: { id: "repo-123" },
    });
    expect(prisma.pullRequest.upsert).toHaveBeenCalled();
    expect(prisma.reviewJob.upsert).toHaveBeenCalled();
    expect(runBugReviewAgent).toHaveBeenCalled();
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it("throws error if repository is not found in database", async () => {
    vi.mocked(prisma.repository.findUnique).mockResolvedValueOnce(null);

    const mockJob = {
      id: "job-abc",
      data: {
        reviewJobId: "idemp-key-1",
        repositoryId: "repo-unknown",
        installationId: "12345",
        pullRequestNumber: 42,
        headSha: "head-sha-456",
        deliveryId: "deliv-789",
      },
    } as unknown as Job<ReviewJobPayload>;

    await expect(processReviewJob(mockJob)).rejects.toThrow("Repository repo-unknown not found");
  });
});

