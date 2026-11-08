import { Router } from "express";
import { Queue } from "bullmq";
import type { ReviewJobPayload } from "@acr/review-contracts";
import { prisma } from "@acr/database";
import { logger } from "@acr/observability";
import {
  parseCommentCommand,
  parseCommentReaction,
  extractFindingMarkerFromComment,
} from "@acr/github";
import { createWebhookHandler } from "../webhooks/handler.js";
import { env } from "../config/env.js";

export function createWebhookRouter(
  reviewQueue: Queue<ReviewJobPayload>
): Router {
  const router = Router();

  const upsertDelivery = async (githubDeliveryId: string, eventType = "pull_request") => {
    try {
      await prisma.webhookDelivery.create({
        data: {
          githubDeliveryId,
          eventType,
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
          dryRun: p.dryRun,
        },
        { jobId: p.idempotencyKey }
      );
    };

  const handleFeedback: NonNullable<Parameters<typeof createWebhookHandler>[0]["handleFeedback"]> =
    async (payload) => {
      const commentBody = payload.comment?.body ?? "";
      const parsedCommand = parseCommentCommand(commentBody);
      const parsedReaction = payload.reaction
        ? parseCommentReaction(payload.reaction.content)
        : null;

      logger.info(
        { command: parsedCommand.command, reaction: parsedReaction, sender: payload.sender.login },
        "Processing developer feedback on review comment"
      );

      // 1. Identify finding from comment marker or comment ID
      const marker = extractFindingMarkerFromComment(commentBody);
      let finding = null;

      if (marker) {
        finding = await prisma.finding.findFirst({
          where: {
            filePath: marker.file,
            line: marker.line,
            category: marker.category,
          },
          orderBy: { createdAt: "desc" },
        });
      } else if (payload.comment?.id) {
        finding = await prisma.finding.findFirst({
          where: { githubCommentId: String(payload.comment.id) },
        });
      }

      if (!finding && payload.issueNumber) {
        // Fallback: finding on most recent review job for this PR
        finding = await prisma.finding.findFirst({
          where: {
            reviewJob: {
              pullRequest: { githubPrNumber: payload.issueNumber },
            },
          },
          orderBy: { createdAt: "desc" },
        });
      }

      // 2. Ensure User record exists
      const user = await prisma.user.upsert({
        where: { email: `${payload.sender.login}@users.noreply.github.com` },
        update: { displayName: payload.sender.login },
        create: {
          email: `${payload.sender.login}@users.noreply.github.com`,
          displayName: payload.sender.login,
        },
      });

      // 3. Process commands
      if (parsedCommand.command === "dismiss") {
        if (finding) {
          await prisma.finding.update({
            where: { id: finding.id },
            data: { verificationStatus: "dismissed" },
          });

          await prisma.findingFeedback.create({
            data: {
              findingId: finding.id,
              userId: user.id,
              feedbackType: "dismissed",
              comment: parsedCommand.arg || "Dismissed by developer command",
            },
          });
        }
        return { handled: true, command: "dismiss", findingId: finding?.id };
      }

      if (parsedCommand.command === "accept") {
        if (finding) {
          await prisma.finding.update({
            where: { id: finding.id },
            data: { verificationStatus: "accepted" },
          });

          await prisma.findingFeedback.create({
            data: {
              findingId: finding.id,
              userId: user.id,
              feedbackType: "accepted",
              comment: parsedCommand.arg || "Accepted by developer",
            },
          });
        }
        return { handled: true, command: "accept", findingId: finding?.id };
      }

      if (parsedCommand.command === "ignore-rule") {
        if (finding) {
          await prisma.finding.update({
            where: { id: finding.id },
            data: { verificationStatus: "dismissed" },
          });

          await prisma.findingFeedback.create({
            data: {
              findingId: finding.id,
              userId: user.id,
              feedbackType: "ignored_rule",
              comment: `Rule ignored: ${parsedCommand.arg || finding.category}`,
            },
          });
        }
        return { handled: true, command: "ignore-rule", findingId: finding?.id };
      }

      if (parsedCommand.command === "review" && payload.issueNumber) {
        // Trigger a re-review if PR info can be located
        const pr = await prisma.pullRequest.findFirst({
          where: {
            githubPrNumber: payload.issueNumber,
            repository: {
              githubRepositoryId: payload.repository.id,
            },
          },
          include: { repository: { include: { installation: true } } },
        });

        if (pr) {
          const idempotencyKey = `${pr.repository.installation.githubInstallationId}:${pr.repository.githubRepositoryId}:${pr.githubPrNumber}:${pr.headSha}:manual-rerun-${Date.now()}`;
          await enqueueReview({
            installationId: pr.repository.installation.githubInstallationId,
            repositoryId: pr.repository.githubRepositoryId,
            owner: payload.repository.owner,
            repo: payload.repository.name,
            prNumber: pr.githubPrNumber,
            headSha: pr.headSha,
            baseSha: pr.baseSha,
            title: pr.title,
            idempotencyKey,
          });
          return { handled: true, command: "review" };
        }
      }

      if (parsedReaction && finding) {
        await prisma.findingFeedback.create({
          data: {
            findingId: finding.id,
            userId: user.id,
            feedbackType: parsedReaction,
          },
        });
        return { handled: true, command: parsedReaction, findingId: finding.id };
      }

      return { handled: false };
    };

  router.post(
    "/github",
    createWebhookHandler({
      webhookSecret: env.GITHUB_WEBHOOK_SECRET,
      upsertDelivery,
      enqueueReview,
      handleFeedback,
    })
  );

  return router;
}
