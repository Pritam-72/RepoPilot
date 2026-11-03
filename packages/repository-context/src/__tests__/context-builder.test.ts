import { describe, it, expect } from "vitest";
import {
  redactSecrets,
  buildRepositoryContext,
  estimateTokens,
} from "../context-builder.js";
import { extractReferencedSymbols, findSymbolDefinitions } from "../search.js";

describe("redactSecrets", () => {
  it("redacts GitHub personal access tokens", () => {
    const input = "const token = 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';";
    const redacted = redactSecrets(input);
    expect(redacted).not.toContain("ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
    expect(redacted).toContain("[REDACTED_SECRET]");
  });

  it("redacts AWS access keys", () => {
    const input = "aws_key = 'AKIA1234567890ABCDEF'";
    const redacted = redactSecrets(input);
    expect(redacted).not.toContain("AKIA1234567890ABCDEF");
    expect(redacted).toContain("[REDACTED_SECRET]");
  });

  it("redacts bearer tokens and api keys in assignments", () => {
    const input = "const apiKey = 'sk-1234567890abcdef1234567890abcdef';";
    const redacted = redactSecrets(input);
    expect(redacted).not.toContain("sk-1234567890abcdef1234567890abcdef");
    expect(redacted).toContain("[REDACTED_SECRET]");
  });
});

describe("extractReferencedSymbols and findSymbolDefinitions", () => {
  it("extracts identifiers from diff patch", () => {
    const patch = `
+ const user = await findUserById(userId);
+ return formatUserResponse(user);
`;
    const symbols = extractReferencedSymbols(patch);
    expect(symbols).toContain("findUserById");
    expect(symbols).toContain("formatUserResponse");
    expect(symbols).toContain("user");
    expect(symbols).not.toContain("const");
    expect(symbols).not.toContain("return");
  });

  it("finds matching definitions across repo files", () => {
    const repoFiles = [
      {
        path: "src/user.service.ts",
        content: `
export function findUserById(id: string) {
  return db.users.findUnique({ where: { id } });
}
`,
      },
    ];

    const defs = findSymbolDefinitions(["findUserById"], repoFiles);
    expect(defs).toHaveLength(1);
    expect(defs[0]?.path).toBe("src/user.service.ts");
    expect(defs[0]?.symbol).toBe("findUserById");
    expect(defs[0]?.content).toContain("export function findUserById");
  });
});

describe("buildRepositoryContext", () => {
  const fileContent = `
function processPayment(amount: number) {
  const fee = amount * 0.05;
  const secretKey = 'sk-secret123456789012345678901234567890';
  return amount + fee;
}
`;

  it("builds context with enclosing scopes and redacts secrets", () => {
    const chunks = buildRepositoryContext(
      [
        {
          path: "src/billing.ts",
          content: fileContent,
          changedLines: new Set([3]),
          patch: "+ const fee = amount * 0.05;",
        },
      ],
      {
        headSha: "head-sha-123",
        maxTokens: 5000,
      }
    );

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0]?.path).toBe("src/billing.ts");
    expect(chunks[0]?.content).toContain("function processPayment");
    expect(chunks[0]?.content).not.toContain("sk-secret123456789012345678901234567890");
    expect(chunks[0]?.content).toContain("[REDACTED_SECRET]");
    expect(chunks[0]?.sha).toBe("head-sha-123");
  });

  it("strictly enforces token budget limits", () => {
    // Generate a long file with multiple functions
    let longContent = "";
    for (let i = 0; i < 50; i++) {
      longContent += `
function handler_${i}(val: number): number {
  const result = val * ${i};
  return result + 1;
}
`;
    }

    const changedLines = new Set([2, 6, 10, 14, 18, 22, 26, 30, 34, 38]);
    const maxTokens = 100; // very low budget limit

    const chunks = buildRepositoryContext(
      [
        {
          path: "src/long.ts",
          content: longContent,
          changedLines,
        },
      ],
      {
        headSha: "abc",
        maxTokens,
      }
    );

    const totalEstimatedTokens = chunks.reduce((acc, c) => acc + estimateTokens(c.content), 0);
    // Should be at or around maxTokens (with slight tolerance for truncation marker)
    expect(totalEstimatedTokens).toBeLessThanOrEqual(maxTokens + 25);
  });
});

