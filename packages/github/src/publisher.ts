import type { Octokit } from "@octokit/rest";
import type { Finding, AnalysisCoverage } from "@acr/review-contracts";
import { logger } from "@acr/observability";

export interface PublishReviewParams {
  octokit: Octokit;
  owner: string;
  repo: string;
  prNumber: number;
  commitSha: string;
  findings: Finding[];
  changedLinesByFile?: Map<string, Set<number>>;
  existingComments?: Array<{ id?: number; body?: string; path?: string; line?: number }>;
  coverage?: AnalysisCoverage | undefined;
  dryRun?: boolean | undefined;
}

export interface PublishReviewResult {
  reviewId?: number | undefined;
  inlineCommentsCount: number;
  summaryFindingsCount: number;
  skippedDuplicatesCount: number;
  outdatedCommentsCount: number;
  reviewBody: string;
  isDryRun: boolean;
}

export function computeFindingMarker(finding: Finding): string {
  const normTitle = finding.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `<!-- acr-finding:${finding.file}:${finding.line}:${finding.category}:${finding.ruleId || normTitle} -->`;
}

export interface CommentFormattingContext {
  owner?: string | undefined;
  repo?: string | undefined;
  commitSha?: string | undefined;
}

export function formatInlineComment(
  finding: Finding,
  context?: CommentFormattingContext
): string {
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
    body += `💡 **Recommendation:**\n${finding.recommendation}\n\n`;
  }

  if (context?.owner && context?.repo && context?.commitSha) {
    const end =
      finding.endLine && finding.endLine > finding.line ? `-L${finding.endLine}` : "";
    const permalink = `https://github.com/${context.owner}/${context.repo}/blob/${context.commitSha}/${finding.file}#L${finding.line}${end}`;
    body += `🔗 [View in code context](${permalink})\n\n`;
  }

  body += `> 💬 *Reply with \`/dismiss [reason]\` or \`/accept\` to record review feedback.*\n`;

  return body;
}

export function generateReviewSummary(
  findings: Finding[],
  outsideDiffFindings: Finding[],
  coverage?: AnalysisCoverage | undefined
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
    summary += `✅ **No critical issues found.** This pull request passed all agentic review checks!\n\n`;
  } else {
    summary += `| Severity | Count |\n|---|:---:|\n`;
    summary += `| 🚨 Critical | ${counts.critical} |\n`;
    summary += `| ⚠️ High | ${counts.high} |\n`;
    summary += `| 🟡 Medium | ${counts.medium} |\n`;
    summary += `| ℹ️ Low | ${counts.low} |\n\n`;
  }

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

  if (coverage) {
    const statusEmoji =
      coverage.reviewStatus === "completed"
        ? "✅ Completed"
        : coverage.reviewStatus === "partial"
        ? "⚠️ Partial Analysis"
        : "❌ Failed";

    summary += `### 📊 Analysis Coverage\n`;
    summary += `- **Review Status:** ${statusEmoji}\n`;
    summary += `- **Files Analyzed:** ${coverage.analyzedFiles.length} of ${coverage.totalFiles} files\n`;
    summary += `- **Agents Executed:** ${coverage.successfulAgents.length} of ${coverage.totalAgents} successful\n`;
    summary += `- **Tokens Consumed:** ${coverage.tokenUsage.totalTokens.toLocaleString()} tokens\n`;

    if (coverage.reviewStatus === "partial") {
      summary += `\n> ⚠️ **Incomplete-analysis notice:** Some files or agents encountered budget or execution constraints.\n`;
    }

    if (coverage.costCapReached) {
      summary += `- ⚠️ *Notice:* Hard cost cap reached during analysis; execution stopped gracefully.\n`;
    }

    if (coverage.degradedAgents && coverage.degradedAgents.length > 0) {
      summary += `\n#### Degraded Agents:\n`;
      for (const d of coverage.degradedAgents) {
        summary += `- **${d.agent}**: ${d.error}\n`;
      }
    }
    summary += "\n";
  }

  summary += `*Generated automatically by RepoPilot Multi-Agent Reviewer. Reply \`/review\` to trigger a re-run.*`;
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
    coverage,
    dryRun = false,
  } = params;

  // 1. Fetch existing review comments if not provided to guarantee idempotency and track stale comments
  let existingItems: Array<{ id?: number; body?: string; path?: string; line?: number }> = [];
  if (existingComments) {
    existingItems = existingComments;
  } else {
    try {
      const { data } = await octokit.pulls.listReviewComments({
        owner,
        repo,
        pull_number: prNumber,
        per_page: 100,
      });
      existingItems = data;
    } catch {
      existingItems = [];
    }
  }

  const existingMarkers = new Set<string>();
  let outdatedCommentsCount = 0;

  for (const item of existingItems) {
    const body = item.body || "";
    const match = body.match(/<!--\s*acr-finding:[^>]+-->/);
    if (match) {
      existingMarkers.add(match[0]);

      // Check if this existing comment's line is no longer in current changedLines
      if (item.path && item.line && changedLinesByFile) {
        const currentFileLines = changedLinesByFile.get(item.path);
        if (!currentFileLines || !currentFileLines.has(item.line)) {
          outdatedCommentsCount++;
        }
      }
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

  // 3. Format inline comments with permalinks & feedback guidance
  const inlineComments = inlineCandidates.map((f) => ({
    path: f.file,
    line: f.line,
    body: formatInlineComment(f, { owner, repo, commitSha }),
  }));

  // 4. Construct overall review summary including coverage and warnings
  const summaryBody = generateReviewSummary(findings, outsideDiffFindings, coverage);

  // 5. Post review via Octokit unless in dryRun mode
  let reviewId: number | undefined;

  if (dryRun) {
    logger.info(
      {
        pr: prNumber,
        inlineCount: inlineComments.length,
        outsideCount: outsideDiffFindings.length,
        skippedDuplicates: skippedDuplicatesCount,
        dryRun: true,
      },
      "Dry-run review generated (no network post made)"
    );
  } else {
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
      logger.warn(
        { error: err instanceof Error ? err.message : String(err) },
        "Failed to create PR review"
      );
    }

    logger.info(
      {
        pr: prNumber,
        inlineCount: inlineComments.length,
        outsideCount: outsideDiffFindings.length,
        skippedDuplicates: skippedDuplicatesCount,
        outdatedCount: outdatedCommentsCount,
        reviewId,
      },
      "PR review published to GitHub"
    );
  }

  return {
    reviewId,
    inlineCommentsCount: inlineComments.length,
    summaryFindingsCount: outsideDiffFindings.length,
    skippedDuplicatesCount,
    outdatedCommentsCount,
    reviewBody: summaryBody,
    isDryRun: dryRun,
  };
}
