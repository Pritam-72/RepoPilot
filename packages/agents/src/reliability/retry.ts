import { logger } from "@acr/observability";
import { classifyError } from "./error-classifier.js";

export interface RetryOptions {
  maxRetries?: number | undefined;
  maxAttempts?: number | undefined;
  baseDelayMs?: number | undefined;
  initialDelayMs?: number | undefined;
  maxDelayMs?: number | undefined;
  jitter?: boolean | undefined;
  operationName?: string | undefined;
  shouldRetry?: ((error: unknown, attempt: number) => boolean) | undefined;
}

/**
 * Runs a function with strictly bounded retries and exponential backoff with jitter.
 * Non-retryable / permanent errors are rejected immediately without retry loops.
 */
export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries =
    options.maxAttempts !== undefined
      ? Math.max(0, options.maxAttempts - 1)
      : options.maxRetries ?? 3;
  const baseDelayMs = options.initialDelayMs ?? options.baseDelayMs ?? 1000;
  const maxDelayMs = options.maxDelayMs ?? 10000;
  const opName = options.operationName ?? "operation";
  const useJitter = options.jitter ?? true;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastError = err;

      if (attempt > maxRetries) {
        break;
      }

      const classification = classifyError(err);
      const isRetryable =
        options.shouldRetry ? options.shouldRetry(err, attempt) : classification.retryable;

      if (!isRetryable) {
        logger.info(
          {
            operation: opName,
            attempt,
            reason: classification.reason,
            error: err instanceof Error ? err.message : String(err),
          },
          "Non-retryable error detected, failing fast without retry"
        );
        throw err;
      }

      // Calculate exponential backoff with jitter
      const exponential = baseDelayMs * Math.pow(2, attempt - 1);
      const jitter = useJitter ? Math.random() * 200 : 0;
      const backoffMs = Math.min(maxDelayMs, exponential + jitter);

      logger.warn(
        {
          operation: opName,
          attempt,
          maxRetries,
          backoffMs: Math.round(backoffMs),
          error: err instanceof Error ? err.message : String(err),
          reason: classification.reason,
        },
        "Retryable transient error, sleeping before backoff retry"
      );

      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  throw lastError;
}

/**
 * Executes an async operation with an abort signal timeout.
 */
export async function withTimeout<T>(
  fnOrPromise: ((signal: AbortSignal) => Promise<T>) | Promise<T>,
  timeoutMs: number,
  operationName = "operation"
): Promise<T> {
  const controller = new AbortController();
  let timer: NodeJS.Timeout | null = null;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      const err = new Error(`Operation '${operationName}' timed out after ${timeoutMs}ms`);
      err.name = "TimeoutError";
      reject(err);
    }, timeoutMs);
  });

  try {
    const executed =
      typeof fnOrPromise === "function" ? fnOrPromise(controller.signal) : fnOrPromise;
    return await Promise.race([executed, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
