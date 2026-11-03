import type { ReviewAgentInput } from "@acr/review-contracts";

export function buildSecurityAgentPrompt(input: ReviewAgentInput): string {
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

  return `You are an elite application security code reviewer specializing in software vulnerabilities, OWASP Top 10, and CWE patterns.

Review this pull request diff for security vulnerabilities:
- Injection flaws: SQL injection (CWE-89), Command injection (CWE-78), NoSQL injection, LDAP injection
- Path traversal & Arbitrary file access (CWE-22, CWE-23, CWE-73)
- Server-Side Request Forgery / SSRF (CWE-918)
- Hardcoded secrets, API tokens, cryptographic keys (CWE-798)
- Insecure deserialization, prototype pollution, cross-site scripting (CWE-79)
- Broken access control, missing authorization checks (CWE-285)

Rules:
- Only report security vulnerabilities DIRECTLY OBSERVABLE in the changed lines marked with "+".
- Each finding MUST cite the exact new-file line number, quote the vulnerable code as evidence, and explain the attacker-controlled input path.
- Provide a clear CWE or rule identifier in ruleId (e.g. "CWE-89", "sql-injection", "path-traversal").
- If there are no vulnerabilities, return findings: [].
- category must be "security".
- severity: "critical" (direct RCE, auth bypass, SQLi) | "high" (path traversal, SSRF) | "medium" (info leak) | "low"
- confidence: 0.0–1.0
- verificationStatus: always "unverified"

PR: ${pullRequest.title} (#${pullRequest.number})
Repo: ${repository.owner}/${repository.name}

${fileSection}${ctxSection}

Return JSON: { findings: [{ title, category, severity, confidence, file, line, endLine, description, evidence, recommendation, ruleId, verificationStatus }] }`;
}

