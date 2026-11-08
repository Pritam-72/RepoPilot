import { logger } from "@acr/observability";
import type { FindingV2, AgentRun, AnalysisCoverage, ReviewStatus } from "@acr/review-contracts";
import {
  runSpecialisedAgent,
  type AgentDefinition,
  type AgentReviewContext,
  type AgentExecutionOptions,
  type AgentRunResult,
} from "./base-agent.js";
import { allSpecialisedAgents } from "./agent-definitions.js";
import type { TokenUsage } from "./llm-provider.js";
import { CostGuard, buildAnalysisCoverage } from "./reliability/index.js";

export interface MultiAgentReviewInput {
  files: AgentReviewContext["files"];
  staticAnalysisHints?: string[] | undefined;
  agents?: AgentDefinition[] | undefined;
}

export interface MultiAgentReviewOptions extends AgentExecutionOptions {
  agentTimeoutMs?: number | undefined;
  maxTokensPerReview?: number | undefined;
  llmProvider?: any;
}

export interface MultiAgentReviewResult {
  findings: FindingV2[];
  rejectedFindings: Array<{ finding: FindingV2; reason: string }>;
  agentRuns: AgentRun[];
  totalTokens: TokenUsage;
  totalDurationMs: number;
  perAgentFindingsCount: Record<string, number>;
  status: ReviewStatus;
  coverage: AnalysisCoverage;
}

/**
 * Deduplicates overlapping findings across agents (same file and overlapping line ranges).
 * When overlapping, prioritizes higher confidence or more detailed explanation.
 */
export function deduplicateFindings(findings: FindingV2[]): FindingV2[] {
  const deduped: FindingV2[] = [];

  for (const candidate of findings) {
    const existingIndex = deduped.findIndex(
      (existing) =>
        existing.file === candidate.file &&
        Math.max(existing.lineStart, candidate.lineStart) <=
          Math.min(existing.lineEnd, candidate.lineEnd)
    );

    if (existingIndex === -1) {
      deduped.push(candidate);
    } else {
      const existing = deduped[existingIndex]!;
      // Keep finding with higher confidence, or same confidence but longer explanation
      if (
        candidate.confidence > existing.confidence ||
        (candidate.confidence === existing.confidence &&
          candidate.explanation.length > existing.explanation.length)
      ) {
        deduped[existingIndex] = candidate;
      }
    }
  }

  return deduped;
}

/**
 * MultiAgentOrchestrator: Executes the specialised agents in parallel with per-agent timeout,
 * complete error isolation, and aggregated telemetry (plan.md Phase 4).
 */
export async function runMultiAgentReview(
  input: MultiAgentReviewInput,
  options: MultiAgentReviewOptions = {}
): Promise<MultiAgentReviewResult> {
  const agents = input.agents ?? allSpecialisedAgents;
  const startTime = Date.now();
  const context: AgentReviewContext = {
    files: input.files,
    staticAnalysisHints: input.staticAnalysisHints,
  };

  logger.info(
    {
      agentCount: agents.length,
      filesCount: input.files.length,
      agents: agents.map((a) => a.name),
    },
    "Starting multi-agent review orchestration"
  );

  // Run all specialised agents in parallel with per-agent timeout and error isolation
  const provider = options.provider ?? options.llmProvider;
  const agentPromises = agents.map((agent) =>
    runSpecialisedAgent(agent, context, {
      ...options,
      ...(provider ? { provider } : {}),
      timeoutMs: options.agentTimeoutMs ?? options.timeoutMs ?? 30000,
    })
  );

  const settledResults = await Promise.allSettled(agentPromises);

  const allRawFindings: FindingV2[] = [];
  const allRejectedFindings: Array<{ finding: FindingV2; reason: string }> = [];
  const agentRuns: AgentRun[] = [];
  const perAgentFindingsCount: Record<string, number> = {};

  const costGuard = new CostGuard({ maxTokensPerReview: options.maxTokensPerReview });

  settledResults.forEach((settled, idx) => {
    const agentDef = agents[idx]!;
    if (settled.status === "fulfilled") {
      const res: AgentRunResult = settled.value;
      allRawFindings.push(...res.findings);
      allRejectedFindings.push(...res.rejectedFindings);
      agentRuns.push(res.runRecord);
      perAgentFindingsCount[res.agent] = res.findings.length;
      costGuard.recordUsage(res.runRecord.tokens);
    } else {
      // Unhandled rejection inside runner (should not happen due to runSpecialisedAgent catch,
      // but handled here defensively)
      const err = settled.reason;
      logger.error(
        { agent: agentDef.name, error: err instanceof Error ? err.message : String(err) },
        "Agent promise unhandled rejection in orchestrator"
      );
      agentRuns.push({
        agent: agentDef.name,
        model: options.model ?? "unknown",
        promptVersion: agentDef.promptVersion,
        status: "failed",
        attempts: 1,
        tokens: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        durationMs: 0,
        error: err instanceof Error ? err.message : String(err),
      });
      perAgentFindingsCount[agentDef.name] = 0;
    }
  });

  const successfulAgents: string[] = [];
  const degradedAgents: Array<{ agent: string; error: string }> = [];

  for (const run of agentRuns) {
    if (run.status === "success") {
      successfulAgents.push(run.agent);
    } else {
      degradedAgents.push({ agent: run.agent, error: run.error ?? run.status });
    }
  }

  const coverage = buildAnalysisCoverage({
    allFiles: input.files.map((f) => f.path),
    analyzedFiles: input.files.map((f) => f.path),
    allAgents: agents.map((a) => a.name),
    successfulAgents,
    degradedAgents,
    tokenUsage: costGuard.getUsage(),
    costCapReached: costGuard.isCostCapReached(),
  });

  const dedupedFindings = deduplicateFindings(allRawFindings);
  const totalDurationMs = Date.now() - startTime;

  logger.info(
    {
      totalFindings: dedupedFindings.length,
      rejectedFindings: allRejectedFindings.length,
      totalTokens: costGuard.getTotalTokens(),
      totalDurationMs,
      perAgentFindingsCount,
      reviewStatus: coverage.reviewStatus,
    },
    "Multi-agent review orchestration completed"
  );

  return {
    findings: dedupedFindings,
    rejectedFindings: allRejectedFindings,
    agentRuns,
    totalTokens: costGuard.getUsage(),
    totalDurationMs,
    perAgentFindingsCount,
    status: coverage.reviewStatus,
    coverage,
  };
}
