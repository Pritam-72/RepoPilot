import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error"]).default("info"),

  // Database & Cache
  DATABASE_URL: z.string().default(process.env["DATABASE_URL"] ?? "postgresql://postgres:pritam@localhost:5432/repopilot?schema=public"),
  REDIS_URL: z.string().default(process.env["REDIS_URL"] ?? "redis://localhost:6379"),

  // GitHub App
  GITHUB_APP_ID: z.string().default("development-app-id"),
  GITHUB_PRIVATE_KEY: z.string().default("development-private-key"),
  GITHUB_WEBHOOK_SECRET: z.string().default("development-webhook-secret-16chars"),
  GITHUB_BENCHMARK_TOKEN: z.string().optional(),
  SESSION_SECRET: z.string().default("development-session-secret-16chars"),

  // LLM Providers (plan.md Section 6.3)
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().default(process.env["GEMINI_API_KEY"] ?? ""),
  ANTHROPIC_API_KEY: z.string().optional(),
  LLM_DEFAULT_PROVIDER: z.enum(["gemini", "anthropic"]).default("gemini"),
  LLM_REVIEW_MODEL: z.string().default("gemini-1.5-pro"),
  LLM_VERIFY_MODEL: z.string().default("gemini-1.5-flash"),
  LLM_TIMEOUT_MS: z.coerce.number().default(60000),
  LLM_MAX_RETRIES: z.coerce.number().default(3),

  // Review Behaviour & Hard Cost Guards
  MAX_COMMENTS_PER_PR: z.coerce.number().default(15),
  MIN_CONFIDENCE: z.coerce.number().default(0.7),
  MAX_REVIEW_FILES: z.coerce.number().default(60),
  MAX_DIFF_BYTES: z.coerce.number().default(1_000_000),
  MAX_TOKENS_PER_REVIEW: z.coerce.number().default(500000),
  AGENT_TIMEOUT_MS: z.coerce.number().default(120000),
  MAX_AGENT_CONCURRENCY: z.coerce.number().default(4),
  REVIEW_JOB_TIMEOUT_MS: z.coerce.number().default(300000),

  // Observability
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
});

export function getEnv(customEnv?: Record<string, string | undefined>) {
  const result = envSchema.safeParse(customEnv ?? process.env);
  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`❌ Invalid environment configuration:\n${missing}`);
  }
  return result.data;
}

export const env = getEnv();
export type Env = typeof env;
