import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReviewAgentInput } from "@acr/review-contracts";

vi.mock("../llm-provider.js", () => ({
  generateStructuredOutput: vi.fn(),
}));

const { generateStructuredOutput } = await import("../llm-provider.js");
const { runQualityReviewAgent } = await import("../quality-agent.js");

const COMPLEX_UNTESTED_INPUT: ReviewAgentInput = {
  repository: { owner: "acme", name: "app", repositoryId: 1 },
  pullRequest: { number: 31, baseSha: "base", headSha: "head", title: "Add pricing tiers" },
  changedFiles: [
    {
      path: "src/billing/tier.ts",
      status: "modified",
      patch: `@@ -1,3 +1,6 @@
+export function calculateTier(users: number, enterprise: boolean): string {
+  if (enterprise && users > 500) return 'custom';
+  return users > 100 ? 'pro' : 'starter';
+}`,
      additions: 4,
      deletions: 0,
    },
  ],
  context: [],
  reviewPolicy: { enabledCategories: ["testing", "maintainability"], minimumConfidence: 0.5 },
};

const CLEAN_INPUT: ReviewAgentInput = {
  repository: { owner: "acme", name: "app", repositoryId: 1 },
  pullRequest: { number: 32, baseSha: "base", headSha: "head", title: "Small refactor" },
  changedFiles: [
    {
      path: "src/constants.ts",
      status: "modified",
      patch: `@@ -1,2 +1,2 @@
-export const DEFAULT_LIMIT = 50;
+export const DEFAULT_LIMIT = 100;`,
      additions: 1,
      deletions: 1,
    },
  ],
  context: [],
  reviewPolicy: { enabledCategories: ["testing", "maintainability"], minimumConfidence: 0.5 },
};

describe("runQualityReviewAgent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reports test coverage gap when complex logic is added without tests", async () => {
    vi.mocked(generateStructuredOutput).mockResolvedValueOnce({
      findings: [
        {
          title: "Missing unit test for calculateTier edge cases",
          category: "testing",
          severity: "medium",
          confidence: 0.85,
          file: "src/billing/tier.ts",
          line: 2,
          description: "New multi-branch tier calculation function added without unit tests covering enterprise flag and user thresholds.",
          evidence: "if (enterprise && users > 500) return 'custom';",
          recommendation: "Add unit tests in src/billing/__tests__/tier.test.ts covering all boundary conditions.",
          verificationStatus: "unverified",
        },
      ],
    });

    const result = await runQualityReviewAgent(COMPLEX_UNTESTED_INPUT);
    expect(result.findings).toHaveLength(1);
    const finding = result.findings[0]!;
    expect(finding.category).toBe("testing");
    expect(finding.severity).toBe("medium");
    expect(finding.file).toBe("src/billing/tier.ts");
    expect(finding.line).toBe(2);
  });

  it("returns empty findings for clean well-structured changes", async () => {
    vi.mocked(generateStructuredOutput).mockResolvedValueOnce({ findings: [] });
    const result = await runQualityReviewAgent(CLEAN_INPUT);
    expect(result.findings).toEqual([]);
  });

  it("filters findings that are outside changed lines", async () => {
    vi.mocked(generateStructuredOutput).mockResolvedValueOnce({
      findings: [
        {
          title: "Maintainability finding outside diff",
          category: "maintainability",
          severity: "low",
          confidence: 0.7,
          file: "src/billing/tier.ts",
          line: 999,
          description: "Non-existent line",
          evidence: "...",
          verificationStatus: "unverified",
        },
      ],
    });

    const result = await runQualityReviewAgent(COMPLEX_UNTESTED_INPUT);
    expect(result.findings).toHaveLength(0);
  });
});
