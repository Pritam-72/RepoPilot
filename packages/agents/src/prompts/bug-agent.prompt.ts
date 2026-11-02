import type { ReviewAgentInput } from "@acr/review-contracts";

export function buildBugAgentPrompt(input: ReviewAgentInput): string {
  const { repository, pullRequest, changedFiles, context } = input;

  const fileSection = changedFiles
    .filter((f) => f.patch)
    .map((f) => `### File: ${f.path}\nDiff:\n\`\`\`\n${f.patch}\n\`\`\``)
    .join("\n\n");

  const ctxSection = context.length
    ? "\n### Context (surrounding code)\n" +
      context
        .map((c) => `#### ${c.path}:${c.startLine}-${c.endLine}\n\`\`\`\n${c.content}\n\`\`\``)
        .join("\n")
    : "";

  return `You are an expert code reviewer specialising in correctness bugs and logic errors.

Review this pull request and find ONLY defects that are DIRECTLY OBSERVABLE in the diff shown.

Rules:
- Only report findings for lines marked with "+" (added/modified) in the diff.
- Each finding MUST cite a specific new-file line number and quote the exact code as evidence.
- Do NOT infer bugs in code not visible in the diff.
- If there are no bugs, return findings: [].
- category must be "correctness".
- severity: "critical" | "high" | "medium" | "low" | "informational"
- confidence: 0.0–1.0 (how certain you are)
- verificationStatus: always "unverified"

PR: ${pullRequest.title} (#${pullRequest.number})
Repo: ${repository.owner}/${repository.name}

${fileSection}${ctxSection}

Return JSON: { findings: [{ title, category, severity, confidence, file, line, description, evidence, recommendation, verificationStatus }] }`;
}
