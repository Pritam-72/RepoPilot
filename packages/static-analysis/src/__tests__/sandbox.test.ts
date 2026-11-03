import { describe, it, expect, vi } from "vitest";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import {
  buildDockerRunArgs,
  isCommandAllowed,
  runInSandbox,
  DEFAULT_ALLOWED_COMMANDS,
} from "../sandbox-runner.js";

describe("Isolated Execution Sandbox (Task 8.1)", () => {
  it("builds correct isolated Docker run arguments with network none and non-root user", () => {
    const config = {
      workdir: "/path/to/ephemeral",
      memoryLimit: "256m",
      cpuLimit: "0.5",
      network: "none" as const,
      readOnlyRoot: true,
      dockerImage: "custom-sandbox:v1",
    };

    const args = buildDockerRunArgs(config, "npm test");

    expect(args).toContain("run");
    expect(args).toContain("--rm");
    expect(args).toContain("--network");
    expect(args).toContain("none");
    expect(args).toContain("-m");
    expect(args).toContain("256m");
    expect(args).toContain("--cpus=0.5");
    expect(args).toContain("-u");
    expect(args).toContain("1000:1000");
    expect(args).toContain("--read-only");
    expect(args).toContain("custom-sandbox:v1");
  });

  it("validates command allowlist and rejects unsafe command chaining", () => {
    expect(isCommandAllowed("npm test")).toBe(true);
    expect(isCommandAllowed("pytest tests/")).toBe(true);
    expect(isCommandAllowed("node test.js")).toBe(true);

    // Reject dangerous characters & chaining
    expect(isCommandAllowed("npm test; rm -rf /")).toBe(false);
    expect(isCommandAllowed("pytest && curl http://malicious.com")).toBe(false);
    expect(isCommandAllowed("npm test | bash")).toBe(false);
    expect(isCommandAllowed("cat /etc/passwd")).toBe(false);
    expect(isCommandAllowed("")).toBe(false);
  });

  it("rejects execution if sandbox workdir does not exist", async () => {
    const res = await runInSandbox(
      { workdir: "/non/existent/directory/path/12345" },
      "npm test"
    );

    expect(res.success).toBe(false);
    expect(res.error).toBe("workdir_not_found");
  });

  it("rejects execution if command is not allowed by policy", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sandbox-test-"));
    try {
      const res = await runInSandbox(
        { workdir: tempDir },
        "sh -c 'echo hacked'"
      );

      expect(res.success).toBe(false);
      expect(res.exitCode).toBe(126);
      expect(res.error).toBe("command_not_allowed");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("executes command using custom executor and reports structured result", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sandbox-test-"));
    try {
      const mockExecutor = vi.fn().mockResolvedValue({
        stdout: "All 5 tests passed\n",
        stderr: "",
        exitCode: 0,
      });

      const res = await runInSandbox(
        {
          workdir: tempDir,
          customExecutor: mockExecutor,
        },
        "npm test"
      );

      expect(res.success).toBe(true);
      expect(res.exitCode).toBe(0);
      expect(res.stdout).toContain("All 5 tests passed");
      expect(mockExecutor).toHaveBeenCalled();
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("handles executor timeout gracefully with exitCode 124", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sandbox-test-"));
    try {
      const timeoutError: any = new Error("Command timed out");
      timeoutError.code = "ETIMEDOUT";

      const mockExecutor = vi.fn().mockRejectedValue(timeoutError);

      const res = await runInSandbox(
        {
          workdir: tempDir,
          customExecutor: mockExecutor,
        },
        "npm test"
      );

      expect(res.success).toBe(false);
      expect(res.exitCode).toBe(124);
      expect(res.timedOut).toBe(true);
      expect(res.error).toBe("timeout");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("executes valid command in local ephemeral fallback when Docker is unavailable", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sandbox-test-"));
    try {
      // Create a small Node script in workdir
      fs.writeFileSync(path.join(tempDir, "script.js"), "console.log('Sandbox test executed');");

      const res = await runInSandbox(
        {
          workdir: tempDir,
          allowedCommands: ["node"],
        },
        "node script.js"
      );

      expect(res.success).toBe(true);
      expect(res.exitCode).toBe(0);
      expect(res.stdout).toContain("Sandbox test executed");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
