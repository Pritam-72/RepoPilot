import { z } from "zod";
import { FindingSchema, type ReviewAgentInput, type Finding } from "@acr/review-contracts";
import { generateStructuredOutput, type LLMProviderOptions } from "./llm-provider.js";
import { PERFORMANCE_AGENT_SYSTEM_PROMPT } from "./prompts/performance-agent.prompt.js";
import { getChangedLineNumbers } from "@acr/github";
import { logger } from "@acr/observability";

const PerformanceAgentOutputSchema = z.object({
  findings: z.array(FindingSchema),
});

export type PerformanceAgentOutput = z.infer<typeof PerformanceAgentOutputSchema>;

export function buildPerformanceAgentPrompt(input: ReviewAgentInput): string {
  const fileSections = input.changedFiles
    .filter((f) => f.patch && f.status !== "removed")
    .map((f) => `### File: ${f.path}\n\`\`\`diff\n${f.patch}\n\`\`\``)
    .join("\n\n");

  return `${PERFORMANCE_AGENT_SYSTEM_PROMPT}

Repository: ${input.repository.owner}/${input.repository.name}
Pull Request #${input.pullRequest.number}: ${input.pullRequest.title}
${input.pullRequest.description ? `PR Description:\n${input.pullRequest.description}\n` : ""}

CHANGED FILES & DIFFS:
${fileSections}

Analyze the changes for performance regressions, N+1 queries, unindexed queries, and algorithmic complexity issues.
Return structured findings conforming to the schema. If no performance defects are found, return findings: [].
`;
}

export async function runPerformanceReviewAgent(
  input: ReviewAgentInput,
  opts: LLMProviderOptions = {}
): Promise<PerformanceAgentOutput> {
  const prompt = buildPerformanceAgentPrompt(input);

  logger.info(
    {
      repo: `${input.repository.owner}/${input.repository.name}`,
      pr: input.pullRequest.number,
      files: input.changedFiles.length,
    },
    "PerformanceReviewAgent start"
  );

  const output = await generateStructuredOutput(prompt, PerformanceAgentOutputSchema, opts);

  // Post-filter: keep only findings on actually-changed lines
  const changedLinesByFile = new Map<string, Set<number>>(
    input.changedFiles
      .filter((f) => f.patch)
      .map((f) => [f.path, getChangedLineNumbers(f.patch!)])
  );

  const verified: Finding[] = output.findings
    .filter((f) => {
      const lines = changedLinesByFile.get(f.file);
      return lines ? lines.has(f.line) : false;
    })
    .map((f) => ({
      ...f,
      category: "performance" as const,
    }));

  logger.info(
    { total: output.findings.length, verified: verified.length },
    "PerformanceReviewAgent complete"
  );

  return { findings: verified };
}
