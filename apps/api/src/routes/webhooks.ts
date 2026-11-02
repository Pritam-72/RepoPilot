import { Router } from "express";
import { Queue } from "bullmq";
import type { ReviewJobPayload } from "@acr/review-contracts";
import { prisma } from "@acr/database";
import { createWebhookHandler } from "../webhooks/handler.js";
import { env } from "../config/env.js";

export function createWebhookRouter(
  reviewQueue: Queue<ReviewJobPayload>
): Router {
  const router = Router();

  const upsertDelivery = async (githubDeliveryId: string) => {
    try {
      await prisma.webhookDelivery.create({
        data: {
          githubDeliveryId,
          event: "pull_request",
          status: "received",
          rawPayload: {},
        },
      });
      return { isNew: true };
    } catch {
      return { isNew: false };
    }
  };

  const enqueueReview: Parameters<typeof createWebhookHandler>[0]["enqueueReview"] =
    async (p) => {
      await reviewQueue.add(
        "review",
        {
          reviewJobId: p.idempotencyKey,
          repositoryId: String(p.repositoryId),
          installationId: String(p.installationId),
          pullRequestNumber: p.prNumber,
          headSha: p.headSha,
          deliveryId: p.idempotencyKey,
        },
        { jobId: p.idempotencyKey }
      );
    };

  router.post(
    "/github",
    createWebhookHandler({
      webhookSecret: env.GITHUB_WEBHOOK_SECRET,
      upsertDelivery,
      enqueueReview,
    })
  );

  return router;
}
