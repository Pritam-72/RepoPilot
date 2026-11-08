import { describe, it, expect } from "vitest";
import {
  parseCommentCommand,
  parseCommentReaction,
  extractFindingMarkerFromComment,
  filterDismissedFindings,
} from "../feedback-parser.js";
import type { Finding } from "@acr/review-contracts";

describe("Developer Feedback & Command Parser (Phase 8)", () => {
  describe("parseCommentCommand", () => {
    it("parses /dismiss command with reason", () => {
      const result = parseCommentCommand("/dismiss False positive, this is intentional mock data");
      expect(result.command).toBe("dismiss");
      expect(result.arg).toBe("False positive, this is intentional mock data");
    });

    it("parses /dismiss without reason", () => {
      const result = parseCommentCommand("/dismiss");
      expect(result.command).toBe("dismiss");
      expect(result.arg).toBeUndefined();
    });

    it("parses @repopilot dismiss command variant", () => {
      const result = parseCommentCommand("@repopilot dismiss Not applicable for internal tests");
      expect(result.command).toBe("dismiss");
      expect(result.arg).toBe("Not applicable for internal tests");
    });

    it("parses /accept command", () => {
      const result = parseCommentCommand("/accept Will fix in follow up");
      expect(result.command).toBe("accept");
      expect(result.arg).toBe("Will fix in follow up");
    });

    it("parses /ignore-rule command", () => {
      const result = parseCommentCommand("/ignore-rule no-explicit-any");
      expect(result.command).toBe("ignore-rule");
      expect(result.arg).toBe("no-explicit-any");
    });

    it("parses /review and /acr review re-trigger commands", () => {
      expect(parseCommentCommand("/review").command).toBe("review");
      expect(parseCommentCommand("/acr review").command).toBe("review");
      expect(parseCommentCommand("@acr review").command).toBe("review");
    });

    it("returns null for non-command comments", () => {
      const result = parseCommentCommand("Looks good to me, thanks!");
      expect(result.command).toBeNull();
    });
  });

  describe("parseCommentReaction", () => {
    it("maps positive reactions to 'useful'", () => {
      expect(parseCommentReaction("+1")).toBe("useful");
      expect(parseCommentReaction("thumbs_up")).toBe("useful");
      expect(parseCommentReaction("rocket")).toBe("useful");
      expect(parseCommentReaction("heart")).toBe("useful");
    });

    it("maps negative/confused reactions to 'incorrect'", () => {
      expect(parseCommentReaction("-1")).toBe("incorrect");
      expect(parseCommentReaction("thumbs_down")).toBe("incorrect");
      expect(parseCommentReaction("confused")).toBe("incorrect");
    });

    it("returns null for unrecognized reactions", () => {
      expect(parseCommentReaction("smile")).toBeNull();
    });
  });

  describe("extractFindingMarkerFromComment", () => {
    it("extracts file, line, category and ruleId from comment marker", () => {
      const commentBody =
        "Some comment text\n<!-- acr-finding:packages/api/server.ts:42:security:SQL-01 -->\nMore text";
      const marker = extractFindingMarkerFromComment(commentBody);
      expect(marker).not.toBeNull();
      expect(marker?.file).toBe("packages/api/server.ts");
      expect(marker?.line).toBe(42);
      expect(marker?.category).toBe("security");
      expect(marker?.ruleId).toBe("SQL-01");
    });

    it("returns null when no marker is present", () => {
      expect(extractFindingMarkerFromComment("Regular comment without marker")).toBeNull();
    });
  });

  describe("filterDismissedFindings", () => {
    it("filters out findings that match previously dismissed markers or rules", () => {
      const findings: Finding[] = [
        {
          title: "SQL Injection",
          category: "security",
          severity: "critical",
          confidence: 0.9,
          file: "src/db.ts",
          line: 10,
          description: "desc",
          evidence: "ev",
          ruleId: "SQL-01",
          verificationStatus: "verified",
        },
        {
          title: "Unhandled Error",
          category: "correctness",
          severity: "high",
          confidence: 0.85,
          file: "src/api.ts",
          line: 25,
          description: "desc",
          evidence: "ev",
          ruleId: "ERR-02",
          verificationStatus: "verified",
        },
        {
          title: "Unused Import",
          category: "maintainability",
          severity: "low",
          confidence: 0.7,
          file: "src/util.ts",
          line: 5,
          description: "desc",
          evidence: "ev",
          ruleId: "LINT-03",
          verificationStatus: "verified",
        },
      ];

      const dismissedFingerprints = new Set(["src/db.ts:10:security:SQL-01"]);
      const dismissedRules = new Set(["LINT-03"]);

      const { active, suppressed } = filterDismissedFindings(
        findings,
        dismissedFingerprints,
        dismissedRules
      );

      expect(active).toHaveLength(1);
      expect(active[0]!.title).toBe("Unhandled Error");

      expect(suppressed).toHaveLength(2);
      expect(suppressed.map((s) => s.title)).toContain("SQL Injection");
      expect(suppressed.map((s) => s.title)).toContain("Unused Import");
    });
  });
});
