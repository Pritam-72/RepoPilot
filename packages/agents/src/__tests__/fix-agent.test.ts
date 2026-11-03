import { describe, it, expect, vi } from "vitest";
import {
  generateFixProposal,
  validatePatchBoundaries,
  applyPatchToContent,
} from "../fix-agent.js";
import type { Finding } from "@acr/review-contracts";

describe("Fix Proposal Agent (Task 8.2)", () => {
  const verifiedFinding: Finding & { id: string } = {
    id: "f-sql-1",
    file: "src/db.ts",
    line: 2,
    category: "security",
    severity: "critical",
    title: "SQL Injection",
    description: "Untrusted variable concatenated into SQL query string",
    evidence: "return db.query(`SELECT * FROM users WHERE name = '${username}'`);",
    recommendation: "return db.query('SELECT * FROM users WHERE name = $1', [username]);",
    confidence: 0.98,
    verificationStatus: "verified",
  };

  const fileContent = `export async function findUser(db: any, username: string) {
  return db.query(\`SELECT * FROM users WHERE name = '\${username}'\`);
}`;

  it("rejects unverified findings", async () => {
    const unverifiedFinding = {
      ...verifiedFinding,
      verificationStatus: "unverified" as const,
    };

    await expect(
      generateFixProposal(unverifiedFinding, fileContent)
    ).rejects.toThrow("Cannot generate fix proposal: finding f-sql-1 is not verified");
  });

  it("validates patch boundaries and rejects path traversal or sensitive file tampering", () => {
    // Valid patch
    const validPatch = "--- a/src/db.ts\n+++ b/src/db.ts\n@@ -2,1 +2,1 @@\n-old\n+new";
    expect(validatePatchBoundaries(validPatch, "src/db.ts").valid).toBe(true);

    // Path traversal in patch
    const traversalPatch = "--- a/../etc/passwd\n+++ b/../etc/passwd\n@@ -1,1 +1,1 @@\n-x\n+y";
    expect(validatePatchBoundaries(traversalPatch, "src/db.ts").valid).toBe(false);

    // Sensitive file (.env)
    const envPatch = "--- a/.env\n+++ b/.env\n@@ -1,1 +1,1 @@\n-x\n+y";
    expect(validatePatchBoundaries(envPatch, ".env").valid).toBe(false);

    // Modifying unexpected file
    const mismatchPatch = "--- a/src/other.ts\n+++ b/src/other.ts\n@@ -1,1 +1,1 @@\n-x\n+y";
    expect(validatePatchBoundaries(mismatchPatch, "src/db.ts").valid).toBe(false);
  });

  it("applies patch to content cleanly in-memory", () => {
    const original = `function add(a: number, b: number) {\n  return a - b;\n}`;
    const patch = `--- a/math.ts\n+++ b/math.ts\n@@ -2,1 +2,1 @@\n-  return a - b;\n+  return a + b;`;

    const patched = applyPatchToContent(original, patch);
    expect(patched).toBe(`function add(a: number, b: number) {\n  return a + b;\n}`);
  });

  it("generates structured FixProposal with status pending_approval", async () => {
    const proposal = await generateFixProposal(verifiedFinding, fileContent);

    expect(proposal.id).toContain("fix-f-sql-1");
    expect(proposal.file).toBe("src/db.ts");
    expect(proposal.status).toBe("pending_approval");
    expect(proposal.patch).toContain("--- a/src/db.ts");
    expect(proposal.patch).toContain("+++ b/src/db.ts");
    expect(proposal.patch).toContain("SELECT * FROM users WHERE name = $1");
    expect(proposal.validationStatus).toBe("untested");
  });

  it("integrates sandbox test execution when requested", async () => {
    const mockExecutor = vi.fn().mockResolvedValue({
      stdout: "Tests: 10 passed\n",
      stderr: "",
      exitCode: 0,
    });

    const proposal = await generateFixProposal(verifiedFinding, fileContent, {
      validateInSandbox: true,
      sandboxConfig: {
        workdir: process.cwd(),
        customExecutor: mockExecutor,
      },
    });

    expect(proposal.validationStatus).toBe("passed");
    expect(proposal.validationLogs).toContain("Tests: 10 passed");
    expect(mockExecutor).toHaveBeenCalled();
  });
});

