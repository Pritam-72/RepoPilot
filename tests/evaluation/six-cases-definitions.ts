export interface TestCaseDefinition {
  id: string;
  name: string;
  category: "bug" | "security" | "error-handling" | "performance" | "test" | "quality";
  expectedAgent: string;
  expectedSeverity: "critical" | "high" | "medium" | "low";
  expectedLine: number;
  isControl: boolean;
  file: string;
  patch: string;
  content: string;
  description: string;
  remediationSnippet: string;
}

export const SIX_TEST_CASES: TestCaseDefinition[] = [
  {
    id: "case-1-bug",
    name: "Off-by-One Boundary Defect in Pagination Slice",
    category: "bug",
    expectedAgent: "bug-reviewer",
    expectedSeverity: "high",
    expectedLine: 3,
    isControl: false,
    file: "src/paginate.ts",
    patch: `@@ -1,5 +1,5 @@
 export function getPage(items: string[], page: number, size: number): string[] {
   const start = (page - 1) * size;
-  const end = start + size;
+  const end = start + size + 1;
   return items.slice(start, end);
 }`,
    content: `export function getPage(items: string[], page: number, size: number): string[] {\n  const start = (page - 1) * size;\n  const end = start + size + 1;\n  return items.slice(start, end);\n}\n`,
    description: "Slice end index exceeds bounds by 1 leading to off-by-one pagination leaks and returning more elements than the requested page size.",
    remediationSnippet: `const end = start + size;`,
  },
  {
    id: "case-2-security",
    name: "Raw String Concatenation SQL Injection in User Authentication",
    category: "security",
    expectedAgent: "security-reviewer",
    expectedSeverity: "critical",
    expectedLine: 2,
    isControl: false,
    file: "src/db/users.ts",
    patch: `@@ -1,4 +1,4 @@
 export async function findUserByEmail(email: string) {
-  return db.query(\`SELECT * FROM users WHERE email = $1\`, [email]);
+  return db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);
 }`,
    content: `export async function findUserByEmail(email: string) {\n  return db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);\n}\n`,
    description: "Raw string interpolation inside SQL query introduces critical SQL injection vulnerability allowing arbitrary authentication bypass or database exfiltration.",
    remediationSnippet: `return db.query("SELECT * FROM users WHERE email = $1", [email]);`,
  },
  {
    id: "case-3-error-handling",
    name: "Floating Unhandled Promise Rejection in Background Sync",
    category: "error-handling",
    expectedAgent: "error-handling-reviewer",
    expectedSeverity: "high",
    expectedLine: 2,
    isControl: false,
    file: "src/service/sync.ts",
    patch: `@@ -1,5 +1,5 @@
 export async function syncRepo(repoId: string): Promise<void> {
-  try { await fetchUpdates(repoId); } catch (e) { logError(e); }
+  fetchUpdates(repoId);
 }`,
    content: `export async function syncRepo(repoId: string): Promise<void> {\n  fetchUpdates(repoId);\n}\n`,
    description: "Async operation omitted await and try/catch block leading to unhandled promise rejection and node process termination on network failure.",
    remediationSnippet: `try {\n  await fetchUpdates(repoId);\n} catch (error) {\n  logger.error({ error, repoId }, "Failed to sync repo updates");\n}`,
  },
  {
    id: "case-4-performance",
    name: "Quadratic O(N*M) Linear Scan in Hot-Path Filter",
    category: "performance",
    expectedAgent: "performance-reviewer",
    expectedSeverity: "medium",
    expectedLine: 2,
    isControl: false,
    file: "src/utils/filter.ts",
    patch: `@@ -1,6 +1,6 @@
 export function filterForbidden(items: string[], blacklist: string[]): string[] {
-  const set = new Set(blacklist);
-  return items.filter(x => !set.has(x));
+  return items.filter(x => !blacklist.some(b => b === x));
 }`,
    content: `export function filterForbidden(items: string[], blacklist: string[]): string[] {\n  return items.filter(x => !blacklist.some(b => b === x));\n}\n`,
    description: "Nested linear array scan inside filter creates an O(N*M) algorithmic bottleneck instead of O(N+M) set lookup on large datasets.",
    remediationSnippet: `const forbiddenSet = new Set(blacklist);\nreturn items.filter(x => !forbiddenSet.has(x));`,
  },
  {
    id: "case-5-test",
    name: "Missing Assertions in Asynchronous Route Test",
    category: "test",
    expectedAgent: "test-coverage-reviewer",
    expectedSeverity: "medium",
    expectedLine: 3,
    isControl: false,
    file: "test/route-execution.test.ts",
    patch: `@@ -1,5 +1,5 @@
 describe("Route Dispatcher", () => {
   it("executes middleware chain in sequence", async () => {
     const route = createMockRoute();
-    const res = await route.dispatch({ url: "/test" }, {});
-    expect(res.status).toBe(200);
+    await route.dispatch({ url: "/test" }, {});
   });
 });`,
    content: `describe("Route Dispatcher", () => {\n  it("executes middleware chain in sequence", async () => {\n    const route = createMockRoute();\n    await route.dispatch({ url: "/test" }, {});\n  });\n});\n`,
    description: "Async integration test executes dispatcher without asserting HTTP response status code or response payload, masking silent failures.",
    remediationSnippet: `const res = await route.dispatch({ url: "/test" }, {});\nexpect(res.status).toBe(200);\nexpect(res.body).toBeDefined();`,
  },
  {
    id: "case-6-quality",
    name: "Clean Control Refactor - Clamping Function (Control PR)",
    category: "quality",
    expectedAgent: "quality-reviewer",
    expectedSeverity: "low",
    expectedLine: 0,
    isControl: true,
    file: "src/helpers/math.ts",
    patch: `@@ -1,3 +1,3 @@
 export function clamp(val: number, min: number, max: number): number {
-  return val < min ? min : (val > max ? max : val);
+  return Math.min(Math.max(val, min), max);
 }`,
    content: `export function clamp(val: number, min: number, max: number): number {\n  return Math.min(Math.max(val, min), max);\n}\n`,
    description: "Clean refactoring replacing nested ternary with standard Math.min/Math.max calls with zero defects to verify false positive suppression.",
    remediationSnippet: `// No remediation needed - PR is clean and approved`,
  },
];

