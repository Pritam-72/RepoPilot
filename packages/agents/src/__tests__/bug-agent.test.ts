import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReviewAgentInput } from "@acr/review-contracts";

// Mock the LLM provider so tests don't call real APIs
vi.mock("../llm-provider.js", () => ({
  generateStructuredOutput: vi.fn(),
}));

const { generateStructuredOutput } = await import("../llm-provider.js");
const { runBugReviewAgent } = await import("../bug-agent.js");

// Minimal ReviewAgentInput for the off-by-one bug fixture
// Patch line +3 means new file line 3 was added (the end = start + size + 1 bug)
const OFF_BY_ONE_INPUT: ReviewAgentInput = {
  repository: { owner: "acme", name: "app", repositoryId: 1 },
  pullRequest: { number: 10, baseSha: "base", headSha: "head", title: "Fix pagination" },
  changedFiles: [
    {
      path: "src/paginate.ts",
      status: "modified",
      // Patch: lines 2 and 3 are changed (replaced start and end calculations)
      patch: `@@ -1,5 +1,5 @@
 export function getPage(items: string[], page: number, size: number): string[] {
-  const start = page * size;
-  const end = start + size;
+  const start = (page - 1) * size;
+  const end = start + size + 1;
   return items.slice(start, end);
 }`,
      additions: 2,
      deletions: 2,
    },
  ],
  context: [],
  reviewPolicy: { enabledCategories: ["correctness"], minimumConfidence: 0.5 },
};

const CLEAN_INPUT: ReviewAgentInput = {
  repository: { owner: "acme", name: "app", repositoryId: 1 },
  pullRequest: { number: 11, baseSha: "base", headSha: "head", title: "Refactor" },
  changedFiles: [
    {
      path: "src/utils.ts",
      status: "modified",
      patch: `@@ -1,3 +1,3 @@
-export const VERSION = "1.0.0";
+export const VERSION = "1.0.1";
 export function noop() {}`,
      additions: 1,
      deletions: 1,
    },
  ],
  context: [],
  reviewPolicy: { enabledCategories: ["correctness"], minimumConfidence: 0.5 },
};

describe("runBugReviewAgent", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns verified finding for bug on a changed line", async () => {
    vi.mocked(generateStructuredOutput).mockResolvedValueOnce({
      findings: [
        {
          title: "Off-by-one in pagination end index",
          category: "correctness",
          severity: "high",
          confidence: 0.95,
          file: "src/paginate.ts",
          line: 3, // line 3 = the "+  const end = start + size + 1;" line in the new file
          description: "end should be start + size, not start + size + 1",
          evidence: "const end = start + size + 1;",
          recommendation: "Change to: const end = start + size;",
          verificationStatus: "unverified",
        },
      ],
    });

    const result = await runBugReviewAgent(OFF_BY_ONE_INPUT);
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]!.category).toBe("correctness");
    expect(result.findings[0]!.file).toBe("src/paginate.ts");
  });

  it("filters out findings on non-changed lines", async () => {
    vi.mocked(generateStructuredOutput).mockResolvedValueOnce({
      findings: [
        {
          title: "Hallucinated finding",
          category: "correctness",
          severity: "low",
          confidence: 0.3,
          file: "src/paginate.ts",
          line: 100, // line 100 is NOT a changed line
          description: "Non-existent issue",
          evidence: "...",
          verificationStatus: "unverified",
        },
      ],
    });

    const result = await runBugReviewAgent(OFF_BY_ONE_INPUT);
    expect(result.findings).toHaveLength(0);
  });

  it("returns empty findings for clean PR", async () => {
    vi.mocked(generateStructuredOutput).mockResolvedValueOnce({ findings: [] });
    const result = await runBugReviewAgent(CLEAN_INPUT);
    expect(result.findings).toEqual([]);
  });
});

