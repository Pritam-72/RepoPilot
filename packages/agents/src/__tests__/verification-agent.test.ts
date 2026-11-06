import { describe, it, expect } from "vitest";
import {
  buildVerificationPrompt,
  runDeterministicVerificationGate,
  deduplicateCandidateFindings,
  verifyCandidateFindings,
  type VerificationVerdict,
} from "../verification-agent.js";
import { MockLLMProvider } from "../llm-provider.js";
import type { FindingV2 } from "@acr/review-contracts";
import type { ReviewFileContext } from "../generalist-agent.js";

describe("Phase 5: Finding Verification and False-Positive Reduction", () => {
  const sampleFiles: ReviewFileContext[] = [
    {
      path: "src/paginate.ts",
      patch: `@@ -1,5 +1,5 @@\n export function getPage(items: string[], page: number, size: number): string[] {\n   const start = (page - 1) * size;\n-  const end = start + size;\n+  const end = start + size + 1;\n   return items.slice(start, end);\n }`,
      content: `export function getPage(items: string[], page: number, size: number): string[] {\n  const start = (page - 1) * size;\n  const end = start + size + 1;\n  return items.slice(start, end);\n}\n`,
    },
    {
      path: "package-lock.json",
      patch: `@@ -1,3 +1,3 @@\n "version": "1.0.0"`,
      content: `{\n  "name": "root",\n  "version": "1.0.0"\n}\n`,
    },
  ];

  const validFinding: FindingV2 = {
    title: "Off-by-one error in pagination slice",
    category: "bug",
    severity: "high",
    file: "src/paginate.ts",
    lineStart: 4,
    lineEnd: 4,
    explanation: "The slice end index adds an unnecessary 1, resulting in an extra item on each page.",
    evidenceSnippet: "const end = start + size + 1;",
    impact: "Exceeds requested page size by 1",
    suggestion: "Use start + size",
    confidence: 0.95,
    sourceAgent: "bug-reviewer",
  };

  describe("Deterministic Verification Gate", () => {
    it("rejects findings on ignored files (e.g. lockfiles)", () => {
      const lockfileFinding: FindingV2 = {
        ...validFinding,
        file: "package-lock.json",
        evidenceSnippet: '"version": "1.0.0"',
      };

      const result = runDeterministicVerificationGate([lockfileFinding], sampleFiles);
      expect(result.passed.length).toBe(0);
      expect(result.rejected.length).toBe(1);
      expect(result.rejected[0]!.reason).toContain("ignored paths list");
    });

    it("rejects findings on non-existent files", () => {
      const nonExistentFinding: FindingV2 = {
        ...validFinding,
        file: "src/does-not-exist.ts",
      };

      const result = runDeterministicVerificationGate([nonExistentFinding], sampleFiles);
      expect(result.passed.length).toBe(0);
      expect(result.rejected.length).toBe(1);
      expect(result.rejected[0]!.reason).toContain("does not exist at head SHA");
    });

    it("rejects findings where evidenceSnippet does not exist verbatim", () => {
      const hallucinatedSnippetFinding: FindingV2 = {
        ...validFinding,
        evidenceSnippet: "const end = start + size + 999999;",
      };

      const result = runDeterministicVerificationGate([hallucinatedSnippetFinding], sampleFiles);
      expect(result.passed.length).toBe(0);
      expect(result.rejected.length).toBe(1);
      expect(result.rejected[0]!.reason).toContain("not found verbatim");
    });

    it("passes valid, grounded findings", () => {
      const result = runDeterministicVerificationGate([validFinding], sampleFiles);
      expect(result.passed.length).toBe(1);
      expect(result.rejected.length).toBe(0);
    });
  });

  describe("Deduplication Engine", () => {
    it("collapses overlapping findings into one canonical finding retaining best confidence", () => {
      const findingA: FindingV2 = {
        ...validFinding,
        title: "Slice boundary off by one (Bug Agent)",
        confidence: 0.85,
        sourceAgent: "bug-reviewer",
      };

      const findingB: FindingV2 = {
        ...validFinding,
        title: "Pagination slice boundary index overflow (Quality Agent)",
        confidence: 0.95,
        sourceAgent: "quality-reviewer",
      };

      const result = deduplicateCandidateFindings([findingA, findingB]);
      expect(result.unique.length).toBe(1);
      expect(result.unique[0]!.confidence).toBe(0.95);
      expect(result.unique[0]!.title).toContain("Quality Agent");
      expect(result.duplicates.length).toBe(1);
      expect(result.duplicates[0]!.reason).toContain("Duplicate of finding");
    });
  });

  describe("Verification Agent & Signal Combination", () => {
    it("does not expose the finder's confidence score in the verifier prompt (bias prevention)", () => {
      const prompt = buildVerificationPrompt(validFinding, sampleFiles[0]!.content);
      expect(prompt).not.toContain("0.95");
      expect(prompt).not.toContain("confidence:");
      expect(prompt).toContain("Prompt Version: 2.0.0-verifier");
      expect(prompt).toContain("const end = start + size + 1;");
    });

    it("confirms true defects with verified execution path and reasoning", async () => {
      const mockVerdict: VerificationVerdict = {
        verdict: "confirmed",
        reasoning: "The + 1 offset unconditionally increases the slice upper bound by 1 at runtime.",
        adjustedSeverity: "high",
        confidence: 0.96,
        executionPath: "Calling getPage(['a', 'b'], 1, 1) returns ['a', 'b'] instead of ['a'].",
      };

      const mockProvider = new MockLLMProvider(mockVerdict);

      const result = await verifyCandidateFindings([validFinding], sampleFiles, {
        verifierProvider: mockProvider,
        minConfidence: 0.7,
      });

      expect(result.verifiedFindings.length).toBe(1);
      const verified = result.verifiedFindings[0]!;
      expect(verified.verificationStatus).toBe("verified");
      expect(verified.verifierReasoning).toContain("+ 1 offset unconditionally increases");
      expect(verified.executionPath).toContain("returns ['a', 'b'] instead of ['a']");
      expect(verified.finalConfidence).toBeGreaterThanOrEqual(0.7);
      expect(result.stats.verifiedCount).toBe(1);
      expect(result.stats.rejectedByVerifierCount).toBe(0);
    });

    it("rejects seeded false positives when verifier determines code is safe", async () => {
      const falsePositiveFinding: FindingV2 = {
        ...validFinding,
        title: "False Positive: Unsafe array indexing",
        explanation: "Possible undefined access if array index is negative",
      };

      const mockVerdict: VerificationVerdict = {
        verdict: "rejected",
        reasoning: "The page argument is validated upstream and guaranteed to be positive integer >= 1.",
        confidence: 0.95,
      };

      const mockProvider = new MockLLMProvider(mockVerdict);

      const result = await verifyCandidateFindings([falsePositiveFinding], sampleFiles, {
        verifierProvider: mockProvider,
      });

      expect(result.verifiedFindings.length).toBe(0);
      expect(result.rejectedFindings.length).toBe(1);
      expect(result.rejectedFindings[0]!.stage).toBe("verification_agent");
      expect(result.rejectedFindings[0]!.reason).toContain("Rejected by verifier: The page argument is validated upstream");
      expect(result.stats.rejectedByVerifierCount).toBe(1);
    });

    it("never publishes findings with uncertain verdict", async () => {
      const uncertainVerdict: VerificationVerdict = {
        verdict: "uncertain",
        reasoning: "Insufficient information in diff to determine whether caller guarantees valid bounds.",
        confidence: 0.5,
      };

      const mockProvider = new MockLLMProvider(uncertainVerdict);

      const result = await verifyCandidateFindings([validFinding], sampleFiles, {
        verifierProvider: mockProvider,
      });

      expect(result.verifiedFindings.length).toBe(0);
      expect(result.rejectedFindings.length).toBe(1);
      expect(result.rejectedFindings[0]!.stage).toBe("verification_agent");
      expect(result.rejectedFindings[0]!.reason).toContain("Uncertain verdict");
      expect(result.stats.uncertainCount).toBe(1);
    });

    it("applies corroboration boost when static analysis hints match category", async () => {
      const mockVerdict: VerificationVerdict = {
        verdict: "confirmed",
        reasoning: "Off by one verified.",
        confidence: 0.8,
      };

      const mockProvider = new MockLLMProvider(mockVerdict);

      const result = await verifyCandidateFindings([validFinding], sampleFiles, {
        verifierProvider: mockProvider,
        staticAnalysisHints: ["Semgrep rule: bug in pagination slice boundary"],
      });

      expect(result.verifiedFindings.length).toBe(1);
      // verdict.confidence * 0.85 + 0.15 = 0.68 + 0.15 = 0.83
      expect(result.verifiedFindings[0]!.finalConfidence).toBe(0.83);
    });
  });
});
