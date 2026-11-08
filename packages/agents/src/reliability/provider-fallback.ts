import { logger } from "@acr/observability";
import type { ZodType, z } from "zod";
import type { LLMProvider, LLMProviderOptions, LLMCallResult } from "../llm-provider.js";
import { CircuitBreaker, CircuitBreakerOpenError } from "./circuit-breaker.js";
import { withRetry } from "./retry.js";

export interface FallbackChainOptions {
  primary: LLMProvider;
  secondary?: LLMProvider | undefined;
  maxRetries?: number | undefined;
  baseDelayMs?: number | undefined;
}

/**
 * Resilient LLM Provider executing a circuit-broken fallback chain.
 * If the primary provider (e.g. Gemini) trips its breaker or fails after bounded retries,
 * it falls back cleanly to the secondary provider (e.g. Claude) with structured telemetry.
 */
export class ResilientLLMProviderChain implements LLMProvider {
  public readonly name: string;
  public readonly primary: LLMProvider;
  public readonly secondary?: LLMProvider | undefined;

  private primaryBreaker: CircuitBreaker;
  private secondaryBreaker?: CircuitBreaker | undefined;
  private maxRetries: number;
  private baseDelayMs: number;

  constructor(
    primaryOrOptions: LLMProvider | FallbackChainOptions,
    secondary?: LLMProvider,
    options: Omit<FallbackChainOptions, "primary" | "secondary"> & {
      failureThreshold?: number;
      resetTimeoutMs?: number;
    } = {}
  ) {
    if ("primary" in primaryOrOptions) {
      this.primary = primaryOrOptions.primary;
      this.secondary = primaryOrOptions.secondary;
      this.maxRetries = primaryOrOptions.maxRetries ?? 2;
      this.baseDelayMs = primaryOrOptions.baseDelayMs ?? 500;
    } else {
      this.primary = primaryOrOptions;
      this.secondary = secondary;
      this.maxRetries = options.maxRetries ?? 2;
      this.baseDelayMs = options.baseDelayMs ?? 500;
    }

    this.name = `resilient-chain(${this.primary.name}${this.secondary ? `->${this.secondary.name}` : ""})`;

    const failureThreshold = (primaryOrOptions as any).failureThreshold ?? options.failureThreshold ?? 3;
    const resetTimeoutMs = (primaryOrOptions as any).resetTimeoutMs ?? options.resetTimeoutMs ?? 15000;

    this.primaryBreaker = new CircuitBreaker({
      name: `llm-${this.primary.name}`,
      failureThreshold,
      resetTimeoutMs,
    });

    if (this.secondary) {
      this.secondaryBreaker = new CircuitBreaker({
        name: `llm-${this.secondary.name}`,
        failureThreshold,
        resetTimeoutMs,
      });
    }
  }

  public getActiveProviderName(): string {
    if (this.primaryBreaker.getState() === "OPEN" && this.secondary) {
      return this.secondary.name;
    }
    return this.primary.name;
  }

  public async execute<T>(fn: (provider: LLMProvider) => Promise<T>): Promise<T> {
    try {
      return await this.primaryBreaker.execute(() =>
        withRetry(() => fn(this.primary), {
          maxRetries: this.maxRetries,
          baseDelayMs: this.baseDelayMs,
          operationName: `execute:${this.primary.name}`,
        })
      );
    } catch (primaryErr: any) {
      if (!this.secondary) {
        throw primaryErr;
      }
      logger.info(
        {
          fallbackProvider: this.secondary.name,
          primaryError: primaryErr?.message ?? String(primaryErr),
        },
        "Switching execution to fallback provider in chain"
      );
      const secBreaker = this.secondaryBreaker!;
      return await secBreaker.execute(() =>
        withRetry(() => fn(this.secondary!), {
          maxRetries: this.maxRetries,
          baseDelayMs: this.baseDelayMs,
          operationName: `execute:${this.secondary!.name}`,
        })
      );
    }
  }

  async generateStructured<T extends ZodType>(
    prompt: string,
    schema: T,
    opts?: LLMProviderOptions
  ): Promise<LLMCallResult<z.infer<T>>> {
    // 1. Try Primary Provider with circuit breaker and bounded retries
    try {
      return await this.primaryBreaker.execute(() =>
        withRetry(
          () => this.primary.generateStructured(prompt, schema, opts),
          {
            maxRetries: this.maxRetries,
            baseDelayMs: this.baseDelayMs,
            operationName: `generateStructured:${this.primary.name}`,
          }
        )
      );
    } catch (primaryErr: any) {
      const isBreakerTrip = primaryErr instanceof CircuitBreakerOpenError;
      logger.warn(
        {
          primaryProvider: this.primary.name,
          error: primaryErr.message,
          circuitOpen: isBreakerTrip,
          hasFallback: !!this.secondary,
        },
        "Primary LLM provider failed, evaluating fallback"
      );

      // If no secondary provider is configured, rethrow
      if (!this.secondary) {
        throw primaryErr;
      }

      // 2. Fallback to Secondary Provider
      logger.info(
        {
          fallbackProvider: this.secondary.name,
          primaryError: primaryErr.message,
        },
        "Switching execution to fallback provider in chain"
      );

      const secBreaker = this.secondaryBreaker!;
      return await secBreaker.execute(() =>
        withRetry(
          () => this.secondary!.generateStructured(prompt, schema, opts),
          {
            maxRetries: this.maxRetries,
            baseDelayMs: this.baseDelayMs,
            operationName: `generateStructured:${this.secondary!.name}`,
          }
        )
      );
    }
  }

  public getPrimaryCircuitState() {
    return this.primaryBreaker.getState();
  }

  public getSecondaryCircuitState() {
    return this.secondaryBreaker ? this.secondaryBreaker.getState() : "CLOSED";
  }
}
