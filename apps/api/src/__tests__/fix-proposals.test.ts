import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../server.js";

describe("Fix Proposal Endpoints (Task 8.2)", () => {
  const app = createApp();

  const validFinding = {
    id: "finding-paginate-4",
    title: "Off-by-one error",
    category: "correctness",
    severity: "high",
    confidence: 0.95,
    file: "src/paginate.ts",
    line: 4,
    description: "Adding 1 to end slice violates pagination boundary",
    evidence: "const end = start + size + 1;",
    recommendation: "const end = start + size;",
    verificationStatus: "verified",
  };

  const fileContent = `export function getPage(items: string[], page: number, size: number) {
  const start = (page - 1) * size;
  const end = start + size + 1;
  return items.slice(start, end);
}`;

  it("rejects fix proposal generation for unverified findings with 422", async () => {
    const res = await request(app)
      .post("/api/v1/fix-proposals")
      .send({
        finding: {
          ...validFinding,
          verificationStatus: "unverified",
        },
        fileContent,
      });

    expect(res.status).toBe(422);
    expect(res.body.error).toBe("fix_generation_failed");
    expect(res.body.message).toContain("is not verified");
  });

  it("creates a fix proposal with status pending_approval", async () => {
    const res = await request(app)
      .post("/api/v1/fix-proposals")
      .send({
        finding: validFinding,
        fileContent,
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.file).toBe("src/paginate.ts");
    expect(res.body.status).toBe("pending_approval");
    expect(res.body.patch).toContain("-const end = start + size + 1;");
    expect(res.body.patch).toContain("+const end = start + size;");
  });

  it("retrieves an existing fix proposal by id", async () => {
    const createRes = await request(app)
      .post("/api/v1/fix-proposals")
      .send({
        finding: validFinding,
        fileContent,
      });

    const proposalId = createRes.body.id;

    const getRes = await request(app).get(`/api/v1/fix-proposals/${proposalId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(proposalId);
  });

  it("blocks applying fix before human approval with 403 Forbidden", async () => {
    const createRes = await request(app)
      .post("/api/v1/fix-proposals")
      .send({
        finding: validFinding,
        fileContent,
      });

    const proposalId = createRes.body.id;

    const applyRes = await request(app).post(`/api/v1/fix-proposals/${proposalId}/apply`);
    expect(applyRes.status).toBe(403);
    expect(applyRes.body.error).toBe("approval_required");
  });

  it("approves fix proposal with explicit human approver and allows application", async () => {
    const createRes = await request(app)
      .post("/api/v1/fix-proposals")
      .send({
        finding: validFinding,
        fileContent,
      });

    const proposalId = createRes.body.id;

    // Approve
    const approveRes = await request(app)
      .post(`/api/v1/fix-proposals/${proposalId}/approve`)
      .send({ approvedBy: "senior-engineer-alice" });

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.status).toBe("approved");
    expect(approveRes.body.approvedBy).toBe("senior-engineer-alice");

    // Apply
    const applyRes = await request(app).post(`/api/v1/fix-proposals/${proposalId}/apply`);
    expect(applyRes.status).toBe(200);
    expect(applyRes.body.status).toBe("applied");
  });

  it("allows rejecting a fix proposal", async () => {
    const createRes = await request(app)
      .post("/api/v1/fix-proposals")
      .send({
        finding: validFinding,
        fileContent,
      });

    const proposalId = createRes.body.id;

    const rejectRes = await request(app).post(`/api/v1/fix-proposals/${proposalId}/reject`);
    expect(rejectRes.status).toBe(200);
    expect(rejectRes.body.status).toBe("rejected");
  });
});

