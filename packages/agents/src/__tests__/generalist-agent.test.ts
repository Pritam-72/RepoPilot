import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  runGeneralistReview,
  runDeterministicPostChecks,
  type GeneralistFinding,
  type ReviewFileContext,
} from "../generalist-agent.js";
import { MockLLMProvider, getLLMProvider } from "../llm-provider.js";

describe("Deterministic Post-Checks", () => {
  const sampleFile: ReviewFileContext = {
    path: "src/utils.ts",
    patch: `@@ -1,5 +1,5 @@\n function calc(a: number, b: number) {\n-  return a - b;\n+  return a + b;\n }`,
    content: `function calc(a: number, b: number) {\n  return a + b;\n}\n`,
  };

  const validFinding: GeneralistFinding = {
    title: "Incorrect addition instead of subtraction",
    category: "bug",
    severity: "high",
    file: "src/utils.ts",
    lineStart: 2,
    lineEnd: 2,
    explanation: "Changed arithmetic operator alters expected calculation result",
    evidenceSnippet: "return a + b;",
    impact: "Incorrect calculations returned to callers",
    suggestion: "return a - b;",
    confidence: 0.95,
    sourceAgent: "generalist-reviewer",
  };

  it("accepts grounded, valid findings", () => {
    const { validFindings, rejectedFindings } = runDeterministicPostChecks(
      [validFinding],
      [sampleFile]
    );

    expect(validFindings).toHaveLength(1);
    expect(rejectedFindings).toHaveLength(0);
    expect(validFindings[0]?.title).toBe(validFinding.title);
  });

  it("rejects hallucinated file paths", () => {
    const hallucinatedFinding: GeneralistFinding = {
      ...validFinding,
      file: "src/non_existent.ts",
    };

    const { validFindings, rejectedFindings } = runDeterministicPostChecks(
      [hallucinatedFinding],
      [sampleFile]
    );

    expect(validFindings).toHaveLength(0);
    expect(rejectedFindings).toHaveLength(1);
    expect(rejectedFindings[0]?.reason).toContain("does not exist in the PR changes");
  });

  it("rejects line numbers outside diff commentable range", () => {
    const outOfBoundsFinding: GeneralistFinding = {
      ...validFinding,
      lineStart: 999,
      lineEnd: 999,
    };

    const { validFindings, rejectedFindings } = runDeterministicPostChecks(
      [outOfBoundsFinding],
      [sampleFile]
    );

    expect(validFindings).toHaveLength(0);
    expect(rejectedFindings).toHaveLength(1);
    expect(rejectedFindings[0]?.reason).toContain("not part of the changed diff hunks");
  });

  it("rejects evidence snippets that do not exist verbatim in the file", () => {
    const hallucinatedSnippetFinding: GeneralistFinding = {
      ...validFinding,
      evidenceSnippet: "return a * b * 999;",
    };

    const { validFindings, rejectedFindings } = runDeterministicPostChecks(
      [hallucinatedSnippetFinding],
      [sampleFile]
    );

    expect(validFindings).toHaveLength(0);
    expect(rejectedFindings).toHaveLength(1);
    expect(rejectedFindings[0]?.reason).toContain("does not exist verbatim");
  });

  it("rejects findings below minimum confidence threshold", () => {
    const lowConfidenceFinding: GeneralistFinding = {
      ...validFinding,
      confidence: 0.45,
    };

    const { validFindings, rejectedFindings } = runDeterministicPostChecks(
      [lowConfidenceFinding],
      [sampleFile],
      0.7
    );

    expect(validFindings).toHaveLength(0);
    expect(rejectedFindings).toHaveLength(1);
    expect(rejectedFindings[0]?.reason).toContain("below minimum threshold");
  });
});

describe("runGeneralistReview with Mock LLM Provider", () => {
  const sampleFile: ReviewFileContext = {
    path: "src/math.ts",
    patch: `@@ -1,4 +1,4 @@\n export function square(n: number) {\n-  return n * n;\n+  return n + n;\n }`,
    content: `export function square(n: number) {\n  return n + n;\n}\n`,
  };

  it("processes mock findings and produces verified review result", async () => {
    const mockProvider = new MockLLMProvider({
      findings: [
        {
          title: "Used addition instead of multiplication for square",
          category: "bug",
          severity: "high",
          file: "src/math.ts",
          lineStart: 2,
          lineEnd: 2,
          explanation: "Replacing multiplication with addition returns double instead of square",
          evidenceSnippet: "return n + n;",
          impact: "Square calculation yields incorrect mathematical results",
          suggestion: "return n * n;",
          confidence: 0.95,
          sourceAgent: "generalist-reviewer",
        },
      ],
      summary: "Found 1 calculation bug",
    });

    const result = await runGeneralistReview([sampleFile], { provider: mockProvider });

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]?.file).toBe("src/math.ts");
    expect(result.promptVersion).toBe("2.0.0-generalist");
    expect(result.usage.totalTokens).toBeGreaterThan(0);
  });

  it("handles empty findings gracefully on clean files", async () => {
    const mockProvider = new MockLLMProvider({
      findings: [],
      summary: "Clean diff with no defects identified",
    });

    const result = await runGeneralistReview([sampleFile], { provider: mockProvider });
    expect(result.findings).toHaveLength(0);
    expect(result.rejectedFindings).toHaveLength(0);
  });

  it("swaps provider dynamically without code changes", () => {
    const gemini = getLLMProvider("gemini");
    expect(gemini.name).toBe("gemini");

    const claude = getLLMProvider("anthropic");
    expect(claude.name).toBe("anthropic");

    const mock = getLLMProvider("mock");
    expect(mock.name).toBe("mock");
  });
});
