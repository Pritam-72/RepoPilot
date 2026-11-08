import { Queue, QueueEvents, type QueueOptions } from "bullmq";
import type { ReviewJobPayload } from "@acr/review-contracts";

export const REVIEW_QUEUE_NAME = "pull-request-reviews";
export const REVIEW_DLQ_NAME = "pull-request-reviews-dlq";

export interface RedisConnectionOptions {
  host?: string;
  port?: number;
  maxRetriesPerRequest?: null;
}

export function createRedisConnection(
  redisUrl = process.env["REDIS_URL"] ?? "redis://localhost:6379"
): RedisConnectionOptions {
  const url = new URL(redisUrl);
  return {
    host: url.hostname || "localhost",
    port: Number(url.port) || 6379,
    maxRetriesPerRequest: null,
  };
}

export function createReviewQueue(
  connection: RedisConnectionOptions = createRedisConnection()
): Queue<ReviewJobPayload> {
  return new Queue<ReviewJobPayload>(REVIEW_QUEUE_NAME, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false, // Retain failed jobs for dead-letter processing
    },
  });
}

export function createReviewDeadLetterQueue(
  connection: RedisConnectionOptions = createRedisConnection()
): Queue<ReviewJobPayload & { errorReason?: string; failedAt?: string }> {
  return new Queue(REVIEW_DLQ_NAME, {
    connection,
    defaultJobOptions: {
      removeOnComplete: false,
      removeOnFail: false,
    },
  });
}

export function createReviewQueueEvents(
  connection: RedisConnectionOptions = createRedisConnection()
): QueueEvents {
  return new QueueEvents(REVIEW_QUEUE_NAME, { connection });
}
