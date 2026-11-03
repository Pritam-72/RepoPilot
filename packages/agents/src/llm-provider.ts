import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { z, ZodType } from "zod";
import { logger } from "@acr/observability";

export interface LLMProviderOptions {
  model?: string | undefined;
  apiKey?: string | undefined;
  timeoutMs?: number | undefined;
  fallbackModels?: string[] | undefined;
  maxRetriesPerModel?: number | undefined;
}

export const DEFAULT_FALLBACK_MODELS = [
  "gemini-2.0-flash-exp",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

/**
 * Generates structured output from an LLM with automatic model routing and fallback.
 * Tries the primary model first, then gracefully attempts fallbacks if rate-limited or timed out.
 */
export async function generateStructuredOutput<T extends ZodType>(
  prompt: string,
  schema: T,
  opts: LLMProviderOptions = {}
): Promise<z.infer<T>> {
  const primaryModel = opts.model ?? "gemini-2.0-flash-exp";
  const apiKey = opts.apiKey ?? process.env["GEMINI_API_KEY"] ?? "";
  const timeoutMs = opts.timeoutMs ?? 30_000;
  const modelsToTry = [
    primaryModel,
    ...(opts.fallbackModels ?? DEFAULT_FALLBACK_MODELS).filter((m) => m !== primaryModel),
  ];

  const google = createGoogleGenerativeAI({ apiKey });
  let lastError: Error | null = null;

  for (const currentModel of modelsToTry) {
    const modelStart = Date.now();
    logger.debug({ model: currentModel, promptLength: prompt.length }, "Attempting structured LLM request");

    try {
      const timeoutSignal = AbortSignal.timeout(timeoutMs);

      const { object } = await generateObject({
        model: google(currentModel),
        schema,
        prompt,
        abortSignal: timeoutSignal,
      });

      const durationMs = Date.now() - modelStart;
      logger.debug({ model: currentModel, durationMs }, "Structured LLM request succeeded");
      return object;
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const durationMs = Date.now() - modelStart;

      logger.warn(
        {
          model: currentModel,
          error: lastError.message,
          durationMs,
          remainingModels: modelsToTry.slice(modelsToTry.indexOf(currentModel) + 1),
        },
        "Model request failed, attempting fallback"
      );
    }
  }

  throw lastError ?? new Error("All configured LLM models failed");
}
