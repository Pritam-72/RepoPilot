import { z } from "zod";
import { FindingSchema, type ReviewAgentInput, type Finding } from "@acr/review-contracts";
import { generateStructuredOutput, type LLMProviderOptions } from "./llm-provider.js";
import { DEPENDENCY_AGENT_SYSTEM_PROMPT } from "./prompts/dependency-agent.prompt.js";
import { getChangedLineNumbers } from "@acr/github";
import { logger } from "@acr/observability";

const DependencyAgentOutputSchema = z.object({
  findings: z.array(FindingSchema),
});

export type DependencyAgentOutput = z.infer<typeof DependencyAgentOutputSchema>;

export function buildDependencyAgentPrompt(input: ReviewAgentInput): string {
  const manifestSections = input.changedFiles
    .filter((f) => f.patch && f.status !== "removed")
    .map((f) => `### Manifest File: ${f.path}\n\`\`\`diff\n${f.patch}\n\`\`\``)
    .join("\n\n");

  return `${DEPENDENCY_AGENT_SYSTEM_PROMPT}

Repository: ${input.repository.owner}/${input.repository.name}
Pull Request #${input.pullRequest.number}: ${input.pullRequest.title}

MANIFEST & DEPENDENCY DIFFS:
${manifestSections}

Analyze the dependency changes for known vulnerable versions, wildcard version pinning, typosquatting, or insecure registry protocols.
Return structured findings conforming to the schema. If dependencies are safe, return findings: [].
`;
}

export async function runDependencyReviewAgent(
  input: ReviewAgentInput,
  opts: LLMProviderOptions = {}
): Promise<DependencyAgentOutput> {
  const prompt = buildDependencyAgentPrompt(input);

  logger.info(
    {
      repo: `${input.repository.owner}/${input.repository.name}`,
      pr: input.pullRequest.number,
      files: input.changedFiles.length,
    },
    "DependencyReviewAgent start"
  );

  const output = await generateStructuredOutput(prompt, DependencyAgentOutputSchema, opts);

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
      category: "dependency" as const,
    }));

  logger.info(
    { total: output.findings.length, verified: verified.length },
    "DependencyReviewAgent complete"
  );

  return { findings: verified };
}
