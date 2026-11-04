import { describe, it, expect } from "vitest";
import { buildReviewUnits, type ChunkerFile } from "../chunker.js";

describe("buildReviewUnits", () => {
  const tsContent = `
export class AuthService {
  login(user: string, pass: string): boolean {
    if (!user || !pass) {
      return false;
    }
    return true;
  }

  logout(): void {
    console.log("Logged out");
  }
}
`;

  it("builds review units for changed function within budget without splitting", () => {
    const files: ChunkerFile[] = [
      {
        path: "src/auth.ts",
        content: tsContent,
        changedRanges: [{ startLine: 4, endLine: 5, type: "modified" }],
      },
    ];

    const units = buildReviewUnits(files, { maxTokensPerUnit: 1000 });
    expect(units.length).toBeGreaterThan(0);

    const loginUnit = units.find((u) => u.enclosingSymbol?.name === "login");
    expect(loginUnit).toBeDefined();
    expect(loginUnit?.file).toBe("src/auth.ts");
    expect(loginUnit?.enclosingSymbol?.kind).toBe("method");
    expect(loginUnit?.isPartial).toBe(false);
    expect(loginUnit?.surroundingCode).toContain("return false;");
  });

  it("skips ignorable files such as package-lock.json and image assets", () => {
    const files: ChunkerFile[] = [
      {
        path: "package-lock.json",
        content: `{"name": "root", "lockfileVersion": 3}`,
        changedRanges: [{ startLine: 1, endLine: 1, type: "modified" }],
      },
      {
        path: "public/banner.png",
        content: "binary-content-1234",
        changedRanges: [{ startLine: 1, endLine: 1, type: "modified" }],
      },
    ];

    const units = buildReviewUnits(files);
    expect(units).toEqual([]);
  });

  it("splits oversized functions that exceed token budget and marks isPartial: true", () => {
    // Generate an intentionally long function
    const longFunctionLines = [
      "function veryLongProcess() {",
      ...Array.from({ length: 60 }, (_, i) => `  const step${i} = computeStep(${i});`),
      "  return true;",
      "}",
    ];
    const longContent = longFunctionLines.join("\n");

    const files: ChunkerFile[] = [
      {
        path: "src/long.ts",
        content: longContent,
        changedRanges: [{ startLine: 10, endLine: 20, type: "modified" }],
      },
    ];

    // Restrict token budget to a very small size to force budget split
    const units = buildReviewUnits(files, { maxTokensPerUnit: 50 });
    expect(units.length).toBeGreaterThan(1);
    expect(units.every((u) => u.isPartial === true)).toBe(true);
  });

  it("degrades gracefully for unsupported languages with whole-hunk context", () => {
    const sqlContent = `
-- Migration script
ALTER TABLE users ADD COLUMN age INT;
CREATE INDEX idx_users_age ON users(age);
`;

    const files: ChunkerFile[] = [
      {
        path: "migrations/001_add_age.sql",
        content: sqlContent,
        changedRanges: [{ startLine: 3, endLine: 4, type: "added" }],
      },
    ];

    const units = buildReviewUnits(files);
    expect(units).toHaveLength(1);
    expect(units[0]?.language).toBe("unsupported");
    expect(units[0]?.enclosingSymbol).toBeUndefined();
    expect(units[0]?.surroundingCode).toContain("ALTER TABLE users");
  });

  it("redacts secrets inside surrounding code of review units", () => {
    const fileWithSecret = `
function connectToService() {
  const apiKey = "sk-1234567890abcdef12345";
  return apiKey;
}
`;

    const files: ChunkerFile[] = [
      {
        path: "src/secret.ts",
        content: fileWithSecret,
        changedRanges: [{ startLine: 3, endLine: 3, type: "modified" }],
      },
    ];

    const units = buildReviewUnits(files);
    expect(units).toHaveLength(1);
    expect(units[0]?.surroundingCode).not.toContain("sk-1234567890abcdef12345");
    expect(units[0]?.surroundingCode).toContain("[REDACTED_SECRET]");
  });
});
