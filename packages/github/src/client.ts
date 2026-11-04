import { App } from "@octokit/app";
import { Octokit } from "@octokit/rest";
import { logger } from "@acr/observability";

interface CachedClient {
  octokit: Octokit;
  expiresAt: number;
}

const clientCache = new Map<string, CachedClient>();

// Default token cache TTL: 50 minutes (GitHub installation tokens expire after 60 mins)
export const DEFAULT_INSTALLATION_TOKEN_TTL_MS = 50 * 60 * 1000;

/**
 * Clears the in-memory installation token cache.
 * Useful for tests or manual invalidation.
 */
export function clearInstallationTokenCache(): void {
  clientCache.clear();
}

/**
 * Returns the current number of cached installation clients.
 */
export function getInstallationCacheSize(): number {
  return clientCache.size;
}

/**
 * Creates or retrieves a cached Octokit REST client authenticated as a GitHub App installation.
 * Automatically caches clients until near expiry (default 50 mins) to avoid redundant token requests.
 */
export async function createInstallationOctokit(
  installationId: number,
  appId: number | string,
  privateKey: string,
  cacheTtlMs: number = DEFAULT_INSTALLATION_TOKEN_TTL_MS
): Promise<Octokit> {
  const cacheKey = `${appId}:${installationId}`;
  const now = Date.now();
  const cached = clientCache.get(cacheKey);

  if (cached && cached.expiresAt > now) {
    return cached.octokit;
  }

  const app = new App({ appId, privateKey });
  const octokitInstance = await app.getInstallationOctokit(installationId);
  const octokit = octokitInstance as unknown as Octokit;

  clientCache.set(cacheKey, {
    octokit,
    expiresAt: now + cacheTtlMs,
  });

  return octokit;
}

export interface RateLimitRetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  sleepFn?: (ms: number) => Promise<void>;
}

/**
 * Wraps a GitHub API call with rate limit & Retry-After handling.
 * Automatically recovers from HTTP 403 / 429 rate limit errors respecting
 * the Retry-After or x-ratelimit-reset headers.
 */
export async function withRateLimitRetry<T>(
  fn: () => Promise<T>,
  options: RateLimitRetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 1000;
  const maxDelayMs = options.maxDelayMs ?? 60_000;
  const sleep = options.sleepFn ?? ((ms: number) => new Promise((resolve) => setTimeout(resolve, ms)));

  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      const status = err?.status ?? err?.response?.status;
      const headers = err?.response?.headers ?? {};
      const isRateLimited = status === 403 || status === 429;

      if (!isRateLimited || attempt > maxRetries) {
        throw err;
      }

      // 1. Check Retry-After header (seconds)
      const retryAfterHeader = headers["retry-after"] ?? headers["Retry-After"];
      let waitMs = baseDelayMs * Math.pow(2, attempt - 1);

      if (retryAfterHeader) {
        const parsedSec = Number(retryAfterHeader);
        if (!isNaN(parsedSec) && parsedSec > 0) {
          waitMs = parsedSec * 1000;
        }
      } else if (headers["x-ratelimit-reset"]) {
        const resetEpochSec = Number(headers["x-ratelimit-reset"]);
        if (!isNaN(resetEpochSec)) {
          const deltaMs = resetEpochSec * 1000 - Date.now();
          if (deltaMs > 0 && deltaMs <= maxDelayMs) {
            waitMs = deltaMs;
          }
        }
      }

      // Cap delay to prevent excessive wait
      waitMs = Math.min(waitMs, maxDelayMs);

      logger.warn(
        { attempt, maxRetries, waitMs, status },
        "GitHub API rate limit hit, retrying after backoff"
      );

      await sleep(waitMs);
    }
  }
}
