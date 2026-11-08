import type { AnalysisCoverage, ReviewStatus } from "@acr/review-contracts";
import type { TokenUsage } from "../llm-provider.js";

export interface BuildCoverageInput {
  allFiles: string[];
  analyzedFiles: string[];
  skippedFiles?: Array<{ path: string; reason: string }> | undefined;
  allAgents: string[];
  successfulAgents?: string[] | undefined;
  degradedAgents?: Array<{ agent: string; error: string }> | string[] | undefined;
  tokenUsage?: TokenUsage | undefined;
  costCapReached?: boolean | undefined;
}

/**
 * Builds the typed AnalysisCoverage record strictly complying with plan.md Phase 6.
 */
export function buildAnalysisCoverage(
  inputOrAllFiles: BuildCoverageInput | string[],
  analyzedFilesArg?: string[],
  allAgentsArg?: string[],
  degradedAgentsArg?: (string | { agent: string; error: string })[],
  costCapReachedArg?: boolean
): AnalysisCoverage {
  let allFiles: string[] = [];
  let analyzedFiles: string[] = [];
  let skippedFiles: Array<{ path: string; reason: string }> = [];
  let allAgents: string[] = [];
  let successfulAgents: string[] = [];
  let degradedAgents: Array<{ agent: string; error: string }> = [];
  let tokenUsage: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  let costCapReached = false;

  if (Array.isArray(inputOrAllFiles)) {
    allFiles = inputOrAllFiles;
    analyzedFiles = analyzedFilesArg ?? [];
    allAgents = allAgentsArg ?? [];
    const deg = degradedAgentsArg ?? [];
    degradedAgents = deg.map((d) => (typeof d === "string" ? { agent: d, error: d } : d));
    const degNames = new Set(degradedAgents.map((d) => d.agent));
    successfulAgents = allAgents.filter((a) => !degNames.has(a));
    costCapReached = costCapReachedArg ?? false;
  } else {
    allFiles = inputOrAllFiles.allFiles;
    analyzedFiles = inputOrAllFiles.analyzedFiles;
    skippedFiles = inputOrAllFiles.skippedFiles ?? [];
    allAgents = inputOrAllFiles.allAgents;
    const deg = inputOrAllFiles.degradedAgents ?? [];
    degradedAgents = deg.map((d) => (typeof d === "string" ? { agent: d, error: d } : d));
    const degNames = new Set(degradedAgents.map((d) => d.agent));
    successfulAgents =
      inputOrAllFiles.successfulAgents ?? allAgents.filter((a) => !degNames.has(a));
    tokenUsage = inputOrAllFiles.tokenUsage ?? { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
    costCapReached = inputOrAllFiles.costCapReached ?? false;
  }

  let reviewStatus: ReviewStatus = "completed";

  if (
    successfulAgents.length === 0 &&
    (degradedAgents.length > 0 || allAgents.length > 0)
  ) {
    reviewStatus = "failed";
  } else if (
    degradedAgents.length > 0 ||
    skippedFiles.length > 0 ||
    costCapReached ||
    successfulAgents.length < allAgents.length ||
    analyzedFiles.length < allFiles.length
  ) {
    reviewStatus = "partial";
  }

  const coveragePercentage =
    allFiles.length > 0 ? (analyzedFiles.length / allFiles.length) * 100 : 100;

  const notices: string[] = [];
  if (costCapReached) {
    notices.push("Cost cap limit reached; token budget exhausted during analysis.");
  }
  if (degradedAgents.length > 0) {
    notices.push(
      `Degraded agents: ${degradedAgents.map((d) => `${d.agent}: ${d.error}`).join("; ")}`
    );
  }
  if (skippedFiles.length > 0) {
    notices.push(`Skipped ${skippedFiles.length} file(s) due to context or size limits.`);
  }

  return {
    totalFiles: allFiles.length,
    analyzedFiles,
    skippedFiles,
    totalAgents: allAgents.length,
    successfulAgents,
    degradedAgents,
    reviewStatus,
    status: reviewStatus,
    coveragePercentage,
    notices,
    tokenUsage,
    costCapReached,
  };
}

/**
 * Formats the Markdown "Analysis Coverage" section for PR review publishing (plan.md line 447).
 */
export function formatAnalysisCoverageMarkdown(coverage: AnalysisCoverage): string {
  const statusEmoji =
    coverage.reviewStatus === "completed"
      ? "✅ **Completed**"
      : coverage.reviewStatus === "partial"
      ? "⚠️ **Partial Analysis**"
      : "❌ **Failed**";

  const lines: string[] = [
    `### Analysis Coverage`,
    `- **Review Status:** ${statusEmoji}`,
    `- **Files Analyzed:** ${coverage.analyzedFiles.length} of ${coverage.totalFiles} files (${(coverage.coveragePercentage ?? 100).toFixed(1)}%)`,
    `- **Agents Executed:** ${coverage.successfulAgents.length} of ${coverage.totalAgents} agents successful`,
    `- **Token Consumption:** ${coverage.tokenUsage.totalTokens.toLocaleString()} tokens`,
  ];

  if (coverage.reviewStatus === "partial") {
    lines.push(`\n> ⚠️ **Partial Analysis Warning:** Some agents or files could not be fully analyzed.`);
  }

  if (coverage.costCapReached) {
    lines.push(`- ⚠️ **Notice:** Cost cap limit reached; further analysis halted gracefully.`);
  }

  if (coverage.skippedFiles.length > 0) {
    lines.push(`\n#### Skipped Files:`);
    for (const f of coverage.skippedFiles) {
      lines.push(`- \`${f.path}\`: ${f.reason}`);
    }
  }

  if (coverage.degradedAgents.length > 0) {
    lines.push(`\n#### Degraded Agents:`);
    for (const d of coverage.degradedAgents) {
      lines.push(`- **${d.agent}**: ${d.error}`);
    }
  }

  return lines.join("\n");
}
