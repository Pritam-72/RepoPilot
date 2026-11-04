import { createHash } from "node:crypto";
import Parser from "tree-sitter";
import TypeScriptPkg from "tree-sitter-typescript";
import PythonPkg from "tree-sitter-python";
import { detectLanguage, type SupportedLanguage } from "./language-detector.js";

const typescript = (TypeScriptPkg as { typescript?: unknown; default?: { typescript: unknown } })?.typescript ||
  (TypeScriptPkg as { default?: { typescript: unknown } })?.default?.typescript || TypeScriptPkg;
const tsx = (TypeScriptPkg as { tsx?: unknown; default?: { tsx: unknown } })?.tsx ||
  (TypeScriptPkg as { default?: { tsx: unknown } })?.default?.tsx;
const python = (PythonPkg as { default?: unknown }).default || PythonPkg;

export interface EnclosingScope {
  name: string;
  kind: "function" | "class" | "method" | "unknown";
  startLine: number;
  endLine: number;
  signature?: string | undefined;
  content: string;
}

export interface ImportSymbol {
  source: string;
  symbols: string[];
  isDefault?: boolean | undefined;
  line: number;
}

export interface ExportedSymbol {
  name: string;
  kind: "function" | "class" | "variable" | "type" | "unknown";
  line: number;
  signature?: string | undefined;
}

export interface ParsedAstAnalysis {
  scopes: EnclosingScope[];
  imports: ImportSymbol[];
  exports: ExportedSymbol[];
  language: SupportedLanguage;
}

// In-memory AST cache keyed by content hash
const astCache = new Map<string, ParsedAstAnalysis>();

export function clearAstCache(): void {
  astCache.clear();
}

export function getAstCacheSize(): number {
  return astCache.size;
}

function computeContentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

function getParserForLanguage(lang: SupportedLanguage): Parser | null {
  if (lang === "unknown") return null;

  const parser = new Parser();
  try {
    if (lang === "typescript") {
      // @ts-expect-error Tree-sitter language object
      parser.setLanguage(typescript);
    } else if (lang === "tsx" || lang === "javascript") {
      // @ts-expect-error Tree-sitter language object
      parser.setLanguage(tsx || typescript);
    } else if (lang === "python") {
      // @ts-expect-error Tree-sitter language object
      parser.setLanguage(python);
    } else {
      return null;
    }
    return parser;
  } catch {
    return null;
  }
}

/**
 * Parses source code into scopes, imports, and exports using Tree-sitter.
 * Results are cached in memory by content hash.
 */
export function analyzeSourceCode(filePath: string, sourceCode: string): ParsedAstAnalysis {
  if (!sourceCode || sourceCode.trim() === "") {
    return { scopes: [], imports: [], exports: [], language: "unknown" };
  }

  const lang = detectLanguage(filePath);
  const cacheKey = `${lang}:${computeContentHash(sourceCode)}`;
  const cached = astCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const parser = getParserForLanguage(lang);
  if (!parser) {
    // Unsupported language fallback
    const result: ParsedAstAnalysis = {
      scopes: [],
      imports: [],
      exports: [],
      language: "unknown",
    };
    astCache.set(cacheKey, result);
    return result;
  }

  const tree = parser.parse(sourceCode);
  const scopes: EnclosingScope[] = [];
  const imports: ImportSymbol[] = [];
  const exportsList: ExportedSymbol[] = [];
  const lines = sourceCode.split("\n");

  function extractNodeContent(startRow: number, endRow: number): string {
    return lines.slice(startRow, endRow + 1).join("\n");
  }

  function extractSignature(node: Parser.SyntaxNode): string | undefined {
    const paramsNode = node.childForFieldName("parameters");
    const returnTypeNode = node.childForFieldName("return_type");
    if (!paramsNode) return undefined;

    let sig = paramsNode.text;
    if (returnTypeNode) {
      sig += `: ${returnTypeNode.text}`;
    }
    return sig;
  }

  function traverse(node: Parser.SyntaxNode) {
    const type = node.type;

    // --- SCOPES ---
    let kind: EnclosingScope["kind"] | null = null;
    let name = "anonymous";
    let signature: string | undefined;

    if (type === "function_declaration" || type === "function_definition") {
      kind = "function";
      const nameNode = node.childForFieldName("name") || node.children.find((c) => c.type === "identifier");
      if (nameNode) name = nameNode.text;
      signature = extractSignature(node);
    } else if (type === "class_declaration" || type === "class_definition") {
      kind = "class";
      const nameNode = node.childForFieldName("name") || node.children.find((c) => c.type === "type_identifier" || c.type === "identifier");
      if (nameNode) name = nameNode.text;
    } else if (type === "method_definition") {
      kind = "method";
      const nameNode = node.childForFieldName("name") || node.children.find((c) => c.type === "property_identifier" || c.type === "identifier");
      if (nameNode) name = nameNode.text;
      signature = extractSignature(node);
    }

    if (kind) {
      scopes.push({
        name,
        kind,
        startLine: node.startPosition.row + 1,
        endLine: node.endPosition.row + 1,
        signature,
        content: extractNodeContent(node.startPosition.row, node.endPosition.row),
      });
    }

    // --- IMPORTS ---
    if (type === "import_statement") {
      // TypeScript: import ... from '...'
      const sourceNode = node.childForFieldName("source");
      const symbols: string[] = [];
      for (const child of node.children) {
        if (child.type === "import_clause") {
          for (const sub of child.children) {
            if (sub.type === "named_imports") {
              for (const spec of sub.children) {
                if (spec.type === "import_specifier") {
                  symbols.push(spec.childForFieldName("name")?.text || spec.text);
                }
              }
            } else if (sub.type === "identifier") {
              symbols.push(sub.text);
            }
          }
        }
      }
      imports.push({
        source: sourceNode ? sourceNode.text.replace(/['"]/g, "") : "",
        symbols: symbols.length > 0 ? symbols : [node.text],
        line: node.startPosition.row + 1,
      });
    } else if (type === "import_from_statement") {
      // Python: from x import y
      const moduleNode = node.childForFieldName("module_name");
      const symbols: string[] = [];
      for (const child of node.children) {
        if (child.type === "dotted_name" && child !== moduleNode) {
          symbols.push(child.text);
        } else if (child.type === "identifier") {
          symbols.push(child.text);
        }
      }
      imports.push({
        source: moduleNode ? moduleNode.text : "",
        symbols,
        line: node.startPosition.row + 1,
      });
    }

    // --- EXPORTS ---
    if (type === "export_statement") {
      const decl = node.childForFieldName("declaration");
      if (decl) {
        const declName = decl.childForFieldName("name")?.text || "exported";
        let expKind: ExportedSymbol["kind"] = "unknown";
        if (decl.type.includes("function")) expKind = "function";
        else if (decl.type.includes("class")) expKind = "class";
        else if (decl.type.includes("variable") || decl.type.includes("lexical")) expKind = "variable";

        exportsList.push({
          name: declName,
          kind: expKind,
          line: node.startPosition.row + 1,
          signature: extractSignature(decl),
        });
      }
    }

    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child) traverse(child);
    }
  }

  traverse(tree.rootNode);

  const result: ParsedAstAnalysis = {
    scopes,
    imports,
    exports: exportsList,
    language: lang,
  };

  astCache.set(cacheKey, result);
  return result;
}

export function parseScopes(filePath: string, sourceCode: string): EnclosingScope[] {
  return analyzeSourceCode(filePath, sourceCode).scopes;
}

export function getEnclosingScopesForLines(
  filePath: string,
  sourceCode: string,
  targetLines: Set<number>
): EnclosingScope[] {
  const analysis = analyzeSourceCode(filePath, sourceCode);
  const matchedScopes = new Set<EnclosingScope>();

  for (const line of targetLines) {
    for (const scope of analysis.scopes) {
      if (line >= scope.startLine && line <= scope.endLine) {
        matchedScopes.add(scope);
      }
    }
  }

  return Array.from(matchedScopes).sort((a, b) => a.startLine - b.startLine);
}
