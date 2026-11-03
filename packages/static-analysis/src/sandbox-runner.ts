import { execFile, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { logger } from "@acr/observability";

const execFileAsync = promisify(execFile);

export interface SandboxConfig {
  workdir: string;
  timeoutMs?: number | undefined;
  memoryLimit?: string | undefined;
  cpuLimit?: string | undefined;
  network?: "none" | "bridge" | undefined;
  readOnlyRoot?: boolean | undefined;
  allowedCommands?: string[] | undefined;
  dockerImage?: string | undefined;
  customExecutor?: ((
    cmd: string,
    args: string[],
    options: { timeout?: number; cwd?: string }
  ) => Promise<{ stdout: string; stderr: string; exitCode: number }>) | undefined;
}

export interface SandboxExecutionResult {
  success: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  timedOut: boolean;
  isolated: boolean;
  error?: string | undefined;
}

export const DEFAULT_ALLOWED_COMMANDS = [
  "npm test",
  "pnpm test",
  "yarn test",
  "pytest",
  "python -m unittest",
  "python3 -m unittest",
  "node",
  "git apply",
  "patch",
  "tsc --noEmit",
  "vitest run",
];

/**
 * Validates that a requested command is in the approved command allowlist.
 */
export function isCommandAllowed(command: string, allowedCommands: string[] = DEFAULT_ALLOWED_COMMANDS): boolean {
  const trimmed = command.trim();
  if (!trimmed) return false;

  // Reject dangerous shell chained sequences
  if (/[;&|`$]/.test(trimmed)) {
    return false;
  }

  return allowedCommands.some((prefix) => trimmed === prefix || trimmed.startsWith(`${prefix} `));
}

/**
 * Constructs the arguments for a secure, isolated Docker container execution.
 */
export function buildDockerRunArgs(config: SandboxConfig, command: string): string[] {
  const network = config.network ?? "none";
  const memory = config.memoryLimit ?? "512m";
  const cpus = config.cpuLimit ?? "1.0";
  const image = config.dockerImage ?? "repopilot-sandbox:latest";
  const readOnlyRoot = config.readOnlyRoot ?? true;

  const args = [
    "run",
    "--rm",
    "--network",
    network,
    "-m",
    memory,
    `--cpus=${cpus}`,
    "-u",
    "1000:1000",
    "-v",
    `${path.resolve(config.workdir)}:/workspace:rw`,
    "-w",
    "/workspace",
  ];

  if (readOnlyRoot) {
    args.push("--read-only", "--tmpfs", "/tmp:rw,noexec,nosuid,size=64m");
  }

  args.push(image, "/bin/sh", "-c", command);
  return args;
}

/**
 * Executes a command inside the isolated sandbox environment.
 */
export async function runInSandbox(
  config: SandboxConfig,
  command: string
): Promise<SandboxExecutionResult> {
  const timeoutMs = config.timeoutMs ?? 30_000;
  const startTime = Date.now();

  // 1. Validate workdir exists
  if (!fs.existsSync(config.workdir)) {
    return {
      success: false,
      exitCode: 1,
      stdout: "",
      stderr: `Sandbox workdir does not exist: ${config.workdir}`,
      durationMs: 0,
      timedOut: false,
      isolated: false,
      error: "workdir_not_found",
    };
  }

  // 2. Validate command against allowlist
  const allowed = config.allowedCommands ?? DEFAULT_ALLOWED_COMMANDS;
  if (!isCommandAllowed(command, allowed)) {
    logger.warn({ command }, "Command rejected by sandbox allowlist policy");
    return {
      success: false,
      exitCode: 126,
      stdout: "",
      stderr: `Command "${command}" is not in the sandbox allowed commands policy`,
      durationMs: 0,
      timedOut: false,
      isolated: true,
      error: "command_not_allowed",
    };
  }

  // 3. Custom executor hook (e.g. for unit testing)
  if (config.customExecutor) {
    try {
      const res = await config.customExecutor("docker", buildDockerRunArgs(config, command), {
        timeout: timeoutMs,
        cwd: config.workdir,
      });
      return {
        success: res.exitCode === 0,
        exitCode: res.exitCode,
        stdout: res.stdout,
        stderr: res.stderr,
        durationMs: Date.now() - startTime,
        timedOut: false,
        isolated: true,
      };
    } catch (err: any) {
      const isTimeout = err.code === "ETIMEDOUT" || err.killed === true;
      return {
        success: false,
        exitCode: isTimeout ? 124 : 1,
        stdout: err.stdout ?? "",
        stderr: err.stderr ?? err.message,
        durationMs: Date.now() - startTime,
        timedOut: isTimeout,
        isolated: true,
        error: isTimeout ? "timeout" : "execution_failed",
      };
    }
  }

  // 4. Check if Docker is available
  let dockerAvailable = false;
  try {
    await execFileAsync("docker", ["--version"], { timeout: 3000 });
    dockerAvailable = true;
  } catch {
    dockerAvailable = false;
  }

  if (dockerAvailable) {
    const dockerArgs = buildDockerRunArgs(config, command);
    try {
      const { stdout, stderr } = await execFileAsync("docker", dockerArgs, {
        timeout: timeoutMs,
        maxBuffer: 10 * 1024 * 1024,
      });
      return {
        success: true,
        exitCode: 0,
        stdout,
        stderr,
        durationMs: Date.now() - startTime,
        timedOut: false,
        isolated: true,
      };
    } catch (err: any) {
      const isTimeout = err.code === "ETIMEDOUT" || err.killed === true;
      return {
        success: false,
        exitCode: isTimeout ? 124 : err.code ?? 1,
        stdout: err.stdout ?? "",
        stderr: err.stderr ?? err.message,
        durationMs: Date.now() - startTime,
        timedOut: isTimeout,
        isolated: true,
        error: isTimeout ? "timeout" : "docker_failure",
      };
    }
  }

  // 5. Fallback ephemeral isolated execution (confined to workdir with sanitised env)
  logger.info({ workdir: config.workdir }, "Running sandbox in local process isolation mode");
  return new Promise<SandboxExecutionResult>((resolve) => {
    // Sanitize environment variables: strip secret tokens and credentials
    const cleanEnv: Record<string, string> = {
      NODE_ENV: "test",
      CI: "true",
      PATH: process.env["PATH"] ?? "",
      TMP: process.env["TMP"] ?? "",
      TEMP: process.env["TEMP"] ?? "",
    };

    const parts = command.split(" ");
    const bin = parts[0]!;
    const args = parts.slice(1);

    let stdoutData = "";
    let stderrData = "";
    let timedOut = false;

    const child = spawn(bin, args, {
      cwd: config.workdir,
      env: cleanEnv,
      shell: true,
    });

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdoutData += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderrData += chunk.toString();
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      const durationMs = Date.now() - startTime;
      resolve({
        success: code === 0 && !timedOut,
        exitCode: timedOut ? 124 : code ?? 1,
        stdout: stdoutData,
        stderr: stderrData,
        durationMs,
        timedOut,
        isolated: false,
        error: timedOut ? "timeout" : undefined,
      });
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({
        success: false,
        exitCode: 1,
        stdout: stdoutData,
        stderr: err.message,
        durationMs: Date.now() - startTime,
        timedOut: false,
        isolated: false,
        error: err.message,
      });
    });
  });
}
