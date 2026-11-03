export interface SymbolMatch {
  path: string;
  symbol: string;
  startLine: number;
  endLine: number;
  content: string;
}

export interface RepoFile {
  path: string;
  content: string;
}

/**
 * Searches repository files for symbol definitions (functions, classes, interfaces, types).
 */
export function findSymbolDefinitions(
  symbols: string[],
  files: RepoFile[]
): SymbolMatch[] {
  const matches: SymbolMatch[] = [];
  const symbolSet = new Set(symbols.filter((s) => s.length > 2));
  if (symbolSet.size === 0) return matches;

  for (const file of files) {
    const lines = file.content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      for (const sym of symbolSet) {
        // Regex checking for export or declaration of symbol
        const defRegex = new RegExp(
          `\\b(export\\s+)?(default\\s+)?(class|function|const|let|var|interface|type|def|async\\s+def)\\s+${sym}\\b`
        );
        if (defRegex.test(line)) {
          // Capture a small window of 5-15 lines as context
          const startLine = Math.max(1, i + 1);
          const endLine = Math.min(lines.length, i + 15);
          matches.push({
            path: file.path,
            symbol: sym,
            startLine,
            endLine,
            content: lines.slice(startLine - 1, endLine).join("\n"),
          });
          break;
        }
      }
    }
  }

  return matches;
}

/**
 * Extracts referenced identifiers from changed diff lines.
 */
export function extractReferencedSymbols(diffContent: string): string[] {
  const words = diffContent.match(/\b[A-Za-z_][A-Za-z0-9_]{2,}\b/g) || [];
  const reservedKeywords = new Set([
    "const", "let", "var", "function", "return", "import", "export",
    "class", "from", "default", "true", "false", "null", "undefined",
    "async", "await", "if", "else", "for", "while", "switch", "case",
    "def", "self", "None", "True", "False", "class", "print",
  ]);

  const unique = new Set<string>();
  for (const w of words) {
    if (!reservedKeywords.has(w)) {
      unique.add(w);
    }
  }
  return Array.from(unique);
}

