import type { Job } from "bullmq";
import { ReviewJobPayloadSchema, type ReviewJobPayload } from "@acr/review-contracts";
import { logger } from "@acr/observability";

export async function processReviewJob(job: Job<ReviewJobPayload>): Promise<{ processed: boolean; headSha: string }> {
  const log = logger.child({
    jobId: job.id,
    deliveryId: job.data.deliveryId,
    headSha: job.data.headSha,
  });

  log.info("Validating and processing review job payload");

  const validated = ReviewJobPayloadSchema.parse(job.data);

  log.info(
    { repo: validated.repositoryId, pr: validated.pullRequestNumber },
    "Review job claimed by worker"
  );

  return {
    processed: true,
    headSha: validated.headSha,
  };
}
