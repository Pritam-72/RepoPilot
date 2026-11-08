import { isIgnorableFile } from "./file-filter.js";
import { analyzeSourceCode, type EnclosingScope } from "./ast-parser.js";
import { SymbolIndex, type RelatedSymbol } from "./symbol-index.js";
import type { RepoFile } from "./search.js";
import { redactSecrets, estimateTokens } from "./context-builder.js";

export interface ChangedRange {
  startLine: number;
  endLine: number;
  type: "added" | "modified" | "deleted";
}

export interface EnclosingSymbol {
  name: string;
  kind: "function" | "class" | "method" | "unknown";
  startLine: number;
  endLine: number;
  signature?: string | undefined;
}

/**
 * The core review unit delivered to review agents (plan.md Section 9 Phase 2).
 */
export interface ReviewUnit {
  file: string;
  changedRanges: ChangedRange[];
  enclosingSymbol?: EnclosingSymbol | undefined;
  surroundingCode: string;
  relatedSymbols: RelatedSymbol[];
  tokenEstimate: number;
  isPartial?: boolean | undefined;
  language: string;
}

export interface ChunkerFile {
  path: string;
  content: string;
  changedRanges: ChangedRange[];
  patch?: string;
}

export interface ChunkerOptions {
  maxTokensPerUnit?: number;
  repoFiles?: RepoFile[];
}

// Default token budget per review unit (reserving room for prompt and generation)
export const DEFAULT_MAX_TOKENS_PER_UNIT = 2_500;

/**
 * Splits oversized code into statement- or line-bounded chunks
 * when exceeding the token budget.
 */
function splitOversizedContent(
  content: string = "",
  maxChars: number
): { parts: string[]; isPartial: boolean } {
  if (!content || content.length <= maxChars) {
    return { parts: [content ?? ""], isPartial: false };
  }

  const lines = content.split("\n");
  const parts: string[] = [];
  let current: string[] = [];
  let currentLen = 0;

  for (const line of lines) {
    if (currentLen + line.length > maxChars && current.length > 0) {
      parts.push(current.join("\n"));
      current = [line];
      currentLen = line.length;
    } else {
      current.push(line);
      currentLen += line.length + 1;
    }
  }

  if (current.length > 0) {
    parts.push(current.join("\n"));
  }

  return { parts, isPartial: true };
}

/**
 * Re-chunks an oversized unit when LLM context overflow or memory pressure is detected (plan.md Phase 6).
 */
export function rechunkOnContextOverflow(
  unitOrUnits: any | any[],
  targetTokenBudget = 1000
): any[] {
  const units: any[] = Array.isArray(unitOrUnits) ? unitOrUnits : [unitOrUnits];
  const maxChars = targetTokenBudget * 4;
  const result: any[] = [];

  for (const unit of units) {
    if (Array.isArray(unit.files)) {
      let currentFiles: any[] = [];
      let currentTokens = 0;
      let chunkIdx = 1;

      for (const file of unit.files) {
        const fileTokens =
          file.tokenCount ?? estimateTokens(file.diff ?? file.content ?? "");
        if (fileTokens > targetTokenBudget && (file.diff || file.content)) {
          const content = file.diff ?? file.content ?? "";
          const { parts } = splitOversizedContent(content, maxChars);
          for (let pIdx = 0; pIdx < parts.length; pIdx++) {
            result.push({
              ...unit,
              id: `${unit.id ?? "unit"}-chunk-${chunkIdx++}`,
              files: [
                {
                  ...file,
                  ...(file.diff !== undefined ? { diff: parts[pIdx] } : {}),
                  ...(file.content !== undefined ? { content: parts[pIdx] } : {}),
                  tokenCount: estimateTokens(parts[pIdx]!),
                },
              ],
              totalTokens: estimateTokens(parts[pIdx]!),
              isPartial: true,
            });
          }
        } else if (currentTokens + fileTokens > targetTokenBudget && currentFiles.length > 0) {
          result.push({
            ...unit,
            id: `${unit.id ?? "unit"}-chunk-${chunkIdx++}`,
            files: currentFiles,
            totalTokens: currentTokens,
          });
          currentFiles = [file];
          currentTokens = fileTokens;
        } else {
          currentFiles.push(file);
          currentTokens += fileTokens;
        }
      }

      if (currentFiles.length > 0) {
        result.push({
          ...unit,
          id: `${unit.id ?? "unit"}-chunk-${chunkIdx++}`,
          files: currentFiles,
          totalTokens: currentTokens,
        });
      }
    } else {
      const code = unit.surroundingCode ?? "";
      const { parts } = splitOversizedContent(code, maxChars);
      for (const part of parts) {
        result.push({
          ...unit,
          surroundingCode: part,
          tokenEstimate: estimateTokens(part),
          isPartial: true,
        });
      }
    }
  }

  return result;
}

/**
 * Builds context-rich ReviewUnits from changed files, diff ranges, and repository context.
 * Adheres strictly to token budgets and never splits a function unless it exceeds the budget.
 */
export function buildReviewUnits(
  files: ChunkerFile[],
  options: ChunkerOptions = {}
): ReviewUnit[] {
  const maxTokens = options.maxTokensPerUnit ?? DEFAULT_MAX_TOKENS_PER_UNIT;
  const maxCharsPerUnit = maxTokens * 4;
  const repoFiles = options.repoFiles ?? [];
  const symbolIndex = new SymbolIndex(repoFiles);
  const units: ReviewUnit[] = [];

  for (const file of files) {
    // 1. Skip ignorable files (lockfiles, generated, minified, binaries)
    if (isIgnorableFile(file.path)) {
      continue;
    }

    if (file.changedRanges.length === 0) {
      continue;
    }

    const ast = analyzeSourceCode(file.path, file.content);
    const isSupportedLanguage = ast.language !== "unknown";

    // Group changed lines
    const changedLineNumbers = new Set<number>();
    for (const range of file.changedRanges) {
      for (let l = range.startLine; l <= range.endLine; l++) {
        changedLineNumbers.add(l);
      }
    }

    if (!isSupportedLanguage) {
      // Graceful fallback for unsupported languages: whole hunk with context
      const fileLines = file.content.split("\n");
      const sanitized = redactSecrets(file.content);
      const { parts, isPartial } = splitOversizedContent(sanitized, maxCharsPerUnit);

      for (const part of parts) {
        units.push({
          file: file.path,
          changedRanges: file.changedRanges,
          enclosingSymbol: undefined,
          surroundingCode: part,
          relatedSymbols: [],
          tokenEstimate: estimateTokens(part),
          isPartial: isPartial ? true : undefined,
          language: "unsupported",
        });
      }
      continue;
    }

    // 2. Identify enclosing scopes for changed lines
    const processedScopes = new Set<EnclosingScope>();
    const uncoveredLines = new Set<number>(changedLineNumbers);

    for (const scope of ast.scopes) {
      // Check if this scope covers any changed lines
      const coversChangedLine = Array.from(changedLineNumbers).some(
        (l) => l >= scope.startLine && l <= scope.endLine
      );

      if (coversChangedLine) {
        processedScopes.add(scope);
        for (let l = scope.startLine; l <= scope.endLine; l++) {
          uncoveredLines.delete(l);
        }

        const sanitizedScopeContent = redactSecrets(scope.content);
        const relatedSymbols = symbolIndex.findRelatedSymbols([scope.name]);
        const scopeTokens = estimateTokens(sanitizedScopeContent);

        if (scopeTokens <= maxTokens) {
          // Function fits within budget: NEVER split
          units.push({
            file: file.path,
            changedRanges: file.changedRanges.filter(
              (r) => r.startLine <= scope.endLine && r.endLine >= scope.startLine
            ),
            enclosingSymbol: {
              name: scope.name,
              kind: scope.kind,
              startLine: scope.startLine,
              endLine: scope.endLine,
              signature: scope.signature,
            },
            surroundingCode: sanitizedScopeContent,
            relatedSymbols,
            tokenEstimate: scopeTokens,
            isPartial: false,
            language: ast.language,
          });
        } else {
          // Oversized function: split on statement/line boundaries and mark partial
          const { parts } = splitOversizedContent(sanitizedScopeContent, maxCharsPerUnit);
          for (const part of parts) {
            units.push({
              file: file.path,
              changedRanges: file.changedRanges.filter(
                (r) => r.startLine <= scope.endLine && r.endLine >= scope.startLine
              ),
              enclosingSymbol: {
                name: scope.name,
                kind: scope.kind,
                startLine: scope.startLine,
                endLine: scope.endLine,
                signature: scope.signature,
              },
              surroundingCode: part,
              relatedSymbols,
              tokenEstimate: estimateTokens(part),
              isPartial: true,
              language: ast.language,
            });
          }
        }
      }
    }

    // 3. For any changes outside functions/classes (e.g. top-level statements/imports)
    if (uncoveredLines.size > 0) {
      const fileLines = file.content.split("\n");
      const minLine = Math.max(1, Math.min(...Array.from(uncoveredLines)) - 5);
      const maxLine = Math.min(fileLines.length, Math.max(...Array.from(uncoveredLines)) + 5);
      const windowContent = redactSecrets(fileLines.slice(minLine - 1, maxLine).join("\n"));

      const { parts, isPartial } = splitOversizedContent(windowContent, maxCharsPerUnit);
      for (const part of parts) {
        units.push({
          file: file.path,
          changedRanges: file.changedRanges.filter(
            (r) => r.startLine <= maxLine && r.endLine >= minLine
          ),
          enclosingSymbol: undefined,
          surroundingCode: part,
          relatedSymbols: [],
          tokenEstimate: estimateTokens(part),
          isPartial: isPartial ? true : undefined,
          language: ast.language,
        });
      }
    }
  }

  return units;
}
