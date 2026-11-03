import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../server.js";
import { prisma } from "@acr/database";

vi.mock("@acr/database", () => {
  return {
    prisma: {
      reviewJob: {
        count: vi.fn(),
        findMany: vi.fn(),
      },
      finding: {
        count: vi.fn(),
        groupBy: vi.fn(),
      },
      findingFeedback: {
        count: vi.fn(),
      },
      repository: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
    },
  };
});

describe("Analytics API (/api/v1/analytics/overview)", () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns aggregate review metrics and findings distributions", async () => {
    vi.mocked(prisma.reviewJob.count)
      .mockResolvedValueOnce(50) // totalReviews
      .mockResolvedValueOnce(45) // completedReviews
      .mockResolvedValueOnce(5); // failedReviews

    vi.mocked(prisma.finding.count)
      .mockResolvedValueOnce(120) // totalFindings
      .mockResolvedValueOnce(115); // verifiedFindings

    vi.mocked(prisma.finding.groupBy)
      .mockResolvedValueOnce([
        { severity: "critical", _count: { _all: 10 } },
        { severity: "high", _count: { _all: 30 } },
        { severity: "medium", _count: { _all: 50 } },
        { severity: "low", _count: { _all: 25 } },
        { severity: "informational", _count: { _all: 5 } },
      ] as any)
      .mockResolvedValueOnce([
        { category: "correctness", _count: { _all: 40 } },
        { category: "security", _count: { _all: 35 } },
        { category: "performance", _count: { _all: 20 } },
        { category: "quality", _count: { _all: 15 } },
        { category: "dependency", _count: { _all: 10 } },
      ] as any);

    vi.mocked(prisma.findingFeedback.count)
      .mockResolvedValueOnce(25) // useful
      .mockResolvedValueOnce(2)  // incorrect
      .mockResolvedValueOnce(3);  // dismissed

    vi.mocked(prisma.reviewJob.findMany).mockResolvedValueOnce([
      {
        startedAt: new Date(100000),
        completedAt: new Date(104500), // 4.5s
      },
    ] as any);

    const res = await request(app).get("/api/v1/analytics/overview");

    expect(res.status).toBe(200);
    expect(res.body.metrics.reviews.total).toBe(50);
    expect(res.body.metrics.reviews.completed).toBe(45);
    expect(res.body.metrics.reviews.successRate).toBe(90.0);
    expect(res.body.metrics.findings.total).toBe(120);
    expect(res.body.metrics.findings.verified).toBe(115);
    expect(res.body.metrics.findings.bySeverity.critical).toBe(10);
    expect(res.body.metrics.findings.byCategory.security).toBe(35);
    expect(res.body.metrics.feedback.acceptanceRate).toBe(83.3); // 25 / 30 = 83.3%
  });

  it("scopes analytics by tenant when x-installation-id header is provided", async () => {
    vi.mocked(prisma.reviewJob.count).mockResolvedValue(5);
    vi.mocked(prisma.finding.count).mockResolvedValue(10);
    vi.mocked(prisma.finding.groupBy).mockResolvedValue([]);
    vi.mocked(prisma.findingFeedback.count).mockResolvedValue(0);
    vi.mocked(prisma.reviewJob.findMany).mockResolvedValue([]);

    const res = await request(app)
      .get("/api/v1/analytics/overview")
      .set("x-installation-id", "inst-org-42");

    expect(res.status).toBe(200);
    expect(prisma.reviewJob.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          repository: { installationId: "inst-org-42" },
        }),
      })
    );
  });
});

