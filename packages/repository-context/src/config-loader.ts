import { z } from "zod";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export const RepoConfigSchema = z.object({
  version: z.union([z.literal(1), z.literal("1")]).default(1),
  conventions: z.array(z.string().min(1)).default([]),
  confidenceThreshold: z.number().min(0).max(1).optional(),
  disabledAgents: z.array(z.enum(["bug", "security", "quality", "performance", "dependency"])).default([]),
  ignorePaths: z.array(z.string().min(1)).default([]),
  bannedPatterns: z.array(
    z.object({
      pattern: z.string().min(1),
      message: z.string().min(1),
      severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
    })
  ).default([]),
});

export type RepoConfig = z.infer<typeof RepoConfigSchema>;

export const DEFAULT_REPO_CONFIG: RepoConfig = {
  version: 1,
  conventions: [],
  disabledAgents: [],
  ignorePaths: [],
  bannedPatterns: [],
};

/**
 * Parses raw JSON string into a validated RepoConfig.
 */
export function parseRepoConfig(rawJson: string): RepoConfig {
  try {
    const parsed = JSON.parse(rawJson);
    return RepoConfigSchema.parse(parsed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid repo configuration: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`);
    }
    throw new Error(`Failed to parse repo config JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Locates and loads repo configuration file from directory (.repopilot.json or .acr.json).
 * If neither is present, returns default configuration.
 */
export async function loadRepoConfig(repoRoot: string): Promise<RepoConfig> {
  const candidateFiles = [".repopilot.json", ".acr.json"];

  for (const filename of candidateFiles) {
    const fullPath = path.join(repoRoot, filename);
    try {
      const content = await fs.readFile(fullPath, "utf-8");
      return parseRepoConfig(content);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "ENOENT") {
        continue;
      }
      throw err;
    }
  }

  return DEFAULT_REPO_CONFIG;
}

/**
 * Formats user conventions and banned patterns into a markdown snippet
 * suitable for inclusion in LLM system prompts.
 */
export function formatConventionsForPrompt(config: RepoConfig): string {
  const sections: string[] = [];

  if (config.conventions.length > 0) {
    sections.push("### Repository-Specific Coding Conventions:\n" + config.conventions.map((c) => `- ${c}`).join("\n"));
  }

  if (config.bannedPatterns.length > 0) {
    sections.push(
      "### Banned Code Patterns (flag if present):\n" +
        config.bannedPatterns.map((b) => `- Pattern: \`${b.pattern}\` (Severity: ${b.severity}) — Reason: ${b.message}`).join("\n")
    );
  }

  return sections.join("\n\n");
}

/**
 * Checks whether a given relative file path matches any glob / ignore prefix in config.ignorePaths.
 */
export function shouldIgnoreFile(filePath: string, ignorePaths: string[]): boolean {
  if (ignorePaths.length === 0) return false;

  const normalized = filePath.replace(/\\/g, "/");

  for (const pattern of ignorePaths) {
    const cleanPattern = pattern.replace(/\\/g, "/");

    // Exact match
    if (normalized === cleanPattern) return true;

    // Directory prefix: e.g. "docs/**" or "vendor/"
    if (cleanPattern.endsWith("/**")) {
      const prefix = cleanPattern.slice(0, -3);
      if (normalized.startsWith(prefix) || normalized.startsWith(prefix.replace(/\/$/, ""))) return true;
    } else if (cleanPattern.endsWith("/")) {
      if (normalized.startsWith(cleanPattern)) return true;
    }

    // Extension pattern: e.g. "**/*.test.ts" or "*.min.js"
    if (cleanPattern.startsWith("**/*.")) {
      const ext = cleanPattern.slice(4); // e.g. ".test.ts"
      if (normalized.endsWith(ext)) return true;
    } else if (cleanPattern.startsWith("*.")) {
      const ext = cleanPattern.slice(1);
      if (normalized.endsWith(ext)) return true;
    }

    // Substring match for basic paths
    if (normalized.startsWith(cleanPattern)) return true;
  }

  return false;
}
