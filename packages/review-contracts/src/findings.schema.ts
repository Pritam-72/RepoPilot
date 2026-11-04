import { z } from "zod";

export const FindingSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(200),
  category: z.enum(["correctness", "security", "performance", "maintainability", "testing", "dependency"]),
  severity: z.enum(["critical", "high", "medium", "low", "informational"]),
  confidence: z.number().min(0).max(1),
  file: z.string().min(1),
  line: z.number().int().positive(),
  endLine: z.number().int().positive().optional(),
  description: z.string().min(1),
  evidence: z.string().min(1),
  impact: z.string().optional(),
  recommendation: z.string().optional(),
  ruleId: z.string().optional(),
  verificationStatus: z.enum(["unverified", "verified", "rejected"]),
});

export const AgentOutputSchema = z.object({
  agent: z.string(),
  summary: z.string(),
  findings: z.array(FindingSchema),
  status: z.enum(["completed", "partial", "failed"]),
});

export type Finding = z.infer<typeof FindingSchema>;
export type AgentOutput = z.infer<typeof AgentOutputSchema>;

/**
 * Finding schema strictly adhering to plan.md Section 8.1
 */
export const FindingV2Schema = z
  .object({
    title: z.string().min(5).max(120),
    category: z.enum(["bug", "security", "error-handling", "performance", "test", "quality"]),
    severity: z.enum(["critical", "high", "medium", "low"]),
    file: z.string(),
    lineStart: z.number().int().positive(),
    lineEnd: z.number().int().positive(),
    explanation: z.string().min(20),
    evidenceSnippet: z.string().min(1),
    impact: z.string(),
    suggestion: z.string(),
    confidence: z.number().min(0).max(1),
    sourceAgent: z.string(),
  })
  .refine((f) => f.lineEnd >= f.lineStart, {
    message: "lineEnd must be greater than or equal to lineStart",
  });

export type FindingV2 = z.infer<typeof FindingV2Schema>;

/**
 * AgentRun schema strictly adhering to plan.md Section 8.2
 */
export const AgentRunSchema = z.object({
  agent: z.string(),
  model: z.string(),
  promptVersion: z.string(),
  status: z.enum(["success", "failed", "timeout"]),
  attempts: z.number().int().nonnegative(),
  tokens: z.object({
    promptTokens: z.number().nonnegative(),
    completionTokens: z.number().nonnegative(),
    totalTokens: z.number().nonnegative(),
  }),
  durationMs: z.number().nonnegative(),
  error: z.string().optional(),
});

export type AgentRun = z.infer<typeof AgentRunSchema>;

