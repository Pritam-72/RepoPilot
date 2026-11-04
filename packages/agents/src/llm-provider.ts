import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import type { z, ZodType } from "zod";
import { logger } from "@acr/observability";

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface LLMCallResult<T> {
  output: T;
  model: string;
  provider: "gemini" | "anthropic" | "mock";
  usage: TokenUsage;
  durationMs: number;
}

export interface LLMProviderOptions {
  model?: string | undefined;
  apiKey?: string | undefined;
  timeoutMs?: number | undefined;
  maxRetries?: number | undefined;
  temperature?: number | undefined;
  fallbackModels?: string[] | undefined;
}

export interface LLMProvider {
  readonly name: string;
  generateStructured<T extends ZodType>(
    prompt: string,
    schema: T,
    opts?: LLMProviderOptions
  ): Promise<LLMCallResult<z.infer<T>>>;
}

/**
 * Gemini adapter implementation of LLMProvider.
 */
export class GeminiProvider implements LLMProvider {
  public readonly name = "gemini";

  async generateStructured<T extends ZodType>(
    prompt: string,
    schema: T,
    opts: LLMProviderOptions = {}
  ): Promise<LLMCallResult<z.infer<T>>> {
    const apiKey = opts.apiKey ?? process.env["GOOGLE_GENERATIVE_AI_API_KEY"] ?? process.env["GEMINI_API_KEY"] ?? "";
    const primaryModel = opts.model ?? process.env["LLM_REVIEW_MODEL"] ?? "gemini-2.0-flash-exp";
    const timeoutMs = opts.timeoutMs ?? Number(process.env["LLM_TIMEOUT_MS"] ?? "60000");
    const maxRetries = opts.maxRetries ?? Number(process.env["LLM_MAX_RETRIES"] ?? "3");
    const temperature = opts.temperature ?? 0.1;

    const google = createGoogleGenerativeAI({ apiKey });
    const modelsToTry = [
      primaryModel,
      ...(opts.fallbackModels ?? ["gemini-1.5-flash", "gemini-1.5-pro"]).filter((m) => m !== primaryModel),
    ];

    let lastError: Error | null = null;
    const startOverall = Date.now();

    for (const currentModel of modelsToTry) {
      let attempts = 0;
      while (attempts <= maxRetries) {
        attempts++;
        const modelStart = Date.now();
        try {
          const timeoutSignal = AbortSignal.timeout(timeoutMs);
          const result = await generateObject({
            model: google(currentModel),
            schema,
            prompt,
            temperature,
            abortSignal: timeoutSignal,
          });

          const durationMs = Date.now() - modelStart;
          const usage: TokenUsage = {
            promptTokens: result.usage?.promptTokens ?? Math.ceil(prompt.length / 4),
            completionTokens: result.usage?.completionTokens ?? 150,
            totalTokens: result.usage?.totalTokens ?? Math.ceil(prompt.length / 4) + 150,
          };

          logger.debug({ model: currentModel, durationMs, usage }, "Gemini structured request succeeded");

          return {
            output: result.object,
            model: currentModel,
            provider: "gemini",
            usage,
            durationMs,
          };
        } catch (err: any) {
          lastError = err instanceof Error ? err : new Error(String(err));
          const durationMs = Date.now() - modelStart;
          const isRetryable =
            err?.status === 429 ||
            err?.status === 503 ||
            err?.statusCode === 429 ||
            err?.name === "TimeoutError";

          if (isRetryable && attempts <= maxRetries) {
            const backoffMs = Math.min(1000 * Math.pow(2, attempts - 1), 8000);
            logger.warn({ model: currentModel, attempt: attempts, backoffMs }, "Gemini request retryable error, backing off");
            await new Promise((r) => setTimeout(r, backoffMs));
            continue;
          }

          logger.warn(
            { model: currentModel, error: lastError.message, durationMs },
            "Gemini model failed, trying fallback"
          );
          break; // Move to next model in fallback list
        }
      }
    }

    throw lastError ?? new Error("All configured Gemini models failed");
  }
}

/**
 * Anthropic Claude adapter implementation of LLMProvider.
 */
export class ClaudeProvider implements LLMProvider {
  public readonly name = "anthropic";

  async generateStructured<T extends ZodType>(
    prompt: string,
    schema: T,
    opts: LLMProviderOptions = {}
  ): Promise<LLMCallResult<z.infer<T>>> {
    const apiKey = opts.apiKey ?? process.env["ANTHROPIC_API_KEY"] ?? "";
    const primaryModel = opts.model ?? process.env["LLM_REVIEW_MODEL"] ?? "claude-3-5-sonnet-20241022";
    const timeoutMs = opts.timeoutMs ?? Number(process.env["LLM_TIMEOUT_MS"] ?? "60000");
    const maxRetries = opts.maxRetries ?? Number(process.env["LLM_MAX_RETRIES"] ?? "3");
    const temperature = opts.temperature ?? 0.1;

    const anthropic = createAnthropic({ apiKey });
    const modelsToTry = [
      primaryModel,
      ...(opts.fallbackModels ?? ["claude-3-5-haiku-20241022"]).filter((m) => m !== primaryModel),
    ];

    let lastError: Error | null = null;

    for (const currentModel of modelsToTry) {
      let attempts = 0;
      while (attempts <= maxRetries) {
        attempts++;
        const modelStart = Date.now();
        try {
          const timeoutSignal = AbortSignal.timeout(timeoutMs);
          const result = await generateObject({
            model: anthropic(currentModel) as any,
            schema,
            prompt,
            temperature,
            abortSignal: timeoutSignal,
          });

          const durationMs = Date.now() - modelStart;
          const usage: TokenUsage = {
            promptTokens: result.usage?.promptTokens ?? Math.ceil(prompt.length / 4),
            completionTokens: result.usage?.completionTokens ?? 150,
            totalTokens: result.usage?.totalTokens ?? Math.ceil(prompt.length / 4) + 150,
          };

          logger.debug({ model: currentModel, durationMs, usage }, "Claude structured request succeeded");

          return {
            output: result.object,
            model: currentModel,
            provider: "anthropic",
            usage,
            durationMs,
          };
        } catch (err: any) {
          lastError = err instanceof Error ? err : new Error(String(err));
          const durationMs = Date.now() - modelStart;
          const isRetryable =
            err?.status === 429 ||
            err?.status === 529 ||
            err?.statusCode === 429 ||
            err?.name === "TimeoutError";

          if (isRetryable && attempts <= maxRetries) {
            const backoffMs = Math.min(1000 * Math.pow(2, attempts - 1), 8000);
            logger.warn({ model: currentModel, attempt: attempts, backoffMs }, "Claude request retryable error, backing off");
            await new Promise((r) => setTimeout(r, backoffMs));
            continue;
          }

          logger.warn(
            { model: currentModel, error: lastError.message, durationMs },
            "Claude model failed, trying fallback"
          );
          break;
        }
      }
    }

    throw lastError ?? new Error("All configured Claude models failed");
  }
}

/**
 * Mock provider for testing and offline execution.
 */
export class MockLLMProvider implements LLMProvider {
  public readonly name = "mock";
  private cannedResponse: unknown;

  constructor(cannedResponse?: unknown) {
    this.cannedResponse = cannedResponse ?? { findings: [], summary: "Default mock review complete" };
  }

  public setCannedResponse(response: unknown): void {
    this.cannedResponse = response;
  }

  async generateStructured<T extends ZodType>(
    prompt: string,
    schema: T,
    _opts?: LLMProviderOptions
  ): Promise<LLMCallResult<z.infer<T>>> {
    const parsed = schema.parse(this.cannedResponse);
    return {
      output: parsed,
      model: "mock-model",
      provider: "mock",
      usage: {
        promptTokens: Math.ceil(prompt.length / 4),
        completionTokens: 50,
        totalTokens: Math.ceil(prompt.length / 4) + 50,
      },
      durationMs: 5,
    };
  }
}

/**
 * Factory function to get active LLMProvider based on configuration or argument.
 * Swapping providers requires only setting LLM_DEFAULT_PROVIDER="anthropic" | "gemini".
 */
export function getLLMProvider(providerName?: string): LLMProvider {
  const chosen = (providerName ?? process.env["LLM_DEFAULT_PROVIDER"] ?? "gemini").toLowerCase();

  if (chosen === "anthropic" || chosen === "claude") {
    return new ClaudeProvider();
  }

  if (chosen === "mock") {
    return new MockLLMProvider();
  }

  return new GeminiProvider();
}

/**
 * Backward-compatible helper for existing agent calls.
 */
export async function generateStructuredOutput<T extends ZodType>(
  prompt: string,
  schema: T,
  opts: LLMProviderOptions = {}
): Promise<z.infer<T>> {
  const provider = getLLMProvider();
  const res = await provider.generateStructured(prompt, schema, opts);
  return res.output;
}
