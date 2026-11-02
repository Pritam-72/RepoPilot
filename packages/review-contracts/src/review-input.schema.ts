import { z } from "zod";

export const ReviewAgentInputSchema = z.object({
  repository: z.object({
    owner: z.string(),
    name: z.string(),
    repositoryId: z.number(),
  }),
  pullRequest: z.object({
    number: z.number(),
    baseSha: z.string(),
    headSha: z.string(),
    title: z.string(),
    description: z.string().optional(),
  }),
  changedFiles: z.array(z.object({
    path: z.string(),
    status: z.string(),
    patch: z.string().optional(),
    additions: z.number(),
    deletions: z.number(),
  })),
  context: z.array(z.object({
    path: z.string(),
    startLine: z.number(),
    endLine: z.number(),
    content: z.string(),
    sha: z.string(),
  })),
  reviewPolicy: z.object({
    enabledCategories: z.array(z.string()),
    minimumConfidence: z.number().min(0).max(1),
  }),
});

export type ReviewAgentInput = z.infer<typeof ReviewAgentInputSchema>;
