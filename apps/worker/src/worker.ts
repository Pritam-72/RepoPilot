import { Worker } from "bullmq";
import { REVIEW_QUEUE_NAME, createRedisConnection } from "./queues/review-queue.js";
import { processReviewJob } from "./processors/test-job.processor.js";
import { logger } from "@acr/observability";

export function createReviewWorker(connection = createRedisConnection()) {
  const worker = new Worker(
    REVIEW_QUEUE_NAME,
    async (job) => {
      return processReviewJob(job);
    },
    {
      connection,
      concurrency: Number(process.env["MAX_AGENT_CONCURRENCY"] ?? 4),
    }
  );

  worker.on("completed", (job) => {
    logger.info({ jobId: job.id }, "Review job completed successfully");
  });

  worker.on("failed", (job, err) => {
    logger.error({ jobId: job?.id, err }, "Review job failed");
  });

  return worker;
}

if (process.env["NODE_ENV"] !== "test" && process.argv[1]?.includes("worker")) {
  createReviewWorker();
  logger.info("BullMQ Review Worker process listening for jobs");
}
