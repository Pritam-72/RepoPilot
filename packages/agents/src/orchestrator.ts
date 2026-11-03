import { runBugReviewAgent } from "./bug-agent.js";
import { runSecurityReviewAgent } from "./security-agent.js";
import { runQualityReviewAgent } from "./quality-agent.js";
import { runPerformanceReviewAgent } from "./performance-agent.js";
import { runDependencyReviewAgent } from "./dependency-agent.js";
import type { ReviewAgentInput, Finding } from "@acr/review-contracts";
import type { LLMProviderOptions } from "./llm-provider.js";
import { logger } from "@acr/observability";

export type AgentType = "bug" | "security" | "quality" | "performance" | "dependency";

export interface AgentExecutionResult {
  agentType: AgentType;
  status: "completed" | "failed";
  findings: Finding[];
  error?: string | undefined;
  durationMs: number;
}

export interface OrchestratedReviewResult {
  status: "completed" | "partially_completed" | "failed";
  agentRuns: AgentExecutionResult[];
  allFindings: Finding[];
  totalFindings: number;
  durationMs: number;
}

export interface OrchestratorOptions extends LLMProviderOptions {
  enabledAgents?: AgentType[] | undefined;
  useIntelligentRouting?: boolean | undefined;
}

export const MANIFEST_FILE_PATTERNS = [
  /package\.json$/i,
  /package-lock\.json$/i,
  /pnpm-lock\.yaml$/i,
  /yarn\.lock$/i,
  /requirements\.txt$/i,
  /pyproject\.toml$/i,
  /poetry\.lock$/i,
  /go\.mod$/i,
  /go\.sum$/i,
  /Cargo\.toml$/i,
  /Cargo\.lock$/i,
];

/**
 * Intelligent file-to-agent router that selects relevant agents based on changed file characteristics.
 */
export function routeAgentsForChanges(changedFiles: { path: string }[]): AgentType[] {
  const selected = new Set<AgentType>();

  const hasManifestChanges = changedFiles.some((f) =>
    MANIFEST_FILE_PATTERNS.some((pat) => pat.test(f.path))
  );

  const hasCodeChanges = changedFiles.some(
    (f) => !MANIFEST_FILE_PATTERNS.some((pat) => pat.test(f.path))
  );

  if (hasCodeChanges || changedFiles.length === 0) {
    selected.add("bug");
    selected.add("security");
    selected.add("quality");
    selected.add("performance");
  }

  if (hasManifestChanges) {
    selected.add("dependency");
    selected.add("security");
  }

  return Array.from(selected);
}

export async function runReviewOrchestrator(
  input: ReviewAgentInput,
  opts: OrchestratorOptions = {}
): Promise<OrchestratedReviewResult> {
  const startTime = Date.now();
  const enabledAgents: AgentType[] =
    opts.enabledAgents ??
    (opts.useIntelligentRouting
      ? routeAgentsForChanges(input.changedFiles)
      : ["bug", "security", "quality"]);

  logger.info(
    {
      repo: `${input.repository.owner}/${input.repository.name}`,
      pr: input.pullRequest.number,
      agents: enabledAgents,
    },
    "Multi-agent review orchestration started"
  );

  type AgentRunner = (inp: ReviewAgentInput, o?: LLMProviderOptions) => Promise<{ findings: Finding[] }>;

  const agentMap: Record<AgentType, AgentRunner> = {
    bug: runBugReviewAgent,
    security: runSecurityReviewAgent,
    quality: runQualityReviewAgent,
    performance: runPerformanceReviewAgent,
    dependency: runDependencyReviewAgent,
  };

  // Run enabled agents in parallel with fault isolation
  const tasks = enabledAgents.map(async (agentType): Promise<AgentExecutionResult> => {
    const runner = agentMap[agentType];
    const taskStart = Date.now();

    try {
      const result = await runner(input, opts);
      const durationMs = Date.now() - taskStart;

      return {
        agentType,
        status: "completed",
        findings: result.findings,
        durationMs,
      };
    } catch (err: unknown) {
      const durationMs = Date.now() - taskStart;
      const errorMsg = err instanceof Error ? err.message : String(err);

      logger.warn(
        { agentType, error: errorMsg, durationMs },
        "Agent execution failed during orchestration"
      );

      return {
        agentType,
        status: "failed",
        findings: [],
        error: errorMsg,
        durationMs,
      };
    }
  });

  const settled = await Promise.all(tasks);

  const completedCount = settled.filter((r) => r.status === "completed").length;
  const failedCount = settled.filter((r) => r.status === "failed").length;

  let overallStatus: OrchestratedReviewResult["status"];
  if (failedCount === 0) {
    overallStatus = "completed";
  } else if (completedCount > 0) {
    overallStatus = "partially_completed";
  } else {
    overallStatus = "failed";
  }

  const allFindings = settled.flatMap((r) => r.findings);
  const totalDurationMs = Date.now() - startTime;

  logger.info(
    {
      status: overallStatus,
      completed: completedCount,
      failed: failedCount,
      totalFindings: allFindings.length,
      durationMs: totalDurationMs,
    },
    "Multi-agent review orchestration finished"
  );

  return {
    status: overallStatus,
    agentRuns: settled,
    allFindings,
    totalFindings: allFindings.length,
    durationMs: totalDurationMs,
  };
}
