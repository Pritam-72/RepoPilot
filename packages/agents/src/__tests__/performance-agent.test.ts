import { describe, it, expect, vi, beforeEach } from "vitest";
import { runPerformanceReviewAgent } from "../performance-agent.js";
import type { ReviewAgentInput } from "@acr/review-contracts";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

import { generateObject } from "ai";

describe("PerformanceReviewAgent (Task 9.1)", () => {
  const sampleInput: ReviewAgentInput = {
    repository: { repositoryId: 1, owner: "acme", name: "app" },
    pullRequest: {
      number: 50,
      title: "perf: optimize order queries",
      description: "Addresses slow loading times",
      baseSha: "base123",
      headSha: "head456",
    },
    changedFiles: [
      {
        path: "src/orders.ts",
        status: "modified",
        additions: 5,
        deletions: 1,
        patch: `@@ -10,3 +10,5 @@
+  for (const order of orders) {
+    const details = await db.query('SELECT * FROM items WHERE order_id = $1', [order.id]);
+  }`,
      },
    ],
    context: [],
    reviewPolicy: { enabledCategories: ["performance"], minimumConfidence: 0.5 },
  };

  beforeEach(() => {
    vi.mocked(generateObject).mockClear();
  });

  it("identifies N+1 query performance bottleneck on changed lines", async () => {
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: {
        findings: [
          {
            title: "N+1 query inside loop",
            category: "performance",
            severity: "high",
            confidence: 0.95,
            file: "src/orders.ts",
            line: 11,
            description: "Querying items inside an orders loop creates N+1 query traffic",
            evidence: "const details = await db.query('SELECT * FROM items WHERE order_id = $1', [order.id]);",
            recommendation: "Batch query items using WHERE order_id IN (...) or a JOIN query",
            ruleId: "n-plus-one-query",
            verificationStatus: "unverified",
          },
        ],
      },
    } as any);

    const result = await runPerformanceReviewAgent(sampleInput);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]?.category).toBe("performance");
    expect(result.findings[0]?.ruleId).toBe("n-plus-one-query");
    expect(result.findings[0]?.line).toBe(11);
  });

  it("filters out findings pointing to unchanged lines", async () => {
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: {
        findings: [
          {
            title: "Unrelated performance warning",
            category: "performance",
            severity: "low",
            confidence: 0.8,
            file: "src/orders.ts",
            line: 99, // Unchanged line
            description: "Cache could be added here",
            evidence: "return cached;",
            verificationStatus: "unverified",
          },
        ],
      },
    } as any);

    const result = await runPerformanceReviewAgent(sampleInput);
    expect(result.findings).toHaveLength(0);
  });

  it("returns empty findings array when code has no performance issues", async () => {
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: { findings: [] },
    } as any);

    const result = await runPerformanceReviewAgent(sampleInput);
    expect(result.findings).toHaveLength(0);
  });
});
