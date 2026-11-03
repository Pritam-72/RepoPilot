import { z } from "zod";

export const TestProposalSchema = z.object({
  id: z.string(),
  findingId: z.string(),
  file: z.string(),
  testFile: z.string(),
  framework: z.enum(["vitest", "jest", "pytest"]),
  testCode: z.string(),
  explanation: z.string(),
  executionStatus: z.enum(["pending", "passed", "failed", "untested"]),
  executionLogs: z.string().optional(),
  createdAt: z.string(),
});

export type TestProposal = z.infer<typeof TestProposalSchema>;
