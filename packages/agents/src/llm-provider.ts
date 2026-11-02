import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { z, ZodType } from "zod";
import { logger } from "@acr/observability";

export interface LLMProviderOptions {
  model?: string;
  apiKey?: string;
  timeoutMs?: number;
}

/**
 * Generates structured output from Gemini, validated against a Zod schema.
 * Throws on timeout or schema validation failure.
 */
export async function generateStructuredOutput<T extends ZodType>(
  prompt: string,
  schema: T,
  opts: LLMProviderOptions = {}
): Promise<z.infer<T>> {
  const {
    model = "gemini-2.0-flash-exp",
    apiKey = process.env["GEMINI_API_KEY"] ?? "",
    timeoutMs = 30_000,
  } = opts;

  const google = createGoogleGenerativeAI({ apiKey });

  const timeoutSignal = AbortSignal.timeout(timeoutMs);

  logger.debug({ model, promptLength: prompt.length }, "LLM request start");

  const { object } = await generateObject({
    model: google(model),
    schema,
    prompt,
    abortSignal: timeoutSignal,
  });

  return object;
}

