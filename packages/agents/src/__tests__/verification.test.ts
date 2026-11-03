import { describe, it, expect } from "vitest";
import type { Finding } from "@acr/review-contracts";
import {
  verifyAndDeduplicateFindings,
  computeFindingFingerprint,
} from "../verification-service.js";

const fileContents = new Map<string, string>([
  [
    "src/calc.ts",
    `export function calculate(a: number, b: number): number {
  const result = a / b;
  return result;
}`,
  ],
  [
    "src/db.ts",
    `export function query(db: any, name: string) {
  return db.query(\`SELECT * FROM users WHERE name = '\${name}'\`);
}`,
  ],
]);

const changedLines = new Map<string, Set<number>>([
  ["src/calc.ts", new Set([2])],
  ["src/db.ts", new Set([2])],
]);

const validFinding: Finding = {
  title: "Divide by zero risk",
  category: "correctness",
  severity: "high",
  confidence: 0.85,
  file: "src/calc.ts",
  line: 2,
  description: "b could be 0 leading to Infinity or NaN",
  evidence: "const result = a / b;",
  verificationStatus: "unverified",
};

describe("Finding Verification and Deduplication Engine", () => {
  it("verifies valid finding matching file and line", () => {
    const result = verifyAndDeduplicateFindings(
      [validFinding],
      fileContents,
      changedLines
    );

    expect(result.verified).toHaveLength(1);
    expect(result.verified[0]!.verificationStatus).toBe("verified");
    expect(result.rejected).toHaveLength(0);
  });

  it("rejects finding when file does not exist", () => {
    const nonexistent: Finding = {
      ...validFinding,
      file: "src/ghost.ts",
    };

    const result = verifyAndDeduplicateFindings(
      [nonexistent],
      fileContents,
      changedLines
    );

    expect(result.verified).toHaveLength(0);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0]!.reason).toBe("file_not_found");
  });

  it("rejects finding when line is out of bounds", () => {
    const outOfBounds: Finding = {
      ...validFinding,
      line: 999,
    };

    const result = verifyAndDeduplicateFindings(
      [outOfBounds],
      fileContents,
      changedLines
    );

    expect(result.verified).toHaveLength(0);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0]!.reason).toBe("line_out_of_bounds");
  });

  it("rejects finding when evidence is completely mismatched / hallucinated", () => {
    const badEvidence: Finding = {
      ...validFinding,
      evidence: "this line does not exist in any file at all anywhere",
    };

    const result = verifyAndDeduplicateFindings(
      [badEvidence],
      fileContents,
      changedLines
    );

    expect(result.verified).toHaveLength(0);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0]!.reason).toBe("evidence_mismatch");
  });

  it("rejects finding with confidence below threshold", () => {
    const lowConf: Finding = {
      ...validFinding,
      confidence: 0.6, // default threshold is 0.75
    };

    const result = verifyAndDeduplicateFindings(
      [lowConf],
      fileContents,
      changedLines
    );

    expect(result.verified).toHaveLength(0);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0]!.reason).toBe("low_confidence");
  });

  it("rejects finding that is not on a changed line", () => {
    const notChanged: Finding = {
      ...validFinding,
      line: 1, // line 1 is "export function..." which is not in changedLines (only line 2 is changed)
      evidence: "export function calculate",
    };

    const result = verifyAndDeduplicateFindings(
      [notChanged],
      fileContents,
      changedLines,
      { requireChangedLine: true }
    );

    expect(result.verified).toHaveLength(0);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0]!.reason).toBe("not_changed_line");
  });

  it("deduplicates identical findings from multiple agents", () => {
    const finding1: Finding = { ...validFinding, title: "Divide by Zero" };
    const finding2: Finding = { ...validFinding, title: "Divide by zero!" };

    const result = verifyAndDeduplicateFindings(
      [finding1, finding2],
      fileContents,
      changedLines
    );

    expect(result.verified).toHaveLength(1);
    expect(result.stats.duplicatesCount).toBe(1);
  });

  it("deduplicates line-proximity findings reporting same issue", () => {
    const f1: Finding = { ...validFinding, line: 2, confidence: 0.8 };
    const f2: Finding = { ...validFinding, line: 3, confidence: 0.95 };

    const result = verifyAndDeduplicateFindings([f1, f2], fileContents, new Map([["src/calc.ts", new Set([2, 3])]]));

    expect(result.verified).toHaveLength(1);
    // Retains higher confidence finding
    expect(result.verified[0]!.confidence).toBe(0.95);
    expect(result.stats.duplicatesCount).toBe(1);
  });
});

