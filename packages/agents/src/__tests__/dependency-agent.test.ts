import { describe, it, expect, vi, beforeEach } from "vitest";
import { runDependencyReviewAgent } from "../dependency-agent.js";
import type { ReviewAgentInput } from "@acr/review-contracts";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

import { generateObject } from "ai";

describe("DependencyReviewAgent (Task 9.1)", () => {
  const sampleInput: ReviewAgentInput = {
    repository: { repositoryId: 1, owner: "acme", name: "app" },
    pullRequest: {
      number: 60,
      title: "chore: update dependencies",
      baseSha: "base123",
      headSha: "head456",
    },
    changedFiles: [
      {
        path: "package.json",
        status: "modified",
        additions: 2,
        deletions: 1,
        patch: `@@ -15,3 +15,4 @@
   "dependencies": {
-    "lodash": "^4.17.20"
+    "lodash": "4.17.15",
+    "event-stream": "*"
   }`,
      },
    ],
    context: [],
    reviewPolicy: { enabledCategories: ["dependency"], minimumConfidence: 0.5 },
  };

  beforeEach(() => {
    vi.mocked(generateObject).mockClear();
  });

  it("detects vulnerable or wildcard dependencies on changed lines", async () => {
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: {
        findings: [
          {
            title: "Wildcard dependency version pin",
            category: "dependency",
            severity: "high",
            confidence: 0.96,
            file: "package.json",
            line: 16,
            description: "Using wildcard '*' allows automatic installation of untrusted updates",
            evidence: '"event-stream": "*"',
            recommendation: "Pin exact version or tight semver range",
            ruleId: "wildcard-dependency",
            verificationStatus: "unverified",
          },
        ],
      },
    } as any);

    const result = await runDependencyReviewAgent(sampleInput);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]?.category).toBe("dependency");
    expect(result.findings[0]?.line).toBe(16);
  });

  it("returns empty findings array when dependencies are clean and pinned", async () => {
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: { findings: [] },
    } as any);

    const result = await runDependencyReviewAgent(sampleInput);
    expect(result.findings).toHaveLength(0);
  });
});
