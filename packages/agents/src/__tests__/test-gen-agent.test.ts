import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateRegressionTest, resolveTestMetadata } from "../test-gen-agent.js";
import type { Finding } from "@acr/review-contracts";

describe("TestGenerationAgent (PRD 4.2 & 7.6)", () => {
  const verifiedFinding: Finding = {
    id: "finding-paginate-1",
    file: "src/paginate.ts",
    line: 4,
    category: "correctness",
    severity: "high",
    confidence: 0.95,
    title: "Off-by-one error in pagination end calculation",
    description: "The slice end calculation exceeds bounds by 1",
    evidence: "const end = start + size + 1;",
    recommendation: "Use start + size",
    verificationStatus: "verified",
  };

  const sampleSource = `export function getPage(items: string[], page: number, size: number): string[] {
  const start = (page - 1) * size;
  const end = start + size + 1;
  return items.slice(start, end);
}`;

  it("resolves framework and test file path accurately", () => {
    const tsMeta = resolveTestMetadata("src/utils/paginate.ts");
    expect(tsMeta.framework).toBe("vitest");
    expect(tsMeta.testFile).toContain("paginate.regression.test.ts");

    const pyMeta = resolveTestMetadata("backend/services/auth.py");
    expect(pyMeta.framework).toBe("pytest");
    expect(pyMeta.testFile).toContain("test_auth_regression.py");
  });

  it("throws error when finding is not verified", async () => {
    const unverified: Finding = {
      ...verifiedFinding,
      verificationStatus: "unverified",
    };

    await expect(generateRegressionTest(unverified, sampleSource)).rejects.toThrow(
      /is not verified/
    );
  });

  it("generates regression test proposal with custom LLM client", async () => {
    const mockLlm = vi.fn().mockResolvedValue({
      testCode: `import { describe, it, expect } from "vitest";
import { getPage } from "../paginate.js";

describe("paginate regression test", () => {
  it("returns exactly requested size without off-by-one", () => {
    const items = ["a", "b", "c", "d", "e"];
    const page = getPage(items, 1, 2);
    expect(page).toHaveLength(2);
    expect(page).toEqual(["a", "b"]);
  });
});`,
      explanation: "Tests that getPage returns exactly 2 items instead of 3 on page 1.",
    });

    const proposal = await generateRegressionTest(verifiedFinding, sampleSource, {
      llmClient: mockLlm,
    });

    expect(proposal.id).toBeDefined();
    expect(proposal.findingId).toBe("finding-paginate-1");
    expect(proposal.framework).toBe("vitest");
    expect(proposal.testFile).toContain("paginate.regression.test.ts");
    expect(proposal.testCode).toContain("expect(page).toHaveLength(2)");
    expect(proposal.explanation).toContain("getPage returns exactly 2 items");
  });

  it("falls back to deterministic test generator if LLM fails", async () => {
    // Calling without llmClient in test environment triggers safe deterministic fallback
    const proposal = await generateRegressionTest(verifiedFinding, sampleSource);

    expect(proposal.testCode).toContain("describe");
    expect(proposal.testCode).toContain("expect(true).toBe(true)");
    expect(proposal.explanation).toContain("Deterministic regression test");
  });
});
