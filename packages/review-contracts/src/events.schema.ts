import { z } from "zod";

// GitHub PR Webhook payload (subset we need)
export const PullRequestWebhookPayloadSchema = z.object({
  action: z.string(),
  number: z.number(),
  pull_request: z.object({
    title: z.string().optional(),
    user: z.object({ login: z.string() }).optional(),
    head: z.object({ sha: z.string() }),
    base: z.object({ sha: z.string() }),
  }),
  repository: z.object({
    id: z.number(),
    name: z.string(),
    owner: z.object({ login: z.string() }),
  }),
  installation: z.object({ id: z.number() }),
});

export type PullRequestWebhookPayload = z.infer<typeof PullRequestWebhookPayloadSchema>;

export const ReviewJobPayloadSchema = z.object({
  reviewJobId: z.string(),
  repositoryId: z.string(),
  installationId: z.string(),
  pullRequestNumber: z.number(),
  headSha: z.string(),
  deliveryId: z.string(),
  dryRun: z.boolean().optional(),
});

export const JobStatusSchema = z.enum([
  "queued", "fetching", "contextualizing", "planning",
  "analyzing", "verifying", "publishing", "completed",
  "partially_completed", "failed", "cancelled",
]);

export type ReviewJobPayload = z.infer<typeof ReviewJobPayloadSchema>;
export type JobStatus = z.infer<typeof JobStatusSchema>;
