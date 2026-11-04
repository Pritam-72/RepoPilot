import { z } from "zod";
import { logger } from "@acr/observability";
import { getLLMProvider, type LLMProvider, type TokenUsage } from "./llm-provider.js";
import { parseDiff, getCommentableLines } from "@acr/github";

export const GENERALIST_PROMPT_VERSION = "2.0.0-generalist";

/**
 * Finding schema aligned strictly with plan.md Section 8.1
 */
export const GeneralistFindingSchema = z
  .object({
    title: z.string().min(5).max(120),
    category: z.enum(["bug", "security", "error-handling", "performance", "test", "quality"]),
    severity: z.enum(["critical", "high", "medium", "low"]),
    file: z.string(),
    lineStart: z.number().int().positive(),
    lineEnd: z.number().int().positive(),
    explanation: z.string().min(20),
    evidenceSnippet: z.string().min(1),
    impact: z.string(),
    suggestion: z.string(),
    confidence: z.number().min(0).max(1),
    sourceAgent: z.string().default("generalist-reviewer"),
  })
  .refine((f) => f.lineEnd >= f.lineStart, {
    message: "lineEnd must be greater than or equal to lineStart",
  });

export type GeneralistFinding = z.infer<typeof GeneralistFindingSchema>;

export const GeneralistReviewOutputSchema = z.object({
  findings: z.array(GeneralistFindingSchema),
  summary: z.string().optional(),
});

export interface ReviewFileContext {
  path: string;
  patch: string;
  content: string; // File content at headSha
}

export interface ReviewExecutionOptions {
  provider?: LLMProvider | undefined;
  minConfidence?: number | undefined;
  model?: string | undefined;
}

export interface DeterministicPostCheckResult {
  validFindings: GeneralistFinding[];
  rejectedFindings: Array<{
    finding: GeneralistFinding;
    reason: string;
  }>;
}

/**
 * Runs strict deterministic post-checks (plan.md Phase 3 & Section 13):
 * 1. File exists at headSha
 * 2. lineStart/lineEnd within diff commentable bounds
 * 3. evidenceSnippet exists verbatim in file content
 * 4. lineEnd >= lineStart
 * 5. confidence >= minConfidence
 */
export function runDeterministicPostChecks(
  findings: GeneralistFinding[],
  files: ReviewFileContext[],
  minConfidence = 0.7
): DeterministicPostCheckResult {
  const fileMap = new Map<string, ReviewFileContext>();
  const commentableLinesByFile = new Map<string, Set<number>>();

  for (const f of files) {
    fileMap.set(f.path, f);
    commentableLinesByFile.set(f.path, getCommentableLines(f.patch));
  }

  const validFindings: GeneralistFinding[] = [];
  const rejectedFindings: Array<{ finding: GeneralistFinding; reason: string }> = [];

  for (const finding of findings) {
    // 1. File existence check
    const fileCtx = fileMap.get(finding.file);
    if (!fileCtx) {
      rejectedFindings.push({
        finding,
        reason: `File '${finding.file}' does not exist in the PR changes`,
      });
      continue;
    }

    // 2. Line ordering
    if (finding.lineEnd < finding.lineStart) {
      rejectedFindings.push({
        finding,
        reason: `Invalid line range: lineEnd (${finding.lineEnd}) < lineStart (${finding.lineStart})`,
      });
      continue;
    }

    // 3. Line ∈ diff commentable range
    const commentable = commentableLinesByFile.get(finding.file) ?? new Set();
    const hasLineInDiff =
      commentable.has(finding.lineStart) ||
      commentable.has(finding.lineEnd) ||
      Array.from({ length: finding.lineEnd - finding.lineStart + 1 }, (_, i) => finding.lineStart + i).some(
        (l) => commentable.has(l)
      );

    if (!hasLineInDiff) {
      rejectedFindings.push({
        finding,
        reason: `Lines ${finding.lineStart}-${finding.lineEnd} are not part of the changed diff hunks in ${finding.file}`,
      });
      continue;
    }

    // 4. Evidence snippet verbatim check
    const normalizedSnippet = finding.evidenceSnippet.trim();
    if (!fileCtx.content.includes(normalizedSnippet)) {
      rejectedFindings.push({
        finding,
        reason: `Evidence snippet does not exist verbatim in file '${finding.file}' at headSha`,
      });
      continue;
    }

    // 5. Confidence threshold check
    if (finding.confidence < minConfidence) {
      rejectedFindings.push({
        finding,
        reason: `Finding confidence (${finding.confidence}) is below minimum threshold (${minConfidence})`,
      });
      continue;
    }

    validFindings.push(finding);
  }

  return { validFindings, rejectedFindings };
}

/**
 * Builds the generalist review prompt for the LLM.
 */
function buildGeneralistPrompt(file: ReviewFileContext): string {
  return `You are a high-precision Staff Software Engineer conducting an automated code review.
Your mission: Identify genuine defects, bugs, security flaws, error handling vulnerabilities, performance regressions, or test omissions introduced by this pull request.

PROMPT VERSION: ${GENERALIST_PROMPT_VERSION}
TARGET FILE: ${file.path}

UNIFIED DIFF:
\`\`\`diff
${file.patch}
\`\`\`

COMPLETE FILE AT HEAD COMMIT:
\`\`\`
${file.content}
\`\`\`

INSTRUCTIONS:
1. ONLY report findings for code introduced or modified in the diff.
2. The 'lineStart' and 'lineEnd' MUST be exact 1-based line numbers in the new file corresponding to the diff.
3. The 'evidenceSnippet' MUST be copied VERBATIM from the file. If it does not match exactly, the finding will be rejected.
4. Set 'confidence' between 0.0 and 1.0. Do NOT guess. If unsure, do not report.
5. Categories: bug, security, error-handling, performance, test, quality.
6. Severities: critical, high, medium, low.
7. Explanations must be at least 20 characters describing the defect, root cause, and concrete impact.
`;
}

export interface GeneralistReviewResult {
  findings: GeneralistFinding[];
  rejectedFindings: Array<{ finding: GeneralistFinding; reason: string }>;
  promptVersion: string;
  model: string;
  provider: string;
  usage: TokenUsage;
  durationMs: number;
}

/**
 * Executes a single-agent baseline code review over changed files.
 */
export async function runGeneralistReview(
  files: ReviewFileContext[],
  options: ReviewExecutionOptions = {}
): Promise<GeneralistReviewResult> {
  const provider = options.provider ?? getLLMProvider();
  const minConfidence = options.minConfidence ?? Number(process.env["MIN_CONFIDENCE"] ?? "0.7");
  const model = options.model ?? process.env["LLM_REVIEW_MODEL"];

  const startTime = Date.now();
  const allRawFindings: GeneralistFinding[] = [];
  const totalUsage: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  let activeModel = "default";
  let activeProvider = provider.name;

  for (const file of files) {
    if (!file.patch || file.patch.trim() === "") continue;

    const prompt = buildGeneralistPrompt(file);
    try {
      const res = await provider.generateStructured(prompt, GeneralistReviewOutputSchema, {
        model,
        temperature: 0.1,
      });

      activeModel = res.model;
      activeProvider = res.provider;
      totalUsage.promptTokens += res.usage.promptTokens;
      totalUsage.completionTokens += res.usage.completionTokens;
      totalUsage.totalTokens += res.usage.totalTokens;

      for (const f of res.output.findings) {
        allRawFindings.push(f);
      }
    } catch (err: any) {
      logger.error({ file: file.path, error: err.message }, "Generalist review failed for file");
    }
  }

  // Run deterministic validation gates
  const { validFindings, rejectedFindings } = runDeterministicPostChecks(
    allRawFindings,
    files,
    minConfidence
  );

  logger.info(
    {
      totalRaw: allRawFindings.length,
      validCount: validFindings.length,
      rejectedCount: rejectedFindings.length,
      provider: activeProvider,
      model: activeModel,
    },
    "Generalist baseline review completed"
  );

  return {
    findings: validFindings,
    rejectedFindings,
    promptVersion: GENERALIST_PROMPT_VERSION,
    model: activeModel,
    provider: activeProvider,
    usage: totalUsage,
    durationMs: Date.now() - startTime,
  };
}
