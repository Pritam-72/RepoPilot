import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReviewAgentInput } from "@acr/review-contracts";

vi.mock("../llm-provider.js", () => ({
  generateStructuredOutput: vi.fn(),
}));

const { generateStructuredOutput } = await import("../llm-provider.js");
const { runSecurityReviewAgent } = await import("../security-agent.js");

const SQLI_INPUT: ReviewAgentInput = {
  repository: { owner: "acme", name: "app", repositoryId: 1 },
  pullRequest: { number: 21, baseSha: "base", headSha: "head", title: "Add user lookup" },
  changedFiles: [
    {
      path: "src/db.ts",
      status: "modified",
      patch: `@@ -1,5 +1,5 @@
 export async function findUser(db: any, username: string) {
-  return db.query('SELECT * FROM users WHERE name = $1', [username]);
+  return db.query(\`SELECT * FROM users WHERE name = '\${username}'\`);
 }`,
      additions: 1,
      deletions: 1,
    },
  ],
  context: [],
  reviewPolicy: { enabledCategories: ["security"], minimumConfidence: 0.5 },
};

const PATH_TRAVERSAL_INPUT: ReviewAgentInput = {
  repository: { owner: "acme", name: "app", repositoryId: 1 },
  pullRequest: { number: 22, baseSha: "base", headSha: "head", title: "Download file endpoint" },
  changedFiles: [
    {
      path: "src/files.ts",
      status: "modified",
      patch: `@@ -1,5 +1,5 @@
 export function readFile(userFile: string) {
-  const safeName = path.basename(userFile);
-  return fs.readFileSync(path.join('/var/data', safeName));
+  const fullPath = path.join('/var/data', userFile);
+  return fs.readFileSync(fullPath);
 }`,
      additions: 2,
      deletions: 2,
    },
  ],
  context: [],
  reviewPolicy: { enabledCategories: ["security"], minimumConfidence: 0.5 },
};

const CLEAN_INPUT: ReviewAgentInput = {
  repository: { owner: "acme", name: "app", repositoryId: 1 },
  pullRequest: { number: 23, baseSha: "base", headSha: "head", title: "Clean refactor" },
  changedFiles: [
    {
      path: "src/safe.ts",
      status: "modified",
      patch: `@@ -1,3 +1,3 @@
-export const PORT = 3000;
+export const PORT = 8080;`,
      additions: 1,
      deletions: 1,
    },
  ],
  context: [],
  reviewPolicy: { enabledCategories: ["security"], minimumConfidence: 0.5 },
};

describe("runSecurityReviewAgent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("detects SQL injection vulnerability on modified line", async () => {
    vi.mocked(generateStructuredOutput).mockResolvedValueOnce({
      findings: [
        {
          title: "SQL Injection via string interpolation",
          category: "security",
          severity: "critical",
          confidence: 0.98,
          file: "src/db.ts",
          line: 2,
          description: "Untrusted username parameter directly concatenated into SQL query string.",
          evidence: "return db.query(`SELECT * FROM users WHERE name = '${username}'`);",
          recommendation: "Use parameterized queries with prepared statements.",
          ruleId: "CWE-89",
          verificationStatus: "unverified",
        },
      ],
    });

    const result = await runSecurityReviewAgent(SQLI_INPUT);
    expect(result.findings).toHaveLength(1);
    const finding = result.findings[0]!;
    expect(finding.category).toBe("security");
    expect(finding.severity).toBe("critical");
    expect(finding.file).toBe("src/db.ts");
    expect(finding.line).toBe(2);
    expect(finding.ruleId).toBe("CWE-89");
  });

  it("detects Path Traversal vulnerability on modified line", async () => {
    vi.mocked(generateStructuredOutput).mockResolvedValueOnce({
      findings: [
        {
          title: "Path Traversal in readFile",
          category: "security",
          severity: "high",
          confidence: 0.95,
          file: "src/files.ts",
          line: 2,
          description: "Unsanitized userFile joined directly into root path.",
          evidence: "const fullPath = path.join('/var/data', userFile);",
          recommendation: "Sanitize path using path.basename or resolve and verify basePath prefix.",
          ruleId: "CWE-22",
          verificationStatus: "unverified",
        },
      ],
    });

    const result = await runSecurityReviewAgent(PATH_TRAVERSAL_INPUT);
    expect(result.findings).toHaveLength(1);
    const finding = result.findings[0]!;
    expect(finding.category).toBe("security");
    expect(finding.severity).toBe("high");
    expect(finding.ruleId).toBe("CWE-22");
  });

  it("returns empty findings for clean PR", async () => {
    vi.mocked(generateStructuredOutput).mockResolvedValueOnce({ findings: [] });
    const result = await runSecurityReviewAgent(CLEAN_INPUT);
    expect(result.findings).toEqual([]);
  });

  it("filters out security findings on non-changed lines", async () => {
    vi.mocked(generateStructuredOutput).mockResolvedValueOnce({
      findings: [
        {
          title: "False positive on unchanged line",
          category: "security",
          severity: "medium",
          confidence: 0.8,
          file: "src/db.ts",
          line: 99,
          description: "Line 99 does not exist in patch.",
          evidence: "...",
          verificationStatus: "unverified",
        },
      ],
    });

    const result = await runSecurityReviewAgent(SQLI_INPUT);
    expect(result.findings).toHaveLength(0);
  });
});
