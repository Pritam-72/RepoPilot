import type { Finding } from "@acr/review-contracts";

export type BotCommandType = "dismiss" | "accept" | "review" | "ignore-rule";

export interface ParsedBotCommand {
  command: BotCommandType | null;
  arg?: string | undefined;
  raw: string;
}

export type FeedbackSentiment = "useful" | "incorrect" | "dismissed" | "accepted" | "ignored_rule";

/**
 * Parses developer feedback commands from GitHub comments (plan.md Phase 8).
 * Supports:
 * - `/dismiss [reason]`
 * - `/accept`
 * - `/review` or `/acr review`
 * - `/ignore-rule <ruleId>`
 */
export function parseCommentCommand(body: string): ParsedBotCommand {
  const trimmed = body.trim();
  const lower = trimmed.toLowerCase();

  // Match /dismiss [reason]
  const dismissMatch = trimmed.match(/(?:^|\n)\s*(?:\/|@(?:repopilot|acr)\s+)dismiss(?:\s+(.+))?/i);
  if (dismissMatch) {
    return {
      command: "dismiss",
      arg: dismissMatch[1]?.trim(),
      raw: trimmed,
    };
  }

  // Match /accept
  const acceptMatch = trimmed.match(/(?:^|\n)\s*(?:\/|@(?:repopilot|acr)\s+)accept(?:\s+(.+))?/i);
  if (acceptMatch) {
    return {
      command: "accept",
      arg: acceptMatch[1]?.trim(),
      raw: trimmed,
    };
  }

  // Match /ignore-rule <ruleId>
  const ignoreMatch = trimmed.match(/(?:^|\n)\s*(?:\/|@(?:repopilot|acr)\s+)ignore-rule(?:\s+([a-zA-Z0-9_\-.:]+))?/i);
  if (ignoreMatch) {
    return {
      command: "ignore-rule",
      arg: ignoreMatch[1]?.trim(),
      raw: trimmed,
    };
  }

  // Match /review or /acr review
  const reviewMatch = trimmed.match(/(?:^|\n)\s*(?:\/|@(?:repopilot|acr)\s+)(?:acr\s+)?review\b/i);
  if (reviewMatch) {
    return {
      command: "review",
      raw: trimmed,
    };
  }

  return {
    command: null,
    raw: trimmed,
  };
}

/**
 * Maps GitHub comment reaction content to a normalized feedback type.
 */
export function parseCommentReaction(reaction: string): FeedbackSentiment | null {
  const norm = reaction.trim().toLowerCase();
  switch (norm) {
    case "+1":
    case "thumbs_up":
    case "heart":
    case "rocket":
    case "hooray":
      return "useful";
    case "-1":
    case "thumbs_down":
    case "confused":
      return "incorrect";
    default:
      return null;
  }
}

export interface ParsedFindingMarker {
  marker: string;
  file: string;
  line: number;
  category: string;
  ruleId: string;
}

/**
 * Extracts the finding tracking marker embedded inside bot comments:
 * <!-- acr-finding:file:line:category:ruleId -->
 */
export function extractFindingMarkerFromComment(commentBody: string): ParsedFindingMarker | null {
  const match = commentBody.match(/<!--\s*acr-finding:([^:]+):(\d+):([^:]+):([^\s>]+)\s*-->/);
  if (!match) {
    return null;
  }

  return {
    marker: match[0],
    file: match[1]!,
    line: Number(match[2]),
    category: match[3]!,
    ruleId: match[4]!,
  };
}

/**
 * Suppresses findings that were previously dismissed by developers on this repository.
 * Matches on fingerprint or ruleId/file combinations.
 */
export function filterDismissedFindings(
  findings: Finding[],
  dismissedFingerprints: Set<string> | string[],
  dismissedRules: Set<string> | string[] = new Set()
): { active: Finding[]; suppressed: Finding[] } {
  const fpSet = dismissedFingerprints instanceof Set ? dismissedFingerprints : new Set(dismissedFingerprints);
  const ruleSet = dismissedRules instanceof Set ? dismissedRules : new Set(dismissedRules);

  const active: Finding[] = [];
  const suppressed: Finding[] = [];

  for (const finding of findings) {
    const normTitle = finding.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    const marker = `${finding.file}:${finding.line}:${finding.category}:${finding.ruleId || normTitle}`;

    if (
      fpSet.has(marker) ||
      (finding.ruleId && ruleSet.has(finding.ruleId))
    ) {
      suppressed.push(finding);
    } else {
      active.push(finding);
    }
  }

  return { active, suppressed };
}
