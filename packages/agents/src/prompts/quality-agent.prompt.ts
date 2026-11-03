import type { ReviewAgentInput } from "@acr/review-contracts";

export function buildQualityAgentPrompt(input: ReviewAgentInput): string {
  const { repository, pullRequest, changedFiles, context } = input;

  const fileSection = changedFiles
    .filter((f) => f.patch)
    .map((f) => `### File: ${f.path}\nDiff:\n\`\`\`\n${f.patch}\n\`\`\``)
    .join("\n\n");

  const ctxSection = context.length
    ? "\n### Surrounding Context\n" +
      context
        .map((c) => `#### ${c.path}:${c.startLine}-${c.endLine}\n\`\`\`\n${c.content}\n\`\`\``)
        .join("\n")
    : "";

  return `You are a software architect and test engineering specialist reviewing code for maintainability, reliability, and test coverage gaps.

Review this pull request diff for:
1. Test Coverage Gaps (category: "testing"):
   - New business logic, edge-case branches, or complex calculations added without corresponding unit/integration test coverage.
   - Missing test assertions for error conditions or boundary values.
2. Code Quality & Maintainability (category: "maintainability"):
   - Unhandled exception / promise rejection paths, resource leaks (unclosed sockets/files).
   - High cyclomatic complexity, deeply nested logic, excessive code duplication.
   - Anti-patterns or tight coupling that harms code maintainability.

Rules:
- Only report issues on changed lines marked with "+".
- Each finding MUST cite the exact new-file line number, quote the exact code as evidence, and explain the concrete risk.
- Do NOT nitpick stylistic preferences (formatting, naming style, import sorting). Focus on substantive code health and testing deficiencies.
- If the change is clean, well-structured, and sufficiently tested, return findings: [].
- category must be either "testing" or "maintainability".
- severity: "high" | "medium" | "low" | "informational"
- confidence: 0.0–1.0
- verificationStatus: always "unverified"

PR: ${pullRequest.title} (#${pullRequest.number})
Repo: ${repository.owner}/${repository.name}

${fileSection}${ctxSection}

Return JSON: { findings: [{ title, category, severity, confidence, file, line, endLine, description, evidence, recommendation, ruleId, verificationStatus }] }`;
}

