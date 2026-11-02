import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().default("postgresql://acr:acr_secret@localhost:5432/code_reviewer"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  GITHUB_APP_ID: z.string().default("development-app-id"),
  GITHUB_PRIVATE_KEY: z.string().default("development-private-key"),
  GITHUB_WEBHOOK_SECRET: z.string().default("development-webhook-secret-16chars"),
  SESSION_SECRET: z.string().default("development-session-secret-16chars"),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error"]).default("info"),
  MAX_REVIEW_FILES: z.coerce.number().default(50),
  MAX_DIFF_BYTES: z.coerce.number().default(1_000_000),
  MAX_AGENT_CONCURRENCY: z.coerce.number().default(4),
  REVIEW_JOB_TIMEOUT_MS: z.coerce.number().default(300_000),
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
