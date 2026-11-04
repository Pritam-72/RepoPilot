import { z } from "zod";
import { logger } from "@acr/observability";
import { getLLMProvider, type LLMProvider, type TokenUsage } from "./llm-provider.js";
import {
  FindingV2Schema,
  type FindingV2,
  type AgentRun,
} from "@acr/review-contracts";
import {
  runDeterministicPostChecks,
  type ReviewFileContext,
} from "./generalist-agent.js";

export type AgentCategory =
  | "bug"
  | "security"
  | "error-handling"
  | "test"
  | "performance"
  | "quality";

export interface AgentDefinition {
  name: string;
  category: AgentCategory;
  promptVersion: string;
  systemPrompt: string;
  doNotReport: string[];
}

export interface AgentReviewContext {
  files: ReviewFileContext[];
  staticAnalysisHints?: string[] | undefined;
}

export interface AgentExecutionOptions {
  provider?: LLMProvider | undefined;
  model?: string | undefined;
  minConfidence?: number | undefined;
  timeoutMs?: number | undefined;
}

export interface AgentRunResult {
  agent: string;
  category: AgentCategory;
  findings: FindingV2[];
  rejectedFindings: Array<{ finding: FindingV2; reason: string }>;
  runRecord: AgentRun;
}

const AgentRawOutputSchema = z.object({
  findings: z.array(FindingV2Schema),
  summary: z.string().optional(),
});

/**
 * Builds the isolated prompt for a specialised agent (Section 9 Phase 4).
 */
export function buildAgentPrompt(
  agent: AgentDefinition,
  context: AgentReviewContext
): string {
  const doNotReportList = agent.doNotReport
    .map((item) => `  - DO NOT REPORT: ${item}`)
    .join("\n");

  const hintsSection =
    context.staticAnalysisHints && context.staticAnalysisHints.length > 0
      ? `\n### STATIC ANALYSIS CORROBORATION HINTS:\n${context.staticAnalysisHints.map((h) => `- ${h}`).join("\n")}\n`
      : "";

  const filesSection = context.files
    .map(
      (f) => `### FILE: ${f.path}
#### DIFF / PATCH:
\`\`\`diff
${f.patch}
\`\`\`

#### FULL FILE CONTENT (HEAD SHA):
\`\`\`
${f.content}
\`\`\`
`
    )
    .join("\n\n");

  return `You are a specialised senior code reviewer focusing exclusively on: ${agent.name} (${agent.category}).
Prompt Version: ${agent.promptVersion}

ROLE & OBJECTIVES:
${agent.systemPrompt}

EXPLICIT BOUNDARIES & EXCLUSIONS:
${doNotReportList}
- You MUST ONLY report issues strictly categorized as "${agent.category}". Any finding outside "${agent.category}" is invalid.
- Never hallucinate line numbers or file paths.
- evidenceSnippet must be an exact, verbatim snippet of characters present in the provided file content.
- lineStart and lineEnd must refer to lines inside the added or modified parts of the diff patch.
- confidence must be between 0.0 and 1.0. Set confidence >= 0.7 for confirmed issues.
${hintsSection}
FILES TO REVIEW:
${filesSection}
`;
}

/**
 * Executes a single specialised agent with strict timeout, error isolation, category enforcement,
 * and deterministic post-checks.
 */
export async function runSpecialisedAgent(
  agent: AgentDefinition,
  context: AgentReviewContext,
  options: AgentExecutionOptions = {}
): Promise<AgentRunResult> {
  const provider = options.provider ?? getLLMProvider();
  const minConfidence = options.minConfidence ?? 0.7;
  const timeoutMs = options.timeoutMs ?? 30000;
  const startTime = Date.now();

  const emptyTokens: TokenUsage = {
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
  };

  logger.info(
    { agent: agent.name, category: agent.category, filesCount: context.files.length },
    "Starting specialised review agent execution"
  );

  try {
    const prompt = buildAgentPrompt(agent, context);

    // Timeout promise for execution isolation
    let timeoutHandle: NodeJS.Timeout | null = null;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => {
        const err = new Error(`Agent ${agent.name} timed out after ${timeoutMs}ms`);
        err.name = "TimeoutError";
        reject(err);
      }, timeoutMs);
    });

    const llmPromise = provider.generateStructured(
      prompt,
      AgentRawOutputSchema,
      options.model ? { model: options.model } : undefined
    );

    const result = await Promise.race([llmPromise, timeoutPromise]).finally(() => {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    });

    const durationMs = Date.now() - startTime;

    // Category and sourceAgent enforcement:
    // Any finding reported must match this agent's category and name
    const rawFindings = result.output.findings.map((f) => ({
      ...f,
      category: agent.category,
      sourceAgent: agent.name,
    }));

    // Run strict deterministic post-checks (file exists, lines in diff, snippet verbatim, etc.)
    const checkResult = runDeterministicPostChecks(
      rawFindings,
      context.files,
      minConfidence
    );

    const runRecord: AgentRun = {
      agent: agent.name,
      model: result.model,
      promptVersion: agent.promptVersion,
      status: "success",
      attempts: 1,
      tokens: result.usage,
      durationMs,
    };

    logger.info(
      {
        agent: agent.name,
        validFindings: checkResult.validFindings.length,
        rejectedFindings: checkResult.rejectedFindings.length,
        durationMs,
        tokens: result.usage.totalTokens,
      },
      "Specialised review agent execution succeeded"
    );

    return {
      agent: agent.name,
      category: agent.category,
      findings: checkResult.validFindings,
      rejectedFindings: checkResult.rejectedFindings,
      runRecord,
    };
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    const isTimeout = err.name === "TimeoutError";

    const runRecord: AgentRun = {
      agent: agent.name,
      model: options.model ?? provider.name,
      promptVersion: agent.promptVersion,
      status: isTimeout ? "timeout" : "failed",
      attempts: 1,
      tokens: emptyTokens,
      durationMs,
      error: err instanceof Error ? err.message : String(err),
    };

    logger.warn(
      {
        agent: agent.name,
        category: agent.category,
        status: runRecord.status,
        durationMs,
        error: runRecord.error,
      },
      "Specialised review agent failed or timed out (isolated)"
    );

    return {
      agent: agent.name,
      category: agent.category,
      findings: [],
      rejectedFindings: [],
      runRecord,
    };
  }
}
