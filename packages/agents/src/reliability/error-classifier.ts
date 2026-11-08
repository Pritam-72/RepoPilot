export type ErrorClassificationType = "transient" | "permanent";

export interface ErrorClassification {
  type: ErrorClassificationType;
  retryable: boolean;
  reason: string;
  statusCode?: number | undefined;
}

/**
 * Classifies an error as transient (retryable) or permanent (non-retryable).
 * Strictly adheres to plan.md Phase 6 and Section 12 rule 3.
 */
export function classifyError(error: unknown): ErrorClassification {
  if (!error) {
    return {
      type: "permanent",
      retryable: false,
      reason: "Unknown empty error",
    };
  }

  const err = error as any;
  const message = String(err.message ?? err);
  const status =
    typeof err.status === "number"
      ? err.status
      : typeof err.statusCode === "number"
      ? err.statusCode
      : undefined;

  // 1. Check HTTP status code
  if (status !== undefined) {
    if (status === 429 || status === 502 || status === 503 || status === 504 || status === 529) {
      return {
        type: "transient",
        retryable: true,
        reason: `HTTP ${status}: Transient upstream capacity or rate-limit issue`,
        statusCode: status,
      };
    }
    if (status === 500) {
      return {
        type: "transient",
        retryable: true,
        reason: "HTTP 500: Internal server error, potentially transient",
        statusCode: 500,
      };
    }
    if (status === 401 || status === 403) {
      return {
        type: "permanent",
        retryable: false,
        reason: `HTTP ${status}: Authentication or authorization failure`,
        statusCode: status,
      };
    }
    if (status === 400 || status === 404 || status === 422) {
      return {
        type: "permanent",
        retryable: false,
        reason: `HTTP ${status}: Invalid client request or missing resource`,
        statusCode: status,
      };
    }
  }

  // 2. Check error names and network codes
  const name = String(err.name ?? "");
  const code = String(err.code ?? "");

  if (
    name === "TimeoutError" ||
    name === "AbortError" ||
    code === "ETIMEDOUT" ||
    code === "ECONNRESET" ||
    code === "ECONNREFUSED" ||
    code === "EPIPE" ||
    code === "UND_ERR_CONNECT_TIMEOUT" ||
    code === "ENOTFOUND"
  ) {
    return {
      type: "transient",
      retryable: true,
      reason: `Network/Timeout error (${name || code}): connection interrupted`,
    };
  }

  // 3. String content and status pattern checks
  const lowerMsg = message.toLowerCase();

  if (
    /\b(429|500|502|503|504|529)\b/.test(message) ||
    lowerMsg.includes("rate limit") ||
    lowerMsg.includes("quota exceeded") ||
    lowerMsg.includes("overloaded") ||
    lowerMsg.includes("temporarily unavailable") ||
    lowerMsg.includes("timeout") ||
    lowerMsg.includes("etimedout") ||
    lowerMsg.includes("econnreset") ||
    lowerMsg.includes("socket hang up")
  ) {
    return {
      type: "transient",
      retryable: true,
      reason: `Transient upstream or rate-limit issue: ${message}`,
      statusCode: status,
    };
  }

  if (
    /\b(400|401|403|404|422)\b/.test(message) ||
    lowerMsg.includes("unregistered callers") ||
    lowerMsg.includes("unauthorized") ||
    lowerMsg.includes("forbidden") ||
    lowerMsg.includes("permission_denied") ||
    lowerMsg.includes("invalid api key") ||
    lowerMsg.includes("syntaxerror") ||
    lowerMsg.includes("zoderror") ||
    lowerMsg.includes("validation error")
  ) {
    return {
      type: "permanent",
      retryable: false,
      reason: `Permanent client configuration error: ${message}`,
      statusCode: status,
    };
  }

  // Default: treat unknown exceptions as permanent to prevent blind retry loops
  return {
    type: "permanent",
    retryable: false,
    reason: `Unclassified error: ${message}`,
    statusCode: status,
  };
}
