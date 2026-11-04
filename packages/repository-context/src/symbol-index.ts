import type { RepoFile } from "./search.js";

export interface RelatedSymbol {
  name: string;
  file: string;
  line: number;
  kind: "definition" | "caller" | "import" | "reference";
  snippet: string;
}

export interface SymbolIndexOptions {
  maxDepth?: number;
  maxSymbolsPerQuery?: number;
}

/**
 * Lightweight symbol index that builds caller/callee and import relationships
 * for changed symbols with bounded depth (PRD & plan.md Phase 2).
 */
export class SymbolIndex {
  private files: RepoFile[];

  constructor(files: RepoFile[]) {
    this.files = files;
  }

  /**
   * Finds related symbol definitions, imports, and caller references
   * for a given list of symbol names.
   */
  public findRelatedSymbols(
    symbolNames: string[],
    options: SymbolIndexOptions = {}
  ): RelatedSymbol[] {
    const maxDepth = options.maxDepth ?? 1;
    const maxLimit = options.maxSymbolsPerQuery ?? 10;
    const results: RelatedSymbol[] = [];
    const seen = new Set<string>();

    const candidateSymbols = Array.from(
      new Set(symbolNames.filter((s) => s.length >= 3 && !/^[0-9]/.test(s)))
    );

    if (candidateSymbols.length === 0) return results;

    for (const sym of candidateSymbols) {
      if (results.length >= maxLimit) break;

      // 1. Find Definitions across repository files
      for (const file of this.files) {
        if (results.length >= maxLimit) break;

        const lines = file.content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]!;
          const defRegex = new RegExp(
            `\\b(export\\s+)?(default\\s+)?(class|function|const|let|var|interface|type|def|async\\s+def)\\s+${sym}\\b`
          );

          if (defRegex.test(line)) {
            const key = `def:${file.path}:${i + 1}`;
            if (!seen.has(key)) {
              seen.add(key);
              const snippet = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 6)).join("\n");
              results.push({
                name: sym,
                file: file.path,
                line: i + 1,
                kind: "definition",
                snippet,
              });
            }
          }
        }
      }

      // 2. Find Callers / Invocations (depth = 1)
      if (maxDepth >= 1) {
        for (const file of this.files) {
          if (results.length >= maxLimit) break;

          const lines = file.content.split("\n");
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i]!;
            const callRegex = new RegExp(`\\b${sym}\\s*\\(`);
            // Skip the declaration line itself
            const isDecl = /\b(function|def|class)\b/.test(line);

            if (callRegex.test(line) && !isDecl) {
              const key = `call:${file.path}:${i + 1}`;
              if (!seen.has(key)) {
                seen.add(key);
                const snippet = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 3)).join("\n");
                results.push({
                  name: sym,
                  file: file.path,
                  line: i + 1,
                  kind: "caller",
                  snippet,
                });
              }
            }
          }
        }
      }

      // 3. Find Imports
      for (const file of this.files) {
        if (results.length >= maxLimit) break;

        const lines = file.content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]!;
          if ((line.includes("import") || line.includes("require")) && line.includes(sym)) {
            const key = `imp:${file.path}:${i + 1}`;
            if (!seen.has(key)) {
              seen.add(key);
              results.push({
                name: sym,
                file: file.path,
                line: i + 1,
                kind: "import",
                snippet: line.trim(),
              });
            }
          }
        }
      }
    }

    return results;
  }
}
