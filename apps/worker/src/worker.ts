import { Worker } from "bullmq";
import {
  REVIEW_QUEUE_NAME,
  REVIEW_DLQ_NAME,
  createRedisConnection,
  createReviewDeadLetterQueue,
} from "./queues/review-queue.js";
import { processReviewJob } from "./processors/test-job.processor.js";
import { logger } from "@acr/observability";

export function createReviewWorker(connection = createRedisConnection()) {
  const dlq = createReviewDeadLetterQueue(connection);
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

  worker.on("failed", async (job, err) => {
    logger.error({ jobId: job?.id, err }, "Review job failed");
    if (job && job.attemptsMade >= (job.opts.attempts ?? 3)) {
      try {
        await dlq.add("dead-letter-job", {
          ...job.data,
          errorReason: err instanceof Error ? err.message : String(err),
          failedAt: new Date().toISOString(),
        });
        logger.warn({ jobId: job.id, dlq: REVIEW_DLQ_NAME }, "Review job moved to Dead Letter Queue");
      } catch (dlqErr) {
        logger.error({ jobId: job.id, dlqErr }, "Failed to route review job to DLQ");
      }
    }
  });

  return worker;
}

export function registerWorkerGracefulShutdown(worker: Worker): () => Promise<void> {
  const shutdown = async (signal?: string) => {
    logger.info({ signal }, "Shutting down Review Worker gracefully...");
    try {
      await worker.close();
      logger.info("Review Worker closed cleanly");
    } catch (err) {
      logger.error({ err }, "Error closing Review Worker");
    }
  };

  process.once("SIGTERM", () => void shutdown("SIGTERM"));
  process.once("SIGINT", () => void shutdown("SIGINT"));

  return () => shutdown("manual");
}

if (process.env["NODE_ENV"] !== "test" && process.argv[1]?.includes("worker")) {
  const worker = createReviewWorker();
  registerWorkerGracefulShutdown(worker);
  logger.info("BullMQ Review Worker process listening for jobs with DLQ support");
}


