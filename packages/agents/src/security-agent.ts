import { z } from "zod";
import { FindingSchema } from "@acr/review-contracts";
import type { ReviewAgentInput, Finding } from "@acr/review-contracts";
import { generateStructuredOutput, type LLMProviderOptions } from "./llm-provider.js";
import { buildSecurityAgentPrompt } from "./prompts/security-agent.prompt.js";
import { getChangedLineNumbers } from "@acr/github";
import { logger } from "@acr/observability";

const SecurityAgentOutputSchema = z.object({
  findings: z.array(FindingSchema),
});

export type SecurityAgentOutput = z.infer<typeof SecurityAgentOutputSchema>;

export async function runSecurityReviewAgent(
  input: ReviewAgentInput,
  opts: LLMProviderOptions = {}
): Promise<SecurityAgentOutput> {
  const prompt = buildSecurityAgentPrompt(input);

  logger.info(
    {
      repo: `${input.repository.owner}/${input.repository.name}`,
      pr: input.pullRequest.number,
      files: input.changedFiles.length,
    },
    "SecurityReviewAgent start"
  );

  const output = await generateStructuredOutput(prompt, SecurityAgentOutputSchema, opts);

  // Post-filter: keep only findings on actually-changed (added) lines
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
      category: "security" as const,
    }));

  logger.info(
    { total: output.findings.length, verified: verified.length },
    "SecurityReviewAgent complete"
  );

  return { findings: verified };
}
