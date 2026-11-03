import { describe, it, expect, vi } from "vitest";
import type { Finding } from "@acr/review-contracts";
import type { Octokit } from "@octokit/rest";
import {
  publishPRReview,
  formatInlineComment,
  generateReviewSummary,
  computeFindingMarker,
} from "../publisher.js";

const sampleFinding: Finding = {
  title: "Potential SQL Injection",
  category: "security",
  severity: "critical",
  confidence: 0.95,
  file: "src/db.ts",
  line: 10,
  description: "User input concatenated directly into SQL statement.",
  evidence: "SELECT * FROM users WHERE id = " + "userId",
  recommendation: "Use parameterized query.",
  ruleId: "CWE-89",
  verificationStatus: "verified",
};

const outsideFinding: Finding = {
  title: "Missing Error Handler",
  category: "maintainability",
  severity: "medium",
  confidence: 0.8,
  file: "src/utils.ts",
  line: 50,
  description: "Function does not catch promise rejection.",
  evidence: "await fetch()",
  verificationStatus: "verified",
};

describe("formatInlineComment", () => {
  it("formats inline comment with markdown and hidden marker", () => {
    const formatted = formatInlineComment(sampleFinding);
    expect(formatted).toContain("<!-- acr-finding:src/db.ts:10:security:CWE-89 -->");
    expect(formatted).toContain("CRITICAL");
    expect(formatted).toContain("Potential SQL Injection");
    expect(formatted).toContain("Observed Evidence:");
    expect(formatted).toContain("💡 **Recommendation:**");
  });
});

describe("generateReviewSummary", () => {
  it("generates markdown summary with severity counts and outside findings", () => {
    const summary = generateReviewSummary([sampleFinding, outsideFinding], [outsideFinding]);
    expect(summary).toContain("RepoPilot AI Code Review Summary");
    expect(summary).toContain("Critical | 1");
    expect(summary).toContain("Medium | 1");
    expect(summary).toContain("General & Surrounding Context Findings");
    expect(summary).toContain("src/utils.ts:50");
  });

  it("generates clean pass message when no findings exist", () => {
    const summary = generateReviewSummary([], []);
    expect(summary).toContain("No critical issues found");
  });
});

describe("publishPRReview", () => {
  it("posts inline comments for changed lines and includes outside findings in summary", async () => {
    const createReviewMock = vi.fn().mockResolvedValue({
      data: { id: 12345 },
    });

    const mockOctokit = {
      pulls: {
        listReviewComments: vi.fn().mockResolvedValue({ data: [] }),
        createReview: createReviewMock,
      },
    } as unknown as Octokit;

    const changedLines = new Map<string, Set<number>>([
      ["src/db.ts", new Set([10])], // line 10 is changed
    ]);

    const result = await publishPRReview({
      octokit: mockOctokit,
      owner: "acme",
      repo: "app",
      prNumber: 42,
      commitSha: "sha-abc",
      findings: [sampleFinding, outsideFinding],
      changedLinesByFile: changedLines,
    });

    expect(result.reviewId).toBe(12345);
    expect(result.inlineCommentsCount).toBe(1);
    expect(result.summaryFindingsCount).toBe(1);
    expect(result.skippedDuplicatesCount).toBe(0);

    expect(createReviewMock).toHaveBeenCalledOnce();
    const callArgs = createReviewMock.mock.calls[0]![0];
    expect(callArgs.comments).toHaveLength(1);
    expect(callArgs.comments[0].path).toBe("src/db.ts");
    expect(callArgs.comments[0].line).toBe(10);
    expect(callArgs.body).toContain("General & Surrounding Context Findings");
  });

  it("skips duplicate comments if comment marker already exists on PR", async () => {
    const existingMarker = computeFindingMarker(sampleFinding);
    const createReviewMock = vi.fn().mockResolvedValue({
      data: { id: 67890 },
    });

    const mockOctokit = {
      pulls: {
        createReview: createReviewMock,
      },
    } as unknown as Octokit;

    const changedLines = new Map<string, Set<number>>([
      ["src/db.ts", new Set([10])],
    ]);

    const result = await publishPRReview({
      octokit: mockOctokit,
      owner: "acme",
      repo: "app",
      prNumber: 42,
      commitSha: "sha-abc",
      findings: [sampleFinding],
      changedLinesByFile: changedLines,
      existingComments: [{ body: `Some text\n${existingMarker}\nmore text` }],
    });

    expect(result.inlineCommentsCount).toBe(0);
    expect(result.skippedDuplicatesCount).toBe(1);
    const callArgs = createReviewMock.mock.calls[0]![0];
    expect(callArgs.comments).toHaveLength(0);
  });
});
