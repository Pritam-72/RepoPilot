import { z } from "zod";

export const ReviewJobPayloadSchema = z.object({
  reviewJobId: z.string(),
  repositoryId: z.string(),
  installationId: z.string(),
  pullRequestNumber: z.number(),
  headSha: z.string(),
  deliveryId: z.string(),
});

export const JobStatusSchema = z.enum([
  "queued", "fetching", "contextualizing", "planning",
  "analyzing", "verifying", "publishing", "completed",
  "partially_completed", "failed", "cancelled",
]);

export type ReviewJobPayload = z.infer<typeof ReviewJobPayloadSchema>;
export type JobStatus = z.infer<typeof JobStatusSchema>;
