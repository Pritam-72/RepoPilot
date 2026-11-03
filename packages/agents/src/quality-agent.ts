import { z } from "zod";
import { FindingSchema } from "@acr/review-contracts";
import type { ReviewAgentInput, Finding } from "@acr/review-contracts";
import { generateStructuredOutput, type LLMProviderOptions } from "./llm-provider.js";
import { buildQualityAgentPrompt } from "./prompts/quality-agent.prompt.js";
import { getChangedLineNumbers } from "@acr/github";
import { logger } from "@acr/observability";

const QualityAgentOutputSchema = z.object({
  findings: z.array(FindingSchema),
});

export type QualityAgentOutput = z.infer<typeof QualityAgentOutputSchema>;

export async function runQualityReviewAgent(
  input: ReviewAgentInput,
  opts: LLMProviderOptions = {}
): Promise<QualityAgentOutput> {
  const prompt = buildQualityAgentPrompt(input);

  logger.info(
    {
      repo: `${input.repository.owner}/${input.repository.name}`,
      pr: input.pullRequest.number,
      files: input.changedFiles.length,
    },
    "QualityReviewAgent start"
  );

  const output = await generateStructuredOutput(prompt, QualityAgentOutputSchema, opts);

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
      category: f.category === "testing" ? "testing" : "maintainability",
    }));

  logger.info(
    { total: output.findings.length, verified: verified.length },
    "QualityReviewAgent complete"
  );

  return { findings: verified };
}

