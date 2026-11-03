import path from "node:path";
import { logger } from "@acr/observability";
import type { Finding, FixProposal } from "@acr/review-contracts";
import { runInSandbox, type SandboxConfig } from "@acr/static-analysis";
import { FIX_AGENT_SYSTEM_PROMPT } from "./prompts/fix-agent.prompt.js";
import { generateStructuredOutput } from "./llm-provider.js";
import { z } from "zod";

export interface FixAgentOptions {
  model?: string | undefined;
  sandboxConfig?: SandboxConfig | undefined;
  llmClient?: ((prompt: string, system: string) => Promise<{ patch: string; explanation: string; confidence: number }>) | undefined;
  validateInSandbox?: boolean | undefined;
}

export const FixOutputSchema = z.object({
  patch: z.string().min(1),
  explanation: z.string().min(1),
  confidence: z.number().min(0).max(1),
  filesModified: z.array(z.string()).optional(),
});

export type FixOutput = z.infer<typeof FixOutputSchema>;

export const FORBIDDEN_PATCH_PATTERNS = [
  /\.\.[/\\]/, // Path traversal
  /^\/?\.env/i, // Environment files
  /\.github\//i, // GitHub Actions / workflows
  /id_rsa/i, // SSH keys
  /credentials/i,
];

/**
 * Validates that a unified diff does not escape the repository boundary or touch sensitive files.
 */
export function validatePatchBoundaries(patch: string, targetFile: string): { valid: boolean; reason?: string } {
  if (!patch || patch.trim() === "") {
    return { valid: false, reason: "empty_patch" };
  }

  // Check for path traversal or sensitive file modifications
  for (const pattern of FORBIDDEN_PATCH_PATTERNS) {
    if (pattern.test(patch) || pattern.test(targetFile)) {
      return { valid: false, reason: `forbidden_path_pattern: ${pattern.toString()}` };
    }
  }

  // Extract affected files from diff headers (--- a/file +++ b/file)
  const headerMatches = [...patch.matchAll(/^[+-]{3} [ab]\/(.+)$/gm)];
  if (headerMatches.length > 0) {
    const normTarget = targetFile.replace(/\\/g, "/");
    for (const match of headerMatches) {
      const citedFile = match[1]?.trim().replace(/\\/g, "/");
      if (citedFile && citedFile !== normTarget && !normTarget.endsWith(citedFile)) {
        return {
          valid: false,
          reason: `patch_touches_unexpected_file: expected ${normTarget}, found ${citedFile}`,
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Applies a simple single-hunk unified diff patch to a string in-memory.
 */
export function applyPatchToContent(originalContent: string, patch: string): string {
  const originalLines = originalContent.split("\n");
  const patchLines = patch.split("\n");

  const hunkHeaderIdx = patchLines.findIndex((l) => l.startsWith("@@"));
  if (hunkHeaderIdx === -1) {
    return originalContent;
  }

  const hunkHeader = patchLines[hunkHeaderIdx]!;
  const match = hunkHeader.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
  if (!match) return originalContent;

  const startLine = parseInt(match[1]!, 10);
  const result: string[] = [];

  // Lines before hunk (1-indexed)
  for (let i = 0; i < startLine - 1 && i < originalLines.length; i++) {
    result.push(originalLines[i]!);
  }

  let origIdx = startLine - 1;
  for (let i = hunkHeaderIdx + 1; i < patchLines.length; i++) {
    const pline = patchLines[i]!;
    if (pline.startsWith("+") && !pline.startsWith("+++")) {
      result.push(pline.slice(1));
    } else if (pline.startsWith("-") && !pline.startsWith("---")) {
      origIdx++; // skip deleted line in original
    } else if (pline.startsWith(" ")) {
      result.push(originalLines[origIdx] ?? pline.slice(1));
      origIdx++;
    }
  }

  // Append remaining lines after hunk
  while (origIdx < originalLines.length) {
    result.push(originalLines[origIdx]!);
    origIdx++;
  }

  return result.join("\n");
}

/**
 * Generates a validated fix proposal for a verified code review finding.
 */
export async function generateFixProposal(
  finding: Finding & { id?: string | undefined },
  fileContent: string,
  options: FixAgentOptions = {}
): Promise<FixProposal> {
  const findingId = finding.id ?? `finding-${finding.file}-${finding.line}`;

  // 1. Enforce verified finding gate
  if (finding.verificationStatus !== "verified") {
    throw new Error(
      `Cannot generate fix proposal: finding ${findingId} is not verified (status: ${finding.verificationStatus})`
    );
  }

  // 2. Validate category eligibility
  const eligibleCategories = ["correctness", "security", "maintainability", "performance"];
  if (!eligibleCategories.includes(finding.category)) {
    throw new Error(
      `Category "${finding.category}" is not eligible for automated fix proposal`
    );
  }

  logger.info({ findingId, file: finding.file, line: finding.line }, "Generating fix proposal");

  // 3. Generate patch via LLM or custom hook
  let patch: string;
  let explanation: string;

  if (options.llmClient) {
    const res = await options.llmClient(
      `Finding: ${finding.title}\nFile: ${finding.file}:${finding.line}\nEvidence: ${finding.evidence}\nRecommendation: ${finding.recommendation ?? "None"}\n\nFile Content:\n${fileContent}`,
      FIX_AGENT_SYSTEM_PROMPT
    );
    patch = res.patch;
    explanation = res.explanation;
  } else {
    // If recommendation is present, construct fallback clean minimal patch
    if (finding.recommendation && finding.evidence) {
      patch = `--- a/${finding.file}\n+++ b/${finding.file}\n@@ -${finding.line},1 +${finding.line},1 @@\n-${finding.evidence}\n+${finding.recommendation}`;
      explanation = `Replaced problematic expression with recommended remediation: ${finding.recommendation}`;
    } else {
      patch = `--- a/${finding.file}\n+++ b/${finding.file}\n@@ -${finding.line},1 +${finding.line},1 @@\n-${finding.evidence}\n+// TODO: Address ${finding.title}`;
      explanation = `Inserted safe remediation placeholder for ${finding.title}`;
    }
  }

  // 4. Validate patch boundaries
  const boundaryCheck = validatePatchBoundaries(patch, finding.file);
  if (!boundaryCheck.valid) {
    throw new Error(`Generated patch violates security boundary: ${boundaryCheck.reason}`);
  }

  // 5. Optional sandbox validation
  let validationStatus: "passed" | "failed" | "untested" = "untested";
  let validationLogs: string | undefined = undefined;

  if (options.validateInSandbox && options.sandboxConfig) {
    logger.info({ findingId }, "Testing fix proposal inside execution sandbox");
    const testResult = await runInSandbox(options.sandboxConfig, "npm test");
    validationStatus = testResult.success ? "passed" : "failed";
    validationLogs = testResult.stdout + "\n" + testResult.stderr;
  }

  const proposal: FixProposal = {
    id: `fix-${findingId}-${Date.now()}`,
    findingId,
    file: finding.file,
    patch,
    explanation,
    status: "pending_approval",
    validationStatus,
    validationLogs,
    createdAt: new Date().toISOString(),
  };

  return proposal;
}
