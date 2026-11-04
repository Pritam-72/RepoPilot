import { Router } from "express";
import { Queue } from "bullmq";
import type { ReviewJobPayload } from "@acr/review-contracts";
import { prisma } from "@acr/database";
import { logger } from "@acr/observability";
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
          eventType: "pull_request",
          processingStatus: "accepted",
        },
      });
      return { isNew: true };
    } catch {
      return { isNew: false };
    }
  };

  const enqueueReview: Parameters<typeof createWebhookHandler>[0]["enqueueReview"] =
    async (p) => {
      let resolvedRepoId = String(p.repositoryId);

      // Phase 1: Persist PullRequest and ReviewJob (status: queued) immediately
      try {
        const repo = await prisma.repository.findFirst({
          where: {
            OR: [
              { githubRepositoryId: p.repositoryId },
              { owner: p.owner, name: p.repo },
            ],
          },
        });

        if (repo) {
          resolvedRepoId = repo.id;

          const pr = await prisma.pullRequest.upsert({
            where: {
              repositoryId_githubPrNumber: {
                repositoryId: repo.id,
                githubPrNumber: p.prNumber,
              },
            },
            update: {
              headSha: p.headSha,
              baseSha: p.baseSha,
              title: p.title || `PR #${p.prNumber}`,
              author: p.author || "unknown",
            },
            create: {
              repositoryId: repo.id,
              githubPrNumber: p.prNumber,
              headSha: p.headSha,
              baseSha: p.baseSha,
              title: p.title || `PR #${p.prNumber}`,
              author: p.author || "unknown",
              state: "open",
            },
          });

          await prisma.reviewJob.upsert({
            where: { idempotencyKey: p.idempotencyKey },
            update: {
              headSha: p.headSha,
              status: "queued",
            },
            create: {
              repositoryId: repo.id,
              pullRequestId: pr.id,
              headSha: p.headSha,
              idempotencyKey: p.idempotencyKey,
              status: "queued",
            },
          });

          logger.info(
            { repoId: repo.id, prNumber: p.prNumber, idempotencyKey: p.idempotencyKey },
            "Persisted PullRequest and ReviewJob in queued state"
          );
        }
      } catch (err) {
        logger.warn(
          { error: err, idempotencyKey: p.idempotencyKey },
          "Failed to pre-persist ReviewJob into database; continuing with enqueue"
        );
      }

      await reviewQueue.add(
        "review",
        {
          reviewJobId: p.idempotencyKey,
          repositoryId: resolvedRepoId,
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
