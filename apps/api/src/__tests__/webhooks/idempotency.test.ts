import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHmac } from "node:crypto";
import express, { type Express } from "express";
import request from "supertest";
import type { RequestWithRawBody } from "../../server.js";
import { createWebhookHandler } from "../../webhooks/handler.js";

const SECRET = "test-secret";

function makeApp(deps: Parameters<typeof createWebhookHandler>[0]): Express {
  const app = express();
  app.use(
    express.json({
      verify: (req: RequestWithRawBody, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );
  app.post("/webhook", createWebhookHandler(deps));
  return app;
}

function sign(body: object): string {
  const s = JSON.stringify(body);
  return "sha256=" + createHmac("sha256", SECRET).update(Buffer.from(s)).digest("hex");
}

const prPayload = {
  action: "opened",
  number: 42,
  pull_request: { head: { sha: "abc123" }, base: { sha: "def456" } },
  repository: { id: 99, name: "my-repo", owner: { login: "acme" } },
  installation: { id: 7 },
};

describe("Webhook idempotency", () => {
  let enqueueReview: ReturnType<typeof vi.fn>;
  let upsertDelivery: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    enqueueReview = vi.fn().mockResolvedValue(undefined);
    upsertDelivery = vi.fn().mockResolvedValue({ isNew: true });
  });

  it("enqueues job for new delivery", async () => {
    const app = makeApp({ webhookSecret: SECRET, upsertDelivery, enqueueReview });
    const res = await request(app)
      .post("/webhook")
      .set("x-hub-signature-256", sign(prPayload))
      .set("x-github-delivery", "delivery-001")
      .set("x-github-event", "pull_request")
      .send(prPayload);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(enqueueReview).toHaveBeenCalledOnce();
    expect(upsertDelivery).toHaveBeenCalledWith("delivery-001");
  });

  it("ignores duplicate delivery ID without enqueuing", async () => {
    upsertDelivery.mockResolvedValue({ isNew: false });
    const app = makeApp({ webhookSecret: SECRET, upsertDelivery, enqueueReview });

    const res = await request(app)
      .post("/webhook")
      .set("x-hub-signature-256", sign(prPayload))
      .set("x-github-delivery", "delivery-001")
      .set("x-github-event", "pull_request")
      .send(prPayload);

    expect(res.status).toBe(200);
    expect(res.body.duplicate).toBe(true);
    expect(enqueueReview).not.toHaveBeenCalled();
  });

  it("rejects invalid signature with 401", async () => {
    const app = makeApp({ webhookSecret: SECRET, upsertDelivery, enqueueReview });
    const res = await request(app)
      .post("/webhook")
      .set("x-hub-signature-256", "sha256=badhex")
      .set("x-github-delivery", "delivery-002")
      .set("x-github-event", "pull_request")
      .send(prPayload);

    expect(res.status).toBe(401);
    expect(enqueueReview).not.toHaveBeenCalled();
  });

  it("rejects missing signature with 401", async () => {
    const app = makeApp({ webhookSecret: SECRET, upsertDelivery, enqueueReview });
    const res = await request(app)
      .post("/webhook")
      .set("x-github-delivery", "delivery-no-sig")
      .set("x-github-event", "pull_request")
      .send(prPayload);

    expect(res.status).toBe(401);
    expect(enqueueReview).not.toHaveBeenCalled();
  });

  it("passes PR title and author to enqueueReview when provided in payload", async () => {
    const enrichedPayload = {
      ...prPayload,
      pull_request: {
        ...prPayload.pull_request,
        title: "feat: add payment gateway",
        user: { login: "alice-dev" },
      },
    };
    const app = makeApp({ webhookSecret: SECRET, upsertDelivery, enqueueReview });
    const res = await request(app)
      .post("/webhook")
      .set("x-hub-signature-256", sign(enrichedPayload))
      .set("x-github-delivery", "delivery-005")
      .set("x-github-event", "pull_request")
      .send(enrichedPayload);

    expect(res.status).toBe(200);
    expect(enqueueReview).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "feat: add payment gateway",
        author: "alice-dev",
        prNumber: 42,
      })
    );
  });

  it("skips non-pull_request events", async () => {
    const app = makeApp({ webhookSecret: SECRET, upsertDelivery, enqueueReview });
    const pushPayload = { ref: "refs/heads/main" };
    const res = await request(app)
      .post("/webhook")
      .set("x-hub-signature-256", "sha256=" + createHmac("sha256", SECRET).update(Buffer.from(JSON.stringify(pushPayload))).digest("hex"))
      .set("x-github-delivery", "delivery-003")
      .set("x-github-event", "push")
      .send(pushPayload);

    expect(res.status).toBe(200);
    expect(res.body.skipped).toBe(true);
    expect(enqueueReview).not.toHaveBeenCalled();
  });

  it("skips unhandled PR actions", async () => {
    const closedPayload = { ...prPayload, action: "closed" };
    const app = makeApp({ webhookSecret: SECRET, upsertDelivery, enqueueReview });
    const res = await request(app)
      .post("/webhook")
      .set("x-hub-signature-256", sign(closedPayload))
      .set("x-github-delivery", "delivery-004")
      .set("x-github-event", "pull_request")
      .send(closedPayload);

    expect(res.status).toBe(200);
    expect(res.body.skipped).toBe(true);
    expect(enqueueReview).not.toHaveBeenCalled();
  });

  it("handles pull_request_review_comment feedback webhook events", async () => {
    const handleFeedback = vi.fn().mockResolvedValue({
      handled: true,
      command: "dismiss",
      findingId: "find-123",
    });

    const commentPayload = {
      action: "created",
      comment: {
        id: 999,
        body: "/dismiss False positive in test mock",
        user: { login: "octocat" },
      },
      repository: { id: 99, name: "my-repo", owner: { login: "acme" } },
      pull_request: { number: 42 },
    };

    const app = makeApp({
      webhookSecret: SECRET,
      upsertDelivery,
      enqueueReview,
      handleFeedback,
    });

    const res = await request(app)
      .post("/webhook")
      .set("x-hub-signature-256", sign(commentPayload))
      .set("x-github-delivery", "deliv-comment-1")
      .set("x-github-event", "pull_request_review_comment")
      .send(commentPayload);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(handleFeedback).toHaveBeenCalledOnce();
    const arg = handleFeedback.mock.calls[0]![0];
    expect(arg.comment.body).toContain("/dismiss");
    expect(arg.sender.login).toBe("octocat");
  });
});
