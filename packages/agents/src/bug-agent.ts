import { z } from "zod";
import { FindingSchema } from "@acr/review-contracts";
import type { ReviewAgentInput } from "@acr/review-contracts";
import { generateStructuredOutput, type LLMProviderOptions } from "./llm-provider.js";
import { buildBugAgentPrompt } from "./prompts/bug-agent.prompt.js";
import { parseDiff, getChangedLineNumbers } from "@acr/github";
import { logger } from "@acr/observability";

const BugAgentOutputSchema = z.object({
  findings: z.array(FindingSchema),
});

export type BugAgentOutput = z.infer<typeof BugAgentOutputSchema>;

export async function runBugReviewAgent(
  input: ReviewAgentInput,
  opts: LLMProviderOptions = {}
): Promise<BugAgentOutput> {
  const prompt = buildBugAgentPrompt(input);

  logger.info(
    {
      repo: `${input.repository.owner}/${input.repository.name}`,
      pr: input.pullRequest.number,
      files: input.changedFiles.length,
    },
    "BugReviewAgent start"
  );

  const output = await generateStructuredOutput(prompt, BugAgentOutputSchema, opts);

  // Post-filter: keep only findings on actually-changed (added) lines
  const changedLinesByFile = new Map<string, Set<number>>(
    input.changedFiles
      .filter((f) => f.patch)
      .map((f) => [f.path, getChangedLineNumbers(f.patch!)])
  );

  const verified = output.findings.filter((f) => {
    const lines = changedLinesByFile.get(f.file);
    return lines ? lines.has(f.line) : false;
  });

  logger.info(
    { total: output.findings.length, verified: verified.length },
    "BugReviewAgent complete"
  );

  return { findings: verified };
}
