import { describe, it, expect, vi, beforeEach } from "vitest";
import { TenantConcurrencyLimiter } from "../concurrency-limiter.js";
import { cleanupOldData, exportTenantData } from "../retention-service.js";
import { prisma } from "@acr/database";

vi.mock("@acr/database", () => {
  return {
    prisma: {
      webhookDelivery: {
        count: vi.fn(),
        deleteMany: vi.fn(),
      },
      reviewJob: {
        count: vi.fn(),
        findMany: vi.fn(),
        deleteMany: vi.fn(),
      },
      finding: {
        deleteMany: vi.fn(),
      },
      findingFeedback: {
        deleteMany: vi.fn(),
      },
      agentRun: {
        deleteMany: vi.fn(),
      },
      repository: {
        findMany: vi.fn(),
      },
    },
  };
});

describe("TenantConcurrencyLimiter", () => {
  let limiter: TenantConcurrencyLimiter;

  beforeEach(() => {
    limiter = new TenantConcurrencyLimiter({
      defaultLimit: 2,
      tenantOverrides: {
        "enterprise-tenant": 5,
      },
    });
  });

  it("allows acquiring slots up to default limit", () => {
    expect(limiter.tryAcquire("tenant-a")).toBe(true);
    expect(limiter.getActiveCount("tenant-a")).toBe(1);

    expect(limiter.tryAcquire("tenant-a")).toBe(true);
    expect(limiter.getActiveCount("tenant-a")).toBe(2);

    // Limit reached
    expect(limiter.tryAcquire("tenant-a")).toBe(false);
    expect(limiter.getActiveCount("tenant-a")).toBe(2);
  });

  it("respects per-tenant overrides", () => {
    for (let i = 0; i < 5; i++) {
      expect(limiter.tryAcquire("enterprise-tenant")).toBe(true);
    }
    // 6th attempt should be blocked
    expect(limiter.tryAcquire("enterprise-tenant")).toBe(false);
  });

  it("releases slot accurately", () => {
    limiter.tryAcquire("tenant-b");
    expect(limiter.getActiveCount("tenant-b")).toBe(1);

    limiter.release("tenant-b");
    expect(limiter.getActiveCount("tenant-b")).toBe(0);

    // Can acquire again after release
    expect(limiter.tryAcquire("tenant-b")).toBe(true);
  });
});

describe("Retention & Compliance Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("performs dry run without deleting records", async () => {
    vi.mocked(prisma.webhookDelivery.count).mockResolvedValue(15);
    vi.mocked(prisma.reviewJob.count).mockResolvedValue(5);

    const result = await cleanupOldData({ olderThanDays: 30, dryRun: true });

    expect(result.dryRun).toBe(true);
    expect(result.deletedDeliveries).toBe(15);
    expect(result.deletedJobs).toBe(5);
    expect(prisma.webhookDelivery.deleteMany).not.toHaveBeenCalled();
    expect(prisma.reviewJob.deleteMany).not.toHaveBeenCalled();
  });

  it("executes deletion of old deliveries and jobs", async () => {
    vi.mocked(prisma.webhookDelivery.deleteMany).mockResolvedValue({ count: 12 });
    vi.mocked(prisma.reviewJob.findMany).mockResolvedValue([{ id: "job-1" }, { id: "job-2" }] as any);
    vi.mocked(prisma.findingFeedback.deleteMany).mockResolvedValue({ count: 2 });
    vi.mocked(prisma.finding.deleteMany).mockResolvedValue({ count: 4 });
    vi.mocked(prisma.agentRun.deleteMany).mockResolvedValue({ count: 6 });
    vi.mocked(prisma.reviewJob.deleteMany).mockResolvedValue({ count: 2 });

    const result = await cleanupOldData({ olderThanDays: 30, dryRun: false });

    expect(result.dryRun).toBe(false);
    expect(result.deletedDeliveries).toBe(12);
    expect(result.deletedJobs).toBe(2);
    expect(prisma.webhookDelivery.deleteMany).toHaveBeenCalled();
    expect(prisma.reviewJob.deleteMany).toHaveBeenCalled();
  });

  it("exports tenant review data correctly", async () => {
    vi.mocked(prisma.repository.findMany).mockResolvedValue([
      {
        id: "repo-1",
        owner: "octocat",
        name: "hello-world",
        pullRequests: [
          {
            githubPrNumber: 42,
            title: "Fix bug",
            reviewJobs: [
              {
                id: "job-1",
                headSha: "abc1234",
                status: "completed",
                startedAt: new Date("2026-11-01"),
                completedAt: new Date("2026-11-01"),
                findings: [
                  {
                    id: "finding-1",
                    category: "correctness",
                    severity: "high",
                    filePath: "src/index.ts",
                    line: 10,
                    description: "Null check missing",
                    verificationStatus: "verified",
                  },
                ],
              },
            ],
          },
        ],
      },
    ] as any);

    const exportResult = await exportTenantData("inst-123");

    expect(exportResult.installationId).toBe("inst-123");
    expect(exportResult.repositories).toHaveLength(1);
    expect(exportResult.repositories[0]?.pullRequests[0]?.reviewJobs[0]?.findings[0]?.category).toBe("correctness");
  });
});

