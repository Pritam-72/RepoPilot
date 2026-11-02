import { describe, it, expect } from "vitest";
import { processReviewJob } from "../processors/test-job.processor.js";
import { createReviewQueue } from "../queues/review-queue.js";
import type { Job } from "bullmq";
import type { ReviewJobPayload } from "@acr/review-contracts";

describe("Review Worker & Processor", () => {
  it("processes a valid review job payload", async () => {
    const mockJob = {
      id: "job-1",
      data: {
        reviewJobId: "rev-1",
        repositoryId: "repo-1",
        installationId: "inst-1",
        pullRequestNumber: 10,
        headSha: "abcdef123456",
        deliveryId: "deliv-1",
      },
    } as unknown as Job<ReviewJobPayload>;

    const result = await processReviewJob(mockJob);
    expect(result.processed).toBe(true);
    expect(result.headSha).toBe("abcdef123456");
  });

  it("fails when payload schema is invalid", async () => {
    const mockJob = {
      id: "job-2",
      data: {
        reviewJobId: "rev-2",
        // missing required fields
      },
    } as unknown as Job<ReviewJobPayload>;

    await expect(processReviewJob(mockJob)).rejects.toThrow();
  });

  it("configures review queue with default retry attempts", () => {
    const queue = createReviewQueue({ host: "localhost", port: 6379 });
    expect(queue.name).toBe("pull-request-reviews");
    expect(queue.opts.defaultJobOptions?.attempts).toBe(3);
  });
});

