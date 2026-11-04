import express, { type Express, type Request } from "express";
import type { Queue } from "bullmq";
import type { ReviewJobPayload } from "@acr/review-contracts";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.js";
import { createFixProposalRouter } from "./routes/fix-proposals.js";
import { createTestProposalRouter } from "./routes/test-proposals.js";
import { createRepositoryRouter } from "./routes/repositories.js";
import { createReviewRouter } from "./routes/reviews.js";
import { createAnalyticsRouter } from "./routes/analytics.js";
import { createWebhookRouter } from "./routes/webhooks.js";
import { correlationMiddleware } from "./middleware/correlation.js";
import { errorHandler } from "./middleware/error-handler.js";
import { logger } from "@acr/observability";

export interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

export function createApp(): Express {
  const app: Express = express();

  // Enable CORS for web dashboard and local dev clients
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-installation-id, x-tenant-id, x-correlation-id, x-github-delivery, x-hub-signature-256"
    );
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Capture raw body for GitHub HMAC-SHA256 signature verification
  app.use(
    express.json({
      verify: (req: RequestWithRawBody, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );

  app.use(correlationMiddleware);

  // Mount routes
  app.use(healthRouter);
  app.use("/api/v1", healthRouter);
  app.use("/api/v1/analytics", createAnalyticsRouter());
  app.use("/api/v1/repositories", createRepositoryRouter());
  app.use("/api/v1", createReviewRouter());
  app.use("/api/v1/fix-proposals", createFixProposalRouter());
  app.use("/api/v1/test-proposals", createTestProposalRouter());

  // Webhook ingestion queue (in-memory fallback when standalone)
  const webhookQueue = {
    add: async (name: string, data: any) => {
      logger.info({ name, data }, "Webhook review job enqueued");
      return { id: data.deliveryId };
    },
  } as unknown as Queue<ReviewJobPayload>;
  app.use("/api/v1/webhooks", createWebhookRouter(webhookQueue));

  app.use(errorHandler);

  return app;
}

export function startServer() {
  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, "API server started");
  });
  return server;
}

// Auto-start when executed directly
if (process.env["NODE_ENV"] !== "test" && process.argv[1]?.includes("server")) {
  startServer();
}
