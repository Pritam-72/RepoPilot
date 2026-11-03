import { describe, it, expect, vi } from "vitest";
import { normalizeSemgrepOutput, type SemgrepJsonOutput } from "../semgrep-adapter.js";
import { runSemgrep } from "../runner.js";

const mockSemgrepOutput: SemgrepJsonOutput = {
  results: [
    {
      check_id: "javascript.lang.security.audit.sqli.node-sqli",
      path: "src/db.ts",
      start: { line: 2, col: 10 },
      end: { line: 2, col: 65 },
      extra: {
        message: "Detected string concatenation in SQL query which may lead to SQL injection",
        severity: "ERROR",
        metadata: {
          cwe: ["CWE-89"],
          category: "security",
          confidence: "HIGH",
        },
        lines: "return db.query(`SELECT * FROM users WHERE name = '${username}'`);",
      },
    },
    {
      check_id: "generic.maintainability.todo",
      path: "src/utils.ts",
      start: { line: 50, col: 1 },
      end: { line: 50, col: 20 },
      extra: {
        message: "Found TODO comment",
        severity: "INFO",
        metadata: { category: "maintainability" },
        lines: "// TODO: refactor this later",
      },
    },
  ],
};

describe("Semgrep Adapter", () => {
  it("normalizes Semgrep JSON output into FindingSchema format", () => {
    const findings = normalizeSemgrepOutput(mockSemgrepOutput);

    expect(findings).toHaveLength(2);

    const sqli = findings.find((f) => f.ruleId?.includes("sqli"))!;
    expect(sqli).toBeDefined();
    expect(sqli.category).toBe("security");
    expect(sqli.severity).toBe("critical");
    expect(sqli.confidence).toBe(1.0);
    expect(sqli.verificationStatus).toBe("verified");
    expect(sqli.file).toBe("src/db.ts");
    expect(sqli.line).toBe(2);
    expect(sqli.description).toContain("CWE-89");
    expect(sqli.evidence).toContain("SELECT * FROM users");
  });

  it("filters out findings not intersecting changed lines", () => {
    const changedLines = new Map<string, Set<number>>([
      ["src/db.ts", new Set([2])], // line 2 is changed
      ["src/utils.ts", new Set([10])], // line 50 is NOT changed
    ]);

    const findings = normalizeSemgrepOutput(mockSemgrepOutput, changedLines);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.file).toBe("src/db.ts");
  });

  it("handles malformed JSON or empty results safely", () => {
    expect(normalizeSemgrepOutput("invalid json" as unknown as string)).toEqual([]);
    expect(normalizeSemgrepOutput({ results: [] })).toEqual([]);
  });
});

describe("Semgrep Runner", () => {
  it("executes via injected executor and returns parsed findings", async () => {
    const mockExecutor = vi.fn().mockResolvedValue({
      stdout: JSON.stringify(mockSemgrepOutput),
      stderr: "",
    });

    const findings = await runSemgrep("src/", { executor: mockExecutor });

    expect(mockExecutor).toHaveBeenCalled();
    expect(findings).toHaveLength(2);
  });

  it("gracefully catches errors when semgrep binary is missing", async () => {
    const mockExecutor = vi.fn().mockRejectedValue(new Error("ENOENT: command not found: semgrep"));

    const findings = await runSemgrep("src/", { executor: mockExecutor });

    expect(findings).toEqual([]);
  });
});

