import type { Octokit } from "@octokit/rest";
import type { Finding } from "@acr/review-contracts";
import { logger } from "@acr/observability";

export interface PublishReviewParams {
  octokit: Octokit;
  owner: string;
  repo: string;
  prNumber: number;
  commitSha: string;
  findings: Finding[];
  changedLinesByFile?: Map<string, Set<number>>;
  existingComments?: Array<{ body?: string }>;
}

export interface PublishReviewResult {
  reviewId?: number | undefined;
  inlineCommentsCount: number;
  summaryFindingsCount: number;
  skippedDuplicatesCount: number;
  reviewBody: string;
}

export function computeFindingMarker(finding: Finding): string {
  const normTitle = finding.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `<!-- acr-finding:${finding.file}:${finding.line}:${finding.category}:${finding.ruleId || normTitle} -->`;
}

export function formatInlineComment(finding: Finding): string {
  const marker = computeFindingMarker(finding);
  const sevEmoji: Record<string, string> = {
    critical: "🚨",
    high: "⚠️",
    medium: "🟡",
    low: "ℹ️",
    informational: "📝",
  };

  const emoji = sevEmoji[finding.severity] || "⚠️";
  const confidencePercent = Math.round(finding.confidence * 100);

  let body = `${marker}\n### ${emoji} [${finding.severity.toUpperCase()}] ${finding.title}\n`;
  body += `**Category:** \`${finding.category}\` | **Confidence:** \`${confidencePercent}%\``;
  if (finding.ruleId) {
    body += ` | **Rule:** \`${finding.ruleId}\``;
  }
  body += `\n\n${finding.description}\n\n`;

  if (finding.evidence) {
    body += `**Observed Evidence:**\n\`\`\`\n${finding.evidence}\n\`\`\`\n\n`;
  }

  if (finding.recommendation) {
    body += `💡 **Recommendation:**\n${finding.recommendation}\n`;
  }

  return body;
}

export function generateReviewSummary(
  findings: Finding[],
  outsideDiffFindings: Finding[]
): string {
  const counts = {
    critical: findings.filter((f) => f.severity === "critical").length,
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
    informational: findings.filter((f) => f.severity === "informational").length,
  };

  let summary = `## 🤖 RepoPilot AI Code Review Summary\n\n`;

  if (findings.length === 0) {
    summary += `✅ **No critical issues found.** This pull request passed all agentic review checks!\n`;
    return summary;
  }

  summary += `| Severity | Count |\n|---|:---:|\n`;
  summary += `| 🚨 Critical | ${counts.critical} |\n`;
  summary += `| ⚠️ High | ${counts.high} |\n`;
  summary += `| 🟡 Medium | ${counts.medium} |\n`;
  summary += `| ℹ️ Low | ${counts.low} |\n\n`;

  if (outsideDiffFindings.length > 0) {
    summary += `### 📋 General & Surrounding Context Findings\n\n`;
    for (const f of outsideDiffFindings) {
      summary += `- **${f.file}:${f.line}** [${f.severity.toUpperCase()}] **${f.title}**: ${f.description}\n`;
      if (f.recommendation) {
        summary += `  *Recommendation:* ${f.recommendation}\n`;
      }
    }
    summary += "\n";
  }

  summary += `*Generated automatically by RepoPilot Multi-Agent Reviewer.*`;
  return summary;
}

export async function publishPRReview(
  params: PublishReviewParams
): Promise<PublishReviewResult> {
  const {
    octokit,
    owner,
    repo,
    prNumber,
    commitSha,
    findings,
    changedLinesByFile,
    existingComments,
  } = params;

  // 1. Fetch existing review comments if not provided to guarantee idempotency
  let existingBodies: string[] = [];
  if (existingComments) {
    existingBodies = existingComments.map((c) => c.body || "");
  } else {
    try {
      const { data } = await octokit.pulls.listReviewComments({
        owner,
        repo,
        pull_number: prNumber,
        per_page: 100,
      });
      existingBodies = data.map((c) => c.body || "");
    } catch {
      existingBodies = [];
    }
  }

  const existingMarkers = new Set<string>();
  for (const body of existingBodies) {
    const match = body.match(/<!-- acr-finding:[^>]+ -->/);
    if (match) {
      existingMarkers.add(match[0]);
    }
  }

  // 2. Partition findings into inline (within changed lines) vs outside diff
  const inlineCandidates: Finding[] = [];
  const outsideDiffFindings: Finding[] = [];
  let skippedDuplicatesCount = 0;

  for (const f of findings) {
    const marker = computeFindingMarker(f);
    if (existingMarkers.has(marker)) {
      skippedDuplicatesCount++;
      continue;
    }

    const fileLines = changedLinesByFile?.get(f.file);
    if (fileLines && fileLines.has(f.line)) {
      inlineCandidates.push(f);
    } else {
      outsideDiffFindings.push(f);
    }
  }

  // 3. Format inline comments
  const inlineComments = inlineCandidates.map((f) => ({
    path: f.file,
    line: f.line,
    body: formatInlineComment(f),
  }));

  // 4. Construct overall review summary
  const summaryBody = generateReviewSummary(findings, outsideDiffFindings);

  // 5. Post review via Octokit
  let reviewId: number | undefined;
  try {
    const { data } = await octokit.pulls.createReview({
      owner,
      repo,
      pull_number: prNumber,
      commit_id: commitSha,
      event: "COMMENT",
      body: summaryBody,
      comments: inlineComments,
    });
    reviewId = data.id;
  } catch (err: unknown) {
    logger.warn({ error: err instanceof Error ? err.message : String(err) }, "Failed to create PR review");
  }

  logger.info(
    {
      pr: prNumber,
      inlineCount: inlineComments.length,
      outsideCount: outsideDiffFindings.length,
      skippedDuplicates: skippedDuplicatesCount,
      reviewId,
    },
    "PR review published to GitHub"
  );

  return {
    reviewId,
    inlineCommentsCount: inlineComments.length,
    summaryFindingsCount: outsideDiffFindings.length,
    skippedDuplicatesCount,
    reviewBody: summaryBody,
  };
}
