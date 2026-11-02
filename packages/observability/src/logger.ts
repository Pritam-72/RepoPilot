import pino from "pino";

const REDACT_PATHS = [
  "*.authorization",
  "*.token",
  "*.privateKey",
  "*.apiKey",
  "*.GITHUB_PRIVATE_KEY",
  "*.GOOGLE_GENERATIVE_AI_API_KEY",
  "*.ANTHROPIC_API_KEY",
  "*.SESSION_SECRET",
];

export const createLogger = (name: string, correlationId?: string) =>
  pino({
    name,
    level: process.env["LOG_LEVEL"] ?? "info",
    redact: { paths: REDACT_PATHS, censor: "[REDACTED]" },
  }).child({ correlationId });

export const logger = createLogger("acr");
