import { describe, it, expect } from "vitest";
import { SymbolIndex } from "../symbol-index.js";

describe("SymbolIndex", () => {
  const repoFiles = [
    {
      path: "src/calculator.ts",
      content: `
export function addNumbers(a: number, b: number): number {
  return a + b;
}

export class MathEngine {
  execute() {
    return addNumbers(2, 3);
  }
}
`,
    },
    {
      path: "src/service.ts",
      content: `
import { addNumbers } from "./calculator.js";

export function processInvoice(): number {
  const tax = addNumbers(100, 20);
  return tax;
}
`,
    },
  ];

  it("finds symbol definition across repo files", () => {
    const index = new SymbolIndex(repoFiles);
    const related = index.findRelatedSymbols(["addNumbers"]);

    const def = related.find((r) => r.kind === "definition");
    expect(def).toBeDefined();
    expect(def?.file).toBe("src/calculator.ts");
    expect(def?.snippet).toContain("function addNumbers");
  });

  it("finds callers/invocations across repo files with bounded depth", () => {
    const index = new SymbolIndex(repoFiles);
    const related = index.findRelatedSymbols(["addNumbers"], { maxDepth: 1 });

    const callers = related.filter((r) => r.kind === "caller");
    expect(callers.length).toBeGreaterThanOrEqual(1);
    expect(callers.some((c) => c.file === "src/service.ts")).toBe(true);
  });

  it("finds import statements referencing the symbol", () => {
    const index = new SymbolIndex(repoFiles);
    const related = index.findRelatedSymbols(["addNumbers"]);

    const imports = related.filter((r) => r.kind === "import");
    expect(imports).toHaveLength(1);
    expect(imports[0]?.file).toBe("src/service.ts");
    expect(imports[0]?.snippet).toContain("import { addNumbers }");
  });

  it("returns empty array when symbol is empty or not found", () => {
    const index = new SymbolIndex(repoFiles);
    expect(index.findRelatedSymbols([])).toEqual([]);
    expect(index.findRelatedSymbols(["nonExistentSymbolXYZ"])).toEqual([]);
  });
});

