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
  content: string;
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

export function parseScopes(filePath: string, sourceCode: string): EnclosingScope[] {
  const lang = detectLanguage(filePath);
  const parser = getParserForLanguage(lang);
  if (!parser) return [];

  const tree = parser.parse(sourceCode);
  const scopes: EnclosingScope[] = [];
  const lines = sourceCode.split("\n");

  function extractNodeContent(startRow: number, endRow: number): string {
    return lines.slice(startRow, endRow + 1).join("\n");
  }

  function traverse(node: Parser.SyntaxNode) {
    const type = node.type;
    let kind: EnclosingScope["kind"] | null = null;
    let name = "anonymous";

    if (type === "function_declaration" || type === "function_definition") {
      kind = "function";
      const nameNode = node.childForFieldName("name") || node.children.find((c) => c.type === "identifier");
      if (nameNode) name = nameNode.text;
    } else if (type === "class_declaration" || type === "class_definition") {
      kind = "class";
      const nameNode = node.childForFieldName("name") || node.children.find((c) => c.type === "type_identifier" || c.type === "identifier");
      if (nameNode) name = nameNode.text;
    } else if (type === "method_definition") {
      kind = "method";
      const nameNode = node.childForFieldName("name") || node.children.find((c) => c.type === "property_identifier" || c.type === "identifier");
      if (nameNode) name = nameNode.text;
    }

    if (kind) {
      scopes.push({
        name,
        kind,
        startLine: node.startPosition.row + 1,
        endLine: node.endPosition.row + 1,
        content: extractNodeContent(node.startPosition.row, node.endPosition.row),
      });
    }

    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child) traverse(child);
    }
  }

  traverse(tree.rootNode);
  return scopes;
}

export function getEnclosingScopesForLines(
  filePath: string,
  sourceCode: string,
  targetLines: Set<number>
): EnclosingScope[] {
  const allScopes = parseScopes(filePath, sourceCode);
  const matchedScopes = new Set<EnclosingScope>();

  for (const line of targetLines) {
    // Find innermost or enclosing scopes containing this line
    for (const scope of allScopes) {
      if (line >= scope.startLine && line <= scope.endLine) {
        matchedScopes.add(scope);
      }
    }
  }

  return Array.from(matchedScopes).sort((a, b) => a.startLine - b.startLine);
}
