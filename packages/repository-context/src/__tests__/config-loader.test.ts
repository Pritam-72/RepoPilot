import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import {
  parseRepoConfig,
  loadRepoConfig,
  formatConventionsForPrompt,
  shouldIgnoreFile,
  DEFAULT_REPO_CONFIG,
} from "../config-loader.js";

describe("RepoConfig Loader", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "acr-config-test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("returns default config when no config file exists", async () => {
    const config = await loadRepoConfig(tmpDir);
    expect(config).toEqual(DEFAULT_REPO_CONFIG);
  });

  it("loads and parses .repopilot.json correctly", async () => {
    const configData = {
      version: 1,
      conventions: ["Always use strict equality", "Do not commit secrets"],
      confidenceThreshold: 0.85,
      disabledAgents: ["quality"],
      ignorePaths: ["docs/**", "**/*.test.ts"],
      bannedPatterns: [
        {
          pattern: "eval(",
          message: "eval is insecure",
          severity: "critical",
        },
      ],
    };

    await fs.writeFile(path.join(tmpDir, ".repopilot.json"), JSON.stringify(configData));

    const config = await loadRepoConfig(tmpDir);
    expect(config.conventions).toHaveLength(2);
    expect(config.confidenceThreshold).toBe(0.85);
    expect(config.disabledAgents).toContain("quality");
    expect(config.bannedPatterns[0]?.pattern).toBe("eval(");
  });

  it("falls back to .acr.json if .repopilot.json does not exist", async () => {
    const configData = {
      version: 1,
      conventions: ["Prefer functional style"],
    };

    await fs.writeFile(path.join(tmpDir, ".acr.json"), JSON.stringify(configData));

    const config = await loadRepoConfig(tmpDir);
    expect(config.conventions).toEqual(["Prefer functional style"]);
  });

  it("throws validation error for invalid config content", () => {
    expect(() => {
      parseRepoConfig(JSON.stringify({ confidenceThreshold: 2.5 })); // > 1
    }).toThrow(/Invalid repo configuration/);
  });

  it("formats conventions into prompt markdown", () => {
    const formatted = formatConventionsForPrompt({
      version: 1,
      conventions: ["Always handle promise rejection", "Prefer const over let"],
      disabledAgents: [],
      ignorePaths: [],
      bannedPatterns: [
        {
          pattern: "console.log",
          message: "Use structured logger",
          severity: "low",
        },
      ],
    });

    expect(formatted).toContain("Repository-Specific Coding Conventions:");
    expect(formatted).toContain("- Always handle promise rejection");
    expect(formatted).toContain("Banned Code Patterns");
    expect(formatted).toContain("`console.log`");
  });

  it("evaluates shouldIgnoreFile accurately", () => {
    const ignoreList = ["docs/**", "vendor/", "**/*.test.ts", "dist/*."];

    expect(shouldIgnoreFile("docs/architecture.md", ignoreList)).toBe(true);
    expect(shouldIgnoreFile("vendor/lib/util.js", ignoreList)).toBe(true);
    expect(shouldIgnoreFile("src/services/auth.test.ts", ignoreList)).toBe(true);
    expect(shouldIgnoreFile("src/services/auth.ts", ignoreList)).toBe(false);
  });
});
