import type { Request, Response } from "express";
import { logger } from "@acr/observability";
import { PullRequestWebhookPayloadSchema } from "@acr/review-contracts";
import { verifyWebhookSignature } from "./verify-signature.js";
import type { RequestWithRawBody } from "../server.js";

// Injected at runtime — avoids circular deps and keeps handler testable
export interface WebhookHandlerDeps {
  webhookSecret: string;
  upsertDelivery: (githubDeliveryId: string, eventType?: string) => Promise<{ isNew: boolean }>;
  enqueueReview: (payload: {
    installationId: number;
    repositoryId: number;
    owner: string;
    repo: string;
    prNumber: number;
    headSha: string;
    baseSha: string;
    title?: string | undefined;
    author?: string | undefined;
    idempotencyKey: string;
    dryRun?: boolean | undefined;
  }) => Promise<void>;
  handleFeedback?: (payload: {
    event: string;
    action: string;
    repository: { id: number; owner: string; name: string };
    sender: { login: string };
    comment?: { id: number; body: string; in_reply_to_id?: number; original_commit_id?: string } | undefined;
    reaction?: { content: string } | undefined;
    issueNumber?: number | undefined;
  }) => Promise<{ handled: boolean; command?: string | null; findingId?: string | undefined }>;
}

const HANDLED_ACTIONS = new Set(["opened", "reopened", "synchronize"]);

export function createWebhookHandler(deps: WebhookHandlerDeps) {
  return async function handleWebhook(req: Request, res: Response): Promise<void> {
    const rawBody = (req as RequestWithRawBody).rawBody;
    const signature = req.headers["x-hub-signature-256"] as string | undefined;
    const deliveryId = req.headers["x-github-delivery"] as string | undefined;
    const event = req.headers["x-github-event"] as string | undefined;

    // 1. Verify signature
    if (!rawBody || !signature || !verifyWebhookSignature(rawBody, signature, deps.webhookSecret)) {
      res.status(401).json({ error: "Invalid webhook signature" });
      return;
    }

    // 2. Handle feedback events (pull_request_review_comment, issue_comment)
    if (
      (event === "pull_request_review_comment" || event === "issue_comment") &&
      deps.handleFeedback
    ) {
      const gDeliveryId = deliveryId ?? `${Date.now()}`;
      await deps.upsertDelivery(gDeliveryId, event);

      const body = req.body;
      const feedbackResult = await deps.handleFeedback({
        event,
        action: body.action,
        repository: {
          id: body.repository?.id,
          owner: body.repository?.owner?.login ?? "",
          name: body.repository?.name ?? "",
        },
        sender: {
          login: body.sender?.login ?? body.comment?.user?.login ?? "unknown",
        },
        comment: body.comment
          ? {
              id: body.comment.id,
              body: body.comment.body ?? "",
              in_reply_to_id: body.comment.in_reply_to_id,
              original_commit_id: body.comment.original_commit_id,
            }
          : undefined,
        reaction: body.reaction,
        issueNumber: body.issue?.number ?? body.pull_request?.number,
      });

      res.status(200).json({ ok: true, feedback: feedbackResult });
      return;
    }

    // 3. Only handle pull_request events
    if (event !== "pull_request") {
      res.status(200).json({ ok: true, skipped: true });
      return;
    }

    // 3. Parse payload
    const parsed = PullRequestWebhookPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid payload" });
      return;
    }

    const { action, number: prNumber, pull_request, repository, installation } = parsed.data;

    // 4. Filter actions
    if (!HANDLED_ACTIONS.has(action)) {
      res.status(200).json({ ok: true, skipped: true });
      return;
    }

    // 5. Idempotency — record delivery
    const gDeliveryId = deliveryId ?? `${Date.now()}`;
    const { isNew } = await deps.upsertDelivery(gDeliveryId);

    if (!isNew) {
      logger.info({ deliveryId: gDeliveryId }, "Duplicate webhook delivery ignored");
      res.status(200).json({ ok: true, duplicate: true });
      return;
    }

    // 6. Enqueue review job
    const idempotencyKey = `${installation.id}:${repository.id}:${prNumber}:${pull_request.head.sha}`;
    await deps.enqueueReview({
      installationId: installation.id,
      repositoryId: repository.id,
      owner: repository.owner.login,
      repo: repository.name,
      prNumber,
      headSha: pull_request.head.sha,
      baseSha: pull_request.base.sha,
      title: pull_request.title,
      author: pull_request.user?.login,
      idempotencyKey,
    });

    logger.info({ prNumber, headSha: pull_request.head.sha }, "Review job enqueued");
    res.status(200).json({ ok: true });
  };
}

