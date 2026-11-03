import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../server.js";
import { prisma } from "@acr/database";

vi.mock("@acr/database", () => {
  return {
    prisma: {
      finding: {
        findUnique: vi.fn(),
      },
    },
  };
});

describe("Test Proposals API (/api/v1/test-proposals)", () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates a regression test proposal for a verified finding", async () => {
    vi.mocked(prisma.finding.findUnique).mockResolvedValue({
      id: "finding-paginate-1",
      filePath: "src/paginate.ts",
      line: 4,
      category: "correctness",
      severity: "high",
      confidence: 0.95,
      title: "Off by one error",
      description: "Slice end exceeds bounds",
      evidence: "const end = start + size + 1;",
      recommendation: "Use start + size",
      verificationStatus: "verified",
    } as any);

    const res = await request(app)
      .post("/api/v1/test-proposals")
      .send({
        findingId: "finding-paginate-1",
        sourceContent: "export function getPage() { return []; }",
      });

    expect(res.status).toBe(201);
    expect(res.body.proposal).toBeDefined();
    expect(res.body.proposal.findingId).toBe("finding-paginate-1");
    expect(res.body.proposal.framework).toBe("vitest");
    expect(res.body.proposal.testCode).toContain("describe");
  });

  it("rejects test generation with 400 when finding is unverified", async () => {
    vi.mocked(prisma.finding.findUnique).mockResolvedValue({
      id: "finding-unverified",
      filePath: "src/paginate.ts",
      line: 4,
      verificationStatus: "unverified",
    } as any);

    const res = await request(app)
      .post("/api/v1/test-proposals")
      .send({
        findingId: "finding-unverified",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("is not verified");
  });

  it("returns 404 when finding does not exist", async () => {
    vi.mocked(prisma.finding.findUnique).mockResolvedValue(null);

    const res = await request(app)
      .post("/api/v1/test-proposals")
      .send({
        findingId: "nonexistent",
      });

    expect(res.status).toBe(404);
  });
});
