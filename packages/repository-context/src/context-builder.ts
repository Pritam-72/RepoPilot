import { getEnclosingScopesForLines } from "./ast-parser.js";
import { findSymbolDefinitions, extractReferencedSymbols, type RepoFile } from "./search.js";

export interface ContextChunk {
  path: string;
  startLine: number;
  endLine: number;
  content: string;
  sha: string;
}

export interface ContextBuilderOptions {
  maxTokens?: number;
  headSha: string;
  repoFiles?: RepoFile[];
}

export function redactSecrets(text: string): string {
  let sanitized = text;

  // 1. Replace assignment-style secrets (keep key name, replace secret value)
  const assignmentPattern =
    /(?:api[_-]?key|secret(?:Key)?|password|bearer|auth[_-]?token)\s*[:=]\s*["']([^"'\s]{8,})["']/gi;
  sanitized = sanitized.replace(assignmentPattern, (match, val: string) => {
    return match.replace(val, "[REDACTED_SECRET]");
  });

  // 2. Replace well-known direct secret formats
  const directPatterns = [
    /-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/g,
    /ghp_[A-Za-z0-9_]{20,}/g,
    /github_pat_[A-Za-z0-9_]{40,}/g,
    /sk-[A-Za-z0-9_-]{20,}/g,
    /AKIA[0-9A-Z]{16}/g,
  ];

  for (const p of directPatterns) {
    sanitized = sanitized.replace(p, "[REDACTED_SECRET]");
  }

  return sanitized;
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export interface ChangedFileWithLines {
  path: string;
  content: string;
  changedLines: Set<number>;
  patch?: string;
}

export function buildRepositoryContext(
  changedFiles: ChangedFileWithLines[],
  opts: ContextBuilderOptions
): ContextChunk[] {
  const { maxTokens = 30_000, headSha, repoFiles = [] } = opts;
  const chunks: ContextChunk[] = [];
  let currentTokenCount = 0;

  // 1. First priority: Enclosing scopes from AST parser for changed files
  for (const file of changedFiles) {
    if (currentTokenCount >= maxTokens) break;

    const scopes = getEnclosingScopesForLines(file.path, file.content, file.changedLines);
    for (const scope of scopes) {
      const sanitizedContent = redactSecrets(scope.content);
      const chunkTokens = estimateTokens(sanitizedContent);

      if (currentTokenCount + chunkTokens > maxTokens) {
        // If adding exceeds budget, truncate content to fit
        const remainingChars = (maxTokens - currentTokenCount) * 4;
        if (remainingChars > 100) {
          chunks.push({
            path: file.path,
            startLine: scope.startLine,
            endLine: scope.endLine,
            content: sanitizedContent.slice(0, remainingChars) + "\n// ... [Context truncated due to budget limit]",
            sha: headSha,
          });
        }
        currentTokenCount = maxTokens;
        break;
      }

      chunks.push({
        path: file.path,
        startLine: scope.startLine,
        endLine: scope.endLine,
        content: sanitizedContent,
        sha: headSha,
      });
      currentTokenCount += chunkTokens;
    }
  }

  // 2. Second priority: Referenced external symbols from repo files
  if (currentTokenCount < maxTokens && repoFiles.length > 0) {
    const allPatches = changedFiles.map((f) => f.patch || "").join("\n");
    const referencedSymbols = extractReferencedSymbols(allPatches);
    const definitions = findSymbolDefinitions(referencedSymbols, repoFiles);

    for (const def of definitions) {
      if (currentTokenCount >= maxTokens) break;

      // Avoid duplicating chunks from changedFiles already captured
      const alreadyIncluded = chunks.some(
        (c) => c.path === def.path && c.startLine <= def.startLine && c.endLine >= def.endLine
      );
      if (alreadyIncluded) continue;

      const sanitizedContent = redactSecrets(def.content);
      const chunkTokens = estimateTokens(sanitizedContent);

      if (currentTokenCount + chunkTokens > maxTokens) break;

      chunks.push({
        path: def.path,
        startLine: def.startLine,
        endLine: def.endLine,
        content: sanitizedContent,
        sha: headSha,
      });
      currentTokenCount += chunkTokens;
    }
  }

  return chunks;
}
