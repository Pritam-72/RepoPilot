import { describe, it, expect, vi } from "vitest";
import type { Octokit } from "@octokit/rest";
import type { Finding, AnalysisCoverage } from "@acr/review-contracts";
import {
  publishPRReview,
  formatInlineComment,
  generateReviewSummary,
  parseCommentCommand,
  parseCommentReaction,
  filterDismissedFindings,
} from "@acr/github";

describe("Phase 8 GitHub Review Publishing & Developer Feedback Verification", () => {
  const mockFinding1: Finding = {
    title: "SQL Injection in User Lookup",
    category: "security",
    severity: "critical",
    confidence: 0.95,
    file: "src/auth/user-service.ts",
    line: 42,
    endLine: 45,
    description: "Raw query concatenation enables arbitrary SQL execution.",
    evidence: "db.query(`SELECT * FROM users WHERE id = ${id}`)",
    recommendation: "Use parameterized queries with prepared statements.",
    ruleId: "SEC-SQL-01",
    verificationStatus: "verified",
  };

  const mockFinding2: Finding = {
    title: "Missing Null Check on Profile",
    category: "correctness",
    severity: "high",
    confidence: 0.9,
    file: "src/auth/profile.ts",
    line: 18,
    description: "Property access on potentially null profile object.",
    evidence: "const name = profile.name;",
    recommendation: "Use optional chaining profile?.name.",
    ruleId: "BUG-NULL-02",
    verificationStatus: "verified",
  };

  const sampleCoverage: AnalysisCoverage = {
    totalFiles: 2,
    analyzedFiles: ["src/auth/user-service.ts", "src/auth/profile.ts"],
    skippedFiles: [],
    totalAgents: 4,
    successfulAgents: ["bug", "security", "error-handling", "performance"],
    degradedAgents: [],
    reviewStatus: "completed",
    coveragePercentage: 100,
    tokenUsage: { promptTokens: 3200, completionTokens: 850, totalTokens: 4050 },
    costCapReached: false,
  };

  describe("Single PR Review Publishing & Line Anchoring", () => {
    it("formats inline comment with permalink, category, and feedback guidance", () => {
      const comment = formatInlineComment(mockFinding1, {
        owner: "acme-corp",
        repo: "payment-gateway",
        commitSha: "abc1234567890",
      });

      expect(comment).toContain("<!-- acr-finding:src/auth/user-service.ts:42:security:SEC-SQL-01 -->");
      expect(comment).toContain("🚨 [CRITICAL] SQL Injection in User Lookup");
      expect(comment).toContain("https://github.com/acme-corp/payment-gateway/blob/abc1234567890/src/auth/user-service.ts#L42-L45");
      expect(comment).toContain("Reply with `/dismiss [reason]` or `/accept` to record review feedback.");
    });

    it("publishes a single consolidated review containing inline comments and summary body with coverage", async () => {
      const createReviewMock = vi.fn().mockResolvedValue({ data: { id: 777 } });
      const mockOctokit = {
        pulls: {
          listReviewComments: vi.fn().mockResolvedValue({ data: [] }),
          createReview: createReviewMock,
        },
      } as unknown as Octokit;

      const changedLines = new Map<string, Set<number>>([
        ["src/auth/user-service.ts", new Set([42, 43, 44])],
        ["src/auth/profile.ts", new Set([18])],
      ]);

      const result = await publishPRReview({
        octokit: mockOctokit,
        owner: "acme-corp",
        repo: "payment-gateway",
        prNumber: 101,
        commitSha: "abc1234567890",
        findings: [mockFinding1, mockFinding2],
        changedLinesByFile: changedLines,
        coverage: sampleCoverage,
      });

      expect(result.reviewId).toBe(777);
      expect(result.inlineCommentsCount).toBe(2);
      expect(result.isDryRun).toBe(false);

      expect(createReviewMock).toHaveBeenCalledOnce();
      const call = createReviewMock.mock.calls[0]![0];
      expect(call.event).toBe("COMMENT");
      expect(call.comments).toHaveLength(2);
      expect(call.body).toContain("RepoPilot AI Code Review Summary");
      expect(call.body).toContain("Analysis Coverage");
      expect(call.body).toContain("✅ Completed");
    });
  });

  describe("Dry-Run Mode", () => {
    it("constructs full review payload without making network calls when dryRun is true", async () => {
      const createReviewMock = vi.fn();
      const mockOctokit = {
        pulls: {
          listReviewComments: vi.fn().mockResolvedValue({ data: [] }),
          createReview: createReviewMock,
        },
      } as unknown as Octokit;

      const changedLines = new Map<string, Set<number>>([
        ["src/auth/user-service.ts", new Set([42])],
      ]);

      const result = await publishPRReview({
        octokit: mockOctokit,
        owner: "acme-corp",
        repo: "payment-gateway",
        prNumber: 101,
        commitSha: "abc1234567890",
        findings: [mockFinding1],
        changedLinesByFile: changedLines,
        coverage: sampleCoverage,
        dryRun: true,
      });

      expect(result.isDryRun).toBe(true);
      expect(result.reviewId).toBeUndefined();
      expect(result.inlineCommentsCount).toBe(1);
      expect(result.reviewBody).toContain("Analysis Coverage");
      // Verified zero network mutations in dry-run mode
      expect(createReviewMock).not.toHaveBeenCalled();
    });
  });

  describe("Outdating Stale Comments on Re-push", () => {
    it("identifies prior comments on lines no longer present in changedLinesByFile", async () => {
      const priorComments = [
        {
          id: 501,
          path: "src/auth/user-service.ts",
          line: 42,
          body: "<!-- acr-finding:src/auth/user-service.ts:42:security:SEC-SQL-01 -->",
        },
        {
          id: 502,
          path: "src/auth/profile.ts",
          line: 88, // Stale line that was fixed or removed
          body: "<!-- acr-finding:src/auth/profile.ts:88:bug:BUG-OLD-01 -->",
        },
      ];

      const createReviewMock = vi.fn().mockResolvedValue({ data: { id: 888 } });
      const mockOctokit = {
        pulls: {
          createReview: createReviewMock,
        },
      } as unknown as Octokit;

      const changedLines = new Map<string, Set<number>>([
        ["src/auth/user-service.ts", new Set([42])],
        ["src/auth/profile.ts", new Set([18])], // line 88 is gone
      ]);

      const result = await publishPRReview({
        octokit: mockOctokit,
        owner: "acme-corp",
        repo: "payment-gateway",
        prNumber: 101,
        commitSha: "new-push-sha",
        findings: [mockFinding1],
        changedLinesByFile: changedLines,
        existingComments: priorComments,
      });

      expect(result.outdatedCommentsCount).toBe(1);
      // Already posted finding 1 is skipped to avoid duplicate spam
      expect(result.skippedDuplicatesCount).toBe(1);
    });
  });

  describe("Developer Feedback & Command Handling", () => {
    it("parses developer /dismiss command with reason", () => {
      const cmd = parseCommentCommand("/dismiss False positive: sanitized by upstream gateway");
      expect(cmd.command).toBe("dismiss");
      expect(cmd.arg).toBe("False positive: sanitized by upstream gateway");
    });

    it("parses developer /accept command", () => {
      const cmd = parseCommentCommand("/accept Good catch, updating PR");
      expect(cmd.command).toBe("accept");
      expect(cmd.arg).toBe("Good catch, updating PR");
    });

    it("parses developer /ignore-rule command", () => {
      const cmd = parseCommentCommand("/ignore-rule SEC-SQL-01");
      expect(cmd.command).toBe("ignore-rule");
      expect(cmd.arg).toBe("SEC-SQL-01");
    });

    it("parses developer /review re-run command", () => {
      expect(parseCommentCommand("/review").command).toBe("review");
      expect(parseCommentCommand("/acr review").command).toBe("review");
    });

    it("parses reaction sentiments correctly", () => {
      expect(parseCommentReaction("thumbs_up")).toBe("useful");
      expect(parseCommentReaction("rocket")).toBe("useful");
      expect(parseCommentReaction("thumbs_down")).toBe("incorrect");
      expect(parseCommentReaction("confused")).toBe("incorrect");
    });
  });

  describe("Suppression of Dismissed Findings (Self-Improvement)", () => {
    it("suppresses repeated findings on the repo when previously dismissed by developer", () => {
      const dismissedFingerprints = new Set([
        "src/auth/user-service.ts:42:security:SEC-SQL-01",
      ]);

      const { active, suppressed } = filterDismissedFindings(
        [mockFinding1, mockFinding2],
        dismissedFingerprints
      );

      expect(active).toHaveLength(1);
      expect(active[0]!.title).toBe("Missing Null Check on Profile");

      expect(suppressed).toHaveLength(1);
      expect(suppressed[0]!.title).toBe("SQL Injection in User Lookup");
    });
  });
});
