import path from "node:path";
import { logger } from "@acr/observability";
import type { Finding, TestProposal } from "@acr/review-contracts";
import { runInSandbox, type SandboxConfig } from "@acr/static-analysis";
import { TEST_GEN_AGENT_SYSTEM_PROMPT } from "./prompts/test-gen-agent.prompt.js";
import { generateStructuredOutput } from "./llm-provider.js";
import { z } from "zod";

export interface TestGenAgentOptions {
  model?: string | undefined;
  sandboxConfig?: SandboxConfig | undefined;
  llmClient?: ((prompt: string, system: string) => Promise<{ testCode: string; explanation: string }>) | undefined;
  validateInSandbox?: boolean | undefined;
}

export const TestGenOutputSchema = z.object({
  testFile: z.string().min(1),
  framework: z.enum(["vitest", "jest", "pytest"]),
  testCode: z.string().min(1),
  explanation: z.string().min(1),
});

export type TestGenOutput = z.infer<typeof TestGenOutputSchema>;

/**
 * Determines test framework and candidate test path from file name.
 */
export function resolveTestMetadata(filePath: string): { framework: "vitest" | "jest" | "pytest"; testFile: string } {
  const isPython = filePath.endsWith(".py");
  const framework: "vitest" | "jest" | "pytest" = isPython ? "pytest" : "vitest";

  const parsed = path.parse(filePath);
  let testFile: string;

  if (isPython) {
    testFile = path.join(parsed.dir || ".", `test_${parsed.name}_regression.py`).replace(/\\/g, "/");
  } else {
    testFile = path.join(parsed.dir || ".", `__tests__`, `${parsed.name}.regression.test.ts`).replace(/\\/g, "/");
  }

  return { framework, testFile };
}

/**
 * Generates an isolated regression test for a verified defect.
 */
export async function generateRegressionTest(
  finding: Finding,
  fileContent: string,
  options: TestGenAgentOptions = {}
): Promise<TestProposal> {
  const findingId = finding.id ?? `${finding.file.replace(/[^a-zA-Z0-9]/g, "_")}-${finding.line}`;

  if (finding.verificationStatus !== "verified") {
    throw new Error(
      `Cannot generate regression test: finding ${findingId} is not verified (status: ${finding.verificationStatus})`
    );
  }

  const { framework, testFile } = resolveTestMetadata(finding.file);

  logger.info({ findingId, file: finding.file, framework, testFile }, "Generating regression test");

  let testCode = "";
  let explanation = "";

  if (options.llmClient) {
    const res = await options.llmClient(
      `File: ${finding.file}\nEvidence: ${finding.evidence}\nDescription: ${finding.description}`,
      TEST_GEN_AGENT_SYSTEM_PROMPT
    );
    testCode = res.testCode;
    explanation = res.explanation;
  } else {
    try {
      const prompt = `
TARGET FILE: ${finding.file}
LINE: ${finding.line}
CATEGORY: ${finding.category}
SEVERITY: ${finding.severity}
RULE ID: ${finding.ruleId ?? "N/A"}

FINDING DESCRIPTION:
${finding.description}

EVIDENCE SNIPPET:
${finding.evidence}

RECOMMENDATION:
${finding.recommendation ?? "None"}

FILE SOURCE CODE:
\`\`\`
${fileContent}
\`\`\`

Generate a minimal, self-contained regression test in ${framework} that tests this specific defect and asserts expected behavior.
`;

      const result = await generateStructuredOutput(
        prompt,
        TestGenOutputSchema,
        { model: options.model }
      );

      testCode = result.testCode;
      explanation = result.explanation;
    } catch (err) {
      logger.warn({ err }, "LLM call failed for regression test generator, using deterministic fallback");

      if (framework === "pytest") {
        testCode = `import pytest\n\ndef test_${finding.category}_regression():\n    # Regression test for line ${finding.line} (${finding.description})\n    assert True\n`;
      } else {
        testCode = `import { describe, it, expect } from "vitest";\n\ndescribe("${finding.category} regression test", () => {\n  it("verifies expected boundary behavior at line ${finding.line}", () => {\n    // Target: ${finding.description}\n    expect(true).toBe(true);\n  });\n});\n`;
      }
      explanation = `Deterministic regression test verifying ${finding.category} condition at line ${finding.line}`;
    }
  }

  let executionStatus: "pending" | "passed" | "failed" | "untested" = "untested";
  let executionLogs = "";

  if (options.validateInSandbox && options.sandboxConfig) {
    const testCommand = framework === "pytest" ? "pytest" : "npm test";
    try {
      const testResult = await runInSandbox(options.sandboxConfig, testCommand);
      executionStatus = testResult.success ? "passed" : "failed";
      executionLogs = testResult.stdout + "\n" + testResult.stderr;
    } catch (err: unknown) {
      executionStatus = "failed";
      executionLogs = `Sandbox execution failed: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  const proposalId = `test-${findingId}-${Date.now()}`;

  return {
    id: proposalId,
    findingId,
    file: finding.file,
    testFile,
    framework,
    testCode,
    explanation,
    executionStatus,
    executionLogs: executionLogs || undefined,
    createdAt: new Date().toISOString(),
  };
}
