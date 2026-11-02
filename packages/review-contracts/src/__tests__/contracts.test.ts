import { describe, it, expect } from "vitest";
import { FindingSchema, AgentOutputSchema } from "../findings.schema.js";
import { ReviewJobPayloadSchema } from "../events.schema.js";

const validFinding = {
  title: "SQL Injection vulnerability",
  category: "security" as const,
  severity: "critical" as const,
  confidence: 0.95,
  file: "src/db.ts",
  line: 2,
  description: "User input concatenated directly into SQL query",
  evidence: "db.query(`SELECT * FROM users WHERE name = '${username}'`)",
  verificationStatus: "unverified" as const,
};

describe("FindingSchema", () => {
  it("accepts valid finding data", () => {
    const result = FindingSchema.safeParse(validFinding);
    expect(result.success).toBe(true);
  });

  it("rejects confidence > 1", () => {
    const result = FindingSchema.safeParse({ ...validFinding, confidence: 1.5 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("confidence"))).toBe(true);
    }
  });

  it("rejects unknown severity", () => {
    const result = FindingSchema.safeParse({ ...validFinding, severity: "unknown" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("severity"))).toBe(true);
    }
  });

  it("rejects empty title", () => {
    const result = FindingSchema.safeParse({ ...validFinding, title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive line number", () => {
    const result = FindingSchema.safeParse({ ...validFinding, line: 0 });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields when absent", () => {
    const { impact, recommendation, ruleId, endLine, ...minimal } = {
      ...validFinding,
      impact: "Data breach",
      recommendation: "Use parameterized queries",
      ruleId: "sql-injection",
      endLine: 5,
    };
    const result = FindingSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });
});

describe("AgentOutputSchema", () => {
  it("accepts empty findings array", () => {
    const result = AgentOutputSchema.safeParse({
      agent: "security-agent",
      summary: "No issues found",
      findings: [],
      status: "completed",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid findings array", () => {
    const result = AgentOutputSchema.safeParse({
      agent: "security-agent",
      summary: "Found 1 critical issue",
      findings: [validFinding],
      status: "completed",
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown status", () => {
    const result = AgentOutputSchema.safeParse({
      agent: "security-agent",
      summary: "done",
      findings: [],
      status: "done",
    });
    expect(result.success).toBe(false);
  });
});

describe("ReviewJobPayloadSchema", () => {
  it("validates a correct payload", () => {
    const result = ReviewJobPayloadSchema.safeParse({
      reviewJobId: "job-123",
      repositoryId: "repo-456",
      installationId: "inst-789",
      pullRequestNumber: 42,
      headSha: "abc123def456",
      deliveryId: "delivery-001",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = ReviewJobPayloadSchema.safeParse({
      reviewJobId: "job-123",
      repositoryId: "repo-456",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-number pullRequestNumber", () => {
    const result = ReviewJobPayloadSchema.safeParse({
      reviewJobId: "job-123",
      repositoryId: "repo-456",
      installationId: "inst-789",
      pullRequestNumber: "42",
      headSha: "abc123",
      deliveryId: "delivery-001",
    });
    expect(result.success).toBe(false);
  });
});
