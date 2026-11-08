import { logger } from "@acr/observability";

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerOptions {
  name?: string | undefined;
  failureThreshold?: number | undefined; // Number of failures to trip breaker
  resetTimeoutMs?: number | undefined;   // Cool-down period in ms
}

export class CircuitBreakerOpenError extends Error {
  constructor(public readonly circuitName: string, public readonly resetTimeRemainingMs: number) {
    super(`Circuit breaker '${circuitName}' is OPEN (cooling down for ${resetTimeRemainingMs}ms)`);
    this.name = "CircuitBreakerOpenError";
  }
}

export class CircuitBreaker {
  public readonly name: string;
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;

  private state: CircuitState = "CLOSED";
  private consecutiveFailures = 0;
  private lastFailureTime = 0;

  constructor(options: CircuitBreakerOptions = {}) {
    this.name = options.name ?? "circuit-breaker";
    this.failureThreshold = options.failureThreshold ?? 3;
    this.resetTimeoutMs = options.resetTimeoutMs ?? 15000;
  }

  public getState(): CircuitState {
    if (this.state === "OPEN") {
      const elapsed = Date.now() - this.lastFailureTime;
      if (elapsed >= this.resetTimeoutMs) {
        this.state = "HALF_OPEN";
        logger.info({ circuit: this.name }, "Circuit breaker state changed: OPEN -> HALF_OPEN");
      }
    }
    return this.state;
  }

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    const currentState = this.getState();

    if (currentState === "OPEN") {
      const remaining = Math.max(0, this.resetTimeoutMs - (Date.now() - this.lastFailureTime));
      throw new CircuitBreakerOpenError(this.name, remaining);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure(err);
      throw err;
    }
  }

  private onSuccess(): void {
    if (this.state === "HALF_OPEN") {
      logger.info({ circuit: this.name }, "Circuit breaker state changed: HALF_OPEN -> CLOSED");
    }
    this.state = "CLOSED";
    this.consecutiveFailures = 0;
  }

  private onFailure(err: unknown): void {
    this.consecutiveFailures++;
    this.lastFailureTime = Date.now();

    if (this.state === "HALF_OPEN" || this.consecutiveFailures >= this.failureThreshold) {
      this.state = "OPEN";
      logger.warn(
        {
          circuit: this.name,
          consecutiveFailures: this.consecutiveFailures,
          threshold: this.failureThreshold,
          error: err instanceof Error ? err.message : String(err),
        },
        "Circuit breaker tripped: CLOSED/HALF_OPEN -> OPEN"
      );
    }
  }

  public reset(): void {
    this.state = "CLOSED";
    this.consecutiveFailures = 0;
    this.lastFailureTime = 0;
  }
}
