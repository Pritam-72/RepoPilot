import { describe, it, expect } from "vitest";
import { detectLanguage } from "../language-detector.js";
import { parseScopes, getEnclosingScopesForLines } from "../ast-parser.js";

describe("detectLanguage", () => {
  it("detects typescript, python, and unknown languages", () => {
    expect(detectLanguage("src/app.ts")).toBe("typescript");
    expect(detectLanguage("src/Component.tsx")).toBe("tsx");
    expect(detectLanguage("script.py")).toBe("python");
    expect(detectLanguage("main.go")).toBe("unknown");
  });
});

describe("AST Scopes Parser", () => {
  const tsCode = `
class Calculator {
  add(a: number, b: number): number {
    const sum = a + b;
    return sum;
  }
}

function computeTotal(items: number[]): number {
  return items.reduce((acc, x) => acc + x, 0);
}
`;

  const pyCode = `
class UserService:
    def get_user(self, user_id: int):
        return {"id": user_id}

def calculate_discount(price: float) -> float:
    return price * 0.9
`;

  it("extracts classes and methods from TypeScript", () => {
    const scopes = parseScopes("calc.ts", tsCode);
    const names = scopes.map((s) => s.name);

    expect(names).toContain("Calculator");
    expect(names).toContain("add");
    expect(names).toContain("computeTotal");

    const methodScope = scopes.find((s) => s.name === "add");
    expect(methodScope?.kind).toBe("method");
    expect(methodScope?.startLine).toBeGreaterThan(1);
  });

  it("extracts classes and functions from Python", () => {
    const scopes = parseScopes("service.py", pyCode);
    const names = scopes.map((s) => s.name);

    expect(names).toContain("UserService");
    expect(names).toContain("get_user");
    expect(names).toContain("calculate_discount");

    const funcScope = scopes.find((s) => s.name === "calculate_discount");
    expect(funcScope?.kind).toBe("function");
  });

  it("locates enclosing scopes for modified line numbers", () => {
    // Line 5 in tsCode is inside `add` and inside `Calculator`
    const scopes = getEnclosingScopesForLines("calc.ts", tsCode, new Set([5]));
    const names = scopes.map((s) => s.name);

    expect(names).toContain("Calculator");
    expect(names).toContain("add");
    expect(names).not.toContain("computeTotal");
  });

  it("returns empty array for unknown language or empty code", () => {
    expect(parseScopes("file.unknown", "some content")).toEqual([]);
    expect(parseScopes("test.ts", "")).toEqual([]);
  });
});
