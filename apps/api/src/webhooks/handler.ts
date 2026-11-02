import type { Request, Response } from "express";
import { logger } from "@acr/observability";
import { PullRequestWebhookPayloadSchema } from "@acr/review-contracts";
import { verifyWebhookSignature } from "./verify-signature.js";
import type { RequestWithRawBody } from "../server.js";

// Injected at runtime — avoids circular deps and keeps handler testable
export interface WebhookHandlerDeps {
  webhookSecret: string;
  upsertDelivery: (githubDeliveryId: string) => Promise<{ isNew: boolean }>;
  enqueueReview: (payload: {
    installationId: number;
    repositoryId: number;
    owner: string;
    repo: string;
    prNumber: number;
    headSha: string;
    baseSha: string;
    idempotencyKey: string;
  }) => Promise<void>;
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

    // 2. Only handle pull_request events
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
      idempotencyKey,
    });

    logger.info({ prNumber, headSha: pull_request.head.sha }, "Review job enqueued");
    res.status(200).json({ ok: true });
  };
}
