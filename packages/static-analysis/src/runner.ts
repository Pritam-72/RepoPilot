import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { logger } from "@acr/observability";
import type { Finding } from "@acr/review-contracts";
import { normalizeSemgrepOutput } from "./semgrep-adapter.js";

const execFileAsync = promisify(execFile);

export interface SemgrepRunnerOptions {
  config?: string;
  timeoutMs?: number;
  changedLinesByFile?: Map<string, Set<number>>;
  executor?: (
    command: string,
    args: string[],
    options: { timeout: number }
  ) => Promise<{ stdout: string; stderr: string }>;
}

export async function runSemgrep(
  targetPath: string,
  opts: SemgrepRunnerOptions = {}
): Promise<Finding[]> {
  const {
    config = "auto",
    timeoutMs = 60_000,
    changedLinesByFile,
    executor,
  } = opts;

  const args = ["scan", "--json", `--config=${config}`, targetPath];

  try {
    let stdout: string;
    if (executor) {
      const res = await executor("semgrep", args, { timeout: timeoutMs });
      stdout = res.stdout;
    } else {
      const res = await execFileAsync("semgrep", args, {
        timeout: timeoutMs,
        maxBuffer: 10 * 1024 * 1024,
      });
      stdout = res.stdout;
    }

    return normalizeSemgrepOutput(stdout, changedLinesByFile);
  } catch (err: unknown) {
    const error = err as Error & { code?: string; stdout?: string };
    // Semgrep exits with code 1 if findings are found, or code 0 for clean.
    // If stdout contains valid JSON results, we parse it anyway.
    if (error.stdout) {
      try {
        return normalizeSemgrepOutput(error.stdout, changedLinesByFile);
      } catch {
        // Fall through to error handling
      }
    }

    logger.warn(
      { error: error.message, code: error.code },
      "Semgrep scan could not be executed or binary not found"
    );
    return [];
  }
}

