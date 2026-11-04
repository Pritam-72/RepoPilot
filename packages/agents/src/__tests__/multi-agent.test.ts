import { describe, it, expect } from "vitest";
import {
  runSpecialisedAgent,
  buildAgentPrompt,
  type AgentDefinition,
  type AgentReviewContext,
} from "../base-agent.js";
import {
  bugAgentDefinition,
  securityAgentDefinition,
  errorHandlingAgentDefinition,
  testCoverageAgentDefinition,
  performanceAgentDefinition,
  qualityAgentDefinition,
  allSpecialisedAgents,
} from "../agent-definitions.js";
import {
  runMultiAgentReview,
  deduplicateFindings,
} from "../multi-agent-orchestrator.js";
import { MockLLMProvider } from "../llm-provider.js";
import type { FindingV2 } from "@acr/review-contracts";

describe("Phase 4: Specialised Multi-Agent Architecture", () => {
  const sampleContext: AgentReviewContext = {
    files: [
      {
        path: "src/paginate.ts",
        patch: `@@ -1,5 +1,5 @@\n export function getPage(items: string[], page: number, size: number): string[] {\n   const start = (page - 1) * size;\n-  const end = start + size;\n+  const end = start + size + 1;\n   return items.slice(start, end);\n }`,
        content: `export function getPage(items: string[], page: number, size: number): string[] {\n  const start = (page - 1) * size;\n  const end = start + size + 1;\n  return items.slice(start, end);\n}\n`,
      },
    ],
    staticAnalysisHints: ["Semgrep rule: possible off-by-one boundary access in slice"],
  };

  it("builds a prompt with explicit exclusions, doNotReport items, and static analysis hints", () => {
    const prompt = buildAgentPrompt(bugAgentDefinition, sampleContext);
    expect(prompt).toContain("Prompt Version: 2.0.0-bug");
    expect(prompt).toContain("DO NOT REPORT: Security vulnerabilities");
    expect(prompt).toContain("DO NOT REPORT: Missing test cases");
    expect(prompt).toContain("STATIC ANALYSIS CORROBORATION HINTS:");
    expect(prompt).toContain("Semgrep rule: possible off-by-one boundary access");
  });

  it("enforces category and sourceAgent isolation on findings", async () => {
    const mockProvider = new MockLLMProvider({
      findings: [
        {
          title: "Off-by-one in slice termination",
          category: "quality", // Agent will coerce/enforce its own category
          severity: "high",
          file: "src/paginate.ts",
          lineStart: 4,
          lineEnd: 4,
          explanation: "The slice end calculation adds an unnecessary extra index (+ 1).",
          evidenceSnippet: "const end = start + size + 1;",
          impact: "Causes index overflow",
          suggestion: "Use start + size",
          confidence: 0.95,
          sourceAgent: "some-other-agent",
        },
      ],
    });

    const result = await runSpecialisedAgent(bugAgentDefinition, sampleContext, {
      provider: mockProvider,
    });

    expect(result.agent).toBe("bug-reviewer");
    expect(result.category).toBe("bug");
    expect(result.findings.length).toBe(1);
    expect(result.findings[0]!.category).toBe("bug");
    expect(result.findings[0]!.sourceAgent).toBe("bug-reviewer");
    expect(result.runRecord.status).toBe("success");
    expect(result.runRecord.tokens.totalTokens).toBeGreaterThan(0);
  });

  it("isolates agent failures and timeouts gracefully without throwing", async () => {
    const failingProvider = {
      name: "failing-mock",
      modelName: "failing-model",
      async generateStructured(): Promise<never> {
        throw new Error("Provider rate limit reached (HTTP 429)");
      },
    };

    const result = await runSpecialisedAgent(securityAgentDefinition, sampleContext, {
      provider: failingProvider as any,
    });

    expect(result.findings.length).toBe(0);
    expect(result.runRecord.status).toBe("failed");
    expect(result.runRecord.error).toContain("HTTP 429");
  });

  it("deduplicates overlapping findings across agents favoring higher confidence", () => {
    const finding1: FindingV2 = {
      title: "Bug 1 found by BugReviewer",
      category: "bug",
      severity: "high",
      file: "src/paginate.ts",
      lineStart: 3,
      lineEnd: 5,
      explanation: "Off by one error in slice calculation with comprehensive details.",
      evidenceSnippet: "const end = start + size + 1;",
      impact: "Index overflow",
      suggestion: "Fix bounds",
      confidence: 0.8,
      sourceAgent: "bug-reviewer",
    };

    const finding2: FindingV2 = {
      title: "Quality concern on bounds",
      category: "quality",
      severity: "medium",
      file: "src/paginate.ts",
      lineStart: 4,
      lineEnd: 4,
      explanation: "Bounds check issue.",
      evidenceSnippet: "const end = start + size + 1;",
      impact: "Slice calculation issue",
      suggestion: "Check bounds",
      confidence: 0.95,
      sourceAgent: "quality-reviewer",
    };

    const deduped = deduplicateFindings([finding1, finding2]);
    expect(deduped.length).toBe(1);
    expect(deduped[0]!.sourceAgent).toBe("quality-reviewer");
    expect(deduped[0]!.confidence).toBe(0.95);
  });

  it("orchestrates all 6 specialised agents in parallel with isolation and aggregated metrics", async () => {
    const mockProvider = new MockLLMProvider();
    mockProvider.setResponseHandler((prompt: string) => {
      if (prompt.includes("focusing exclusively on: bug-reviewer")) {
        return {
          findings: [
            {
              title: "Off-by-one in slice calculation",
              category: "bug",
              severity: "high",
              file: "src/paginate.ts",
              lineStart: 4,
              lineEnd: 4,
              explanation: "Adding 1 causes slice termination to exceed intended page size.",
              evidenceSnippet: "const end = start + size + 1;",
              impact: "Returns page containing one extra item",
              suggestion: "Remove the + 1 offset",
              confidence: 0.92,
              sourceAgent: "bug-reviewer",
            },
          ],
        };
      }
      return { findings: [], summary: "No issues detected" };
    });

    const result = await runMultiAgentReview(
      { files: sampleContext.files, agents: allSpecialisedAgents },
      { provider: mockProvider }
    );

    expect(result.agentRuns.length).toBe(6);
    expect(result.findings.length).toBe(1);
    expect(result.findings[0]!.category).toBe("bug");
    expect(result.findings[0]!.sourceAgent).toBe("bug-reviewer");
    expect(result.totalTokens.totalTokens).toBeGreaterThan(0);
    expect(result.perAgentFindingsCount["bug-reviewer"]).toBe(1);
    expect(result.perAgentFindingsCount["security-reviewer"]).toBe(0);
  });
});
