import { z } from "zod";

export const FixProposalSchema = z.object({
  id: z.string(),
  findingId: z.string(),
  file: z.string(),
  patch: z.string(),
  explanation: z.string(),
  status: z.enum(["pending_approval", "approved", "rejected", "applied"]),
  validationStatus: z.enum(["passed", "failed", "untested"]),
  validationLogs: z.string().optional(),
  approvedBy: z.string().optional(),
  createdAt: z.string(),
});

export type FixProposal = z.infer<typeof FixProposalSchema>;

