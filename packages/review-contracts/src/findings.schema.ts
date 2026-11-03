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
