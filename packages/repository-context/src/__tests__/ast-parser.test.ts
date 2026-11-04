import { describe, it, expect, beforeEach } from "vitest";
import { detectLanguage } from "../language-detector.js";
import {
  parseScopes,
  getEnclosingScopesForLines,
  analyzeSourceCode,
  clearAstCache,
  getAstCacheSize,
} from "../ast-parser.js";

describe("detectLanguage", () => {
  it("detects typescript, python, and unknown languages", () => {
    expect(detectLanguage("src/app.ts")).toBe("typescript");
    expect(detectLanguage("src/Component.tsx")).toBe("tsx");
    expect(detectLanguage("script.py")).toBe("python");
    expect(detectLanguage("main.go")).toBe("unknown");
  });
});

describe("AST Scopes & Symbol Extraction", () => {
  beforeEach(() => {
    clearAstCache();
  });

  const tsCode = `
import { format } from "date-fns";

export class Calculator {
  add(a: number, b: number): number {
    const sum = a + b;
    return sum;
  }
}

export function computeTotal(items: number[]): number {
  return items.reduce((acc, x) => acc + x, 0);
}
`;

  const pyCode = `
from typing import List

class UserService:
    def get_user(self, user_id: int):
        return {"id": user_id}

def calculate_discount(price: float) -> float:
    return price * 0.9
`;

  it("extracts classes, methods, signatures, imports, and exports from TypeScript", () => {
    const analysis = analyzeSourceCode("calc.ts", tsCode);
    expect(analysis.language).toBe("typescript");

    const scopeNames = analysis.scopes.map((s) => s.name);
    expect(scopeNames).toContain("Calculator");
    expect(scopeNames).toContain("add");
    expect(scopeNames).toContain("computeTotal");

    // Signatures
    const addScope = analysis.scopes.find((s) => s.name === "add");
    expect(addScope?.signature).toContain("a: number, b: number");

    // Imports
    expect(analysis.imports.length).toBeGreaterThan(0);
    expect(analysis.imports[0]?.source).toBe("date-fns");

    // Exports
    const exportNames = analysis.exports.map((e) => e.name);
    expect(exportNames).toContain("Calculator");
    expect(exportNames).toContain("computeTotal");
  });

  it("extracts classes, functions, and imports from Python", () => {
    const analysis = analyzeSourceCode("service.py", pyCode);
    expect(analysis.language).toBe("python");

    const scopeNames = analysis.scopes.map((s) => s.name);
    expect(scopeNames).toContain("UserService");
    expect(scopeNames).toContain("get_user");
    expect(scopeNames).toContain("calculate_discount");

    const discScope = analysis.scopes.find((s) => s.name === "calculate_discount");
    expect(discScope?.kind).toBe("function");

    expect(analysis.imports.length).toBeGreaterThan(0);
    expect(analysis.imports[0]?.source).toBe("typing");
  });

  it("locates enclosing scopes for modified line numbers", () => {
    const scopes = getEnclosingScopesForLines("calc.ts", tsCode, new Set([6]));
    const names = scopes.map((s) => s.name);

    expect(names).toContain("Calculator");
    expect(names).toContain("add");
    expect(names).not.toContain("computeTotal");
  });

  it("caches AST parse results across calls", () => {
    expect(getAstCacheSize()).toBe(0);
    analyzeSourceCode("calc.ts", tsCode);
    expect(getAstCacheSize()).toBe(1);

    // Call again with exact same content: reuses cache
    analyzeSourceCode("calc.ts", tsCode);
    expect(getAstCacheSize()).toBe(1);

    clearAstCache();
    expect(getAstCacheSize()).toBe(0);
  });

  it("returns graceful fallback for unsupported languages or empty code", () => {
    const result = analyzeSourceCode("file.unknown", "SELECT * FROM users;");
    expect(result.language).toBe("unknown");
    expect(result.scopes).toEqual([]);

    expect(parseScopes("test.ts", "")).toEqual([]);
  });
});
