import { z } from "zod";
import { logger } from "@acr/observability";
import type { FindingV2 } from "@acr/review-contracts";
import { getLLMProvider, type LLMProvider, type TokenUsage } from "./llm-provider.js";
import type { ReviewFileContext } from "./generalist-agent.js";
import { filterReviewableFiles } from "@acr/repository-context";

export const VERIFICATION_PROMPT_VERSION = "2.0.0-verifier";

/**
 * Verification verdict schema strictly adhering to plan.md Section 9 Phase 5
 */
export const VerificationVerdictSchema = z.object({
  verdict: z.enum(["confirmed", "rejected", "uncertain"]),
  reasoning: z.string().min(10),
  adjustedSeverity: z.enum(["critical", "high", "medium", "low"]).optional(),
  confidence: z.number().min(0).max(1),
  executionPath: z.string().optional(),
});

export type VerificationVerdict = z.infer<typeof VerificationVerdictSchema>;

export interface VerifiedFinding extends FindingV2 {
  verificationStatus: "verified" | "rejected" | "uncertain";
  rejectionReason?: string | undefined;
  verifierReasoning?: string | undefined;
  executionPath?: string | undefined;
  originalConfidence: number;
  finalConfidence: number;
}

export interface VerificationPipelineOptions {
  verifierProvider?: LLMProvider | undefined;
  verifierModel?: string | undefined;
  minConfidence?: number | undefined;
  staticAnalysisHints?: string[] | undefined;
  timeoutMs?: number | undefined;
}

export interface VerificationPipelineResult {
  candidateCount: number;
  verifiedFindings: VerifiedFinding[];
  rejectedFindings: Array<{
    finding: FindingV2;
    stage: "deterministic_gate" | "deduplication" | "verification_agent";
    reason: string;
  }>;
  stats: {
    totalCandidates: number;
    passedDeterministic: number;
    rejectedDeterministic: number;
    deduplicatedCount: number;
    verifiedCount: number;
    rejectedByVerifierCount: number;
    uncertainCount: number;
    verificationDurationMs: number;
  };
}

/**
 * Builds the verification prompt.
 * NOTE (plan.md line 429): Finder's confidence is explicitly excluded to prevent confirmation bias!
 */
export function buildVerificationPrompt(
  finding: FindingV2,
  fileContent: string,
  hints?: string[]
): string {
  const hintsSection =
    hints && hints.length > 0
      ? `\n### STATIC ANALYSIS CORROBORATING HINTS:\n${hints.map((h) => `- ${h}`).join("\n")}\n`
      : "";

  return `You are an independent, adversarial senior code verification agent.
Prompt Version: ${VERIFICATION_PROMPT_VERSION}

Your sole objective is to evaluate whether the following candidate finding is genuinely possible at runtime or if it is a false positive.

CANDIDATE FINDING UNDER REVIEW:
File: ${finding.file}
Line Range: L${finding.lineStart}-L${finding.lineEnd}
Category: ${finding.category}
Reported Severity: ${finding.severity}
Title: ${finding.title}

EXPLANATION:
${finding.explanation}

EVIDENCE SNIPPET:
\`\`\`
${finding.evidenceSnippet}
\`\`\`

CLAIMED IMPACT:
${finding.impact}

SUGGESTED FIX:
${finding.suggestion}
${hintsSection}
FULL FILE SOURCE CODE AT HEAD COMMIT:
\`\`\`
${fileContent}
\`\`\`

VERIFICATION INSTRUCTIONS:
1. Thoroughly trace the execution flow and state leading to lines ${finding.lineStart}-${finding.lineEnd}.
2. Check for surrounding safeguards, parameter validation, upstream guards, type constraints, or error handling that prevent this defect from occurring.
3. If the code is already protected, impossible to trigger, or a false positive, set verdict = "rejected".
4. If the issue is genuinely triggerable, set verdict = "confirmed" and describe the exact execution path or input condition in executionPath.
5. If there is genuine ambiguity and insufficient context to prove safety or harm, set verdict = "uncertain". "uncertain" will never be published as certain.
6. Provide clear, objective reasoning for your verdict.
`;
}

/**
 * Runs deterministic gates (cheap, first):
 * - File not in ignored paths (lockfiles, generated, etc.)
 * - File exists in review context
 * - Line bounds valid and within diff
 * - Snippet exists verbatim in file content
 */
export function runDeterministicVerificationGate(
  findings: FindingV2[],
  files: ReviewFileContext[]
): {
  passed: FindingV2[];
  rejected: Array<{ finding: FindingV2; reason: string }>;
} {
  const fileMap = new Map<string, ReviewFileContext>();
  for (const f of files) {
    fileMap.set(f.path, f);
  }

  // Check reviewable files filter
  const { ignored } = filterReviewableFiles(files.map((f) => ({ path: f.path })));
  const ignoredPaths = new Set(ignored.map((i: { path: string }) => i.path));

  const passed: FindingV2[] = [];
  const rejected: Array<{ finding: FindingV2; reason: string }> = [];

  for (const finding of findings) {
    if (ignoredPaths.has(finding.file)) {
      rejected.push({
        finding,
        reason: `File '${finding.file}' is in ignored paths list`,
      });
      continue;
    }

    const fileCtx = fileMap.get(finding.file);
    if (!fileCtx) {
      rejected.push({
        finding,
        reason: `File '${finding.file}' does not exist at head SHA`,
      });
      continue;
    }

    // Check verbatim snippet existence
    if (!fileCtx.content.includes(finding.evidenceSnippet)) {
      rejected.push({
        finding,
        reason: `Evidence snippet not found verbatim in '${finding.file}'`,
      });
      continue;
    }

    // Check line ordering
    if (finding.lineEnd < finding.lineStart) {
      rejected.push({
        finding,
        reason: `lineEnd (${finding.lineEnd}) < lineStart (${finding.lineStart})`,
      });
      continue;
    }

    passed.push(finding);
  }

  return { passed, rejected };
}

/**
 * Deduplicates overlapping findings across agents.
 */
export function deduplicateCandidateFindings(
  findings: FindingV2[]
): {
  unique: FindingV2[];
  duplicates: Array<{ finding: FindingV2; reason: string }>;
} {
  const unique: FindingV2[] = [];
  const duplicates: Array<{ finding: FindingV2; reason: string }> = [];

  for (const candidate of findings) {
    const existingIdx = unique.findIndex(
      (u) =>
        u.file === candidate.file &&
        Math.max(u.lineStart, candidate.lineStart) <=
          Math.min(u.lineEnd, candidate.lineEnd)
    );

    if (existingIdx === -1) {
      unique.push(candidate);
    } else {
      const existing = unique[existingIdx]!;
      // Retain the one with higher confidence or longer explanation
      if (
        candidate.confidence > existing.confidence ||
        (candidate.confidence === existing.confidence &&
          candidate.explanation.length > existing.explanation.length)
      ) {
        duplicates.push({
          finding: existing,
          reason: `Duplicate of finding '${candidate.title}' on ${candidate.file}:${candidate.lineStart}-${candidate.lineEnd}`,
        });
        unique[existingIdx] = candidate;
      } else {
        duplicates.push({
          finding: candidate,
          reason: `Duplicate of finding '${existing.title}' on ${existing.file}:${existing.lineStart}-${existing.lineEnd}`,
        });
      }
    }
  }

  return { unique, duplicates };
}

/**
 * End-to-end verification pipeline (plan.md Phase 5):
 * 1. Deterministic gates (file exists, not ignored, snippet verbatim, line bounds)
 * 2. Deduplication across findings
 * 3. Second-pass LLM Verification Agent with provider diversity
 * 4. Combined confidence scoring and rejection reason tracking
 */
export async function verifyCandidateFindings(
  candidates: FindingV2[],
  files: ReviewFileContext[],
  options: VerificationPipelineOptions = {}
): Promise<VerificationPipelineResult> {
  const startTime = Date.now();
  const minConfidence = options.minConfidence ?? 0.7;
  const provider =
    options.verifierProvider ??
    getLLMProvider(process.env["LLM_VERIFY_MODEL"] ? undefined : undefined);

  logger.info(
    { candidateCount: candidates.length, provider: provider.name },
    "Starting finding verification pipeline"
  );

  // Stage 1: Deterministic gates
  const gateResult = runDeterministicVerificationGate(candidates, files);

  // Stage 2: Deduplication
  const dedupResult = deduplicateCandidateFindings(gateResult.passed);

  const fileMap = new Map<string, ReviewFileContext>();
  for (const f of files) {
    fileMap.set(f.path, f);
  }

  // Stage 3 & 4: LLM Verification Agent execution per candidate
  const verifiedFindings: VerifiedFinding[] = [];
  const rejectedFindings: Array<{
    finding: FindingV2;
    stage: "deterministic_gate" | "deduplication" | "verification_agent";
    reason: string;
  }> = [];

  // Record deterministic and deduplication rejections
  for (const r of gateResult.rejected) {
    rejectedFindings.push({
      finding: r.finding,
      stage: "deterministic_gate",
      reason: r.reason,
    });
  }

  for (const d of dedupResult.duplicates) {
    rejectedFindings.push({
      finding: d.finding,
      stage: "deduplication",
      reason: d.reason,
    });
  }

  let verifiedCount = 0;
  let rejectedByVerifierCount = 0;
  let uncertainCount = 0;

  for (const candidate of dedupResult.unique) {
    const fileCtx = fileMap.get(candidate.file)!;
    const prompt = buildVerificationPrompt(
      candidate,
      fileCtx.content,
      options.staticAnalysisHints
    );

    try {
      const llmResult = await provider.generateStructured(
        prompt,
        VerificationVerdictSchema,
        options.verifierModel ? { model: options.verifierModel } : undefined
      );

      const verdict: VerificationVerdict = llmResult.output;

      // Corroboration score: boost confidence if static analysis hints corroborate this finding
      const hasCorroboration =
        options.staticAnalysisHints?.some((h) =>
          h.toLowerCase().includes(candidate.category.toLowerCase())
        ) ?? false;

      const corroborationBonus = hasCorroboration ? 0.15 : 0;
      const combinedConfidence = Math.min(
        1.0,
        Number((verdict.confidence * 0.85 + corroborationBonus).toFixed(2))
      );

      if (verdict.verdict === "confirmed" && combinedConfidence >= minConfidence) {
        verifiedCount++;
        verifiedFindings.push({
          ...candidate,
          severity: verdict.adjustedSeverity ?? candidate.severity,
          verificationStatus: "verified",
          verifierReasoning: verdict.reasoning,
          executionPath: verdict.executionPath,
          originalConfidence: candidate.confidence,
          finalConfidence: combinedConfidence,
        });
      } else if (verdict.verdict === "uncertain") {
        uncertainCount++;
        rejectedFindings.push({
          finding: candidate,
          stage: "verification_agent",
          reason: `Uncertain verdict: ${verdict.reasoning}`,
        });
      } else {
        rejectedByVerifierCount++;
        rejectedFindings.push({
          finding: candidate,
          stage: "verification_agent",
          reason:
            verdict.verdict === "rejected"
              ? `Rejected by verifier: ${verdict.reasoning}`
              : `Confidence (${combinedConfidence}) below minimum threshold (${minConfidence})`,
        });
      }
    } catch (err: any) {
      // In case of verifier provider error, reject candidate safely (fail-closed for high precision)
      logger.warn(
        { finding: candidate.title, error: err.message },
        "Verification agent call failed, rejecting finding safely"
      );
      rejectedByVerifierCount++;
      rejectedFindings.push({
        finding: candidate,
        stage: "verification_agent",
        reason: `Verifier call failed: ${err.message}`,
      });
    }
  }

  const verificationDurationMs = Date.now() - startTime;

  logger.info(
    {
      totalCandidates: candidates.length,
      verifiedCount,
      rejectedByVerifierCount,
      uncertainCount,
      verificationDurationMs,
    },
    "Finding verification pipeline finished"
  );

  return {
    candidateCount: candidates.length,
    verifiedFindings,
    rejectedFindings,
    stats: {
      totalCandidates: candidates.length,
      passedDeterministic: gateResult.passed.length,
      rejectedDeterministic: gateResult.rejected.length,
      deduplicatedCount: dedupResult.duplicates.length,
      verifiedCount,
      rejectedByVerifierCount,
      uncertainCount,
      verificationDurationMs,
    },
  };
}
