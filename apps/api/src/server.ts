import express, { type Express, type Request } from "express";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.js";
import { createFixProposalRouter } from "./routes/fix-proposals.js";
import { createTestProposalRouter } from "./routes/test-proposals.js";
import { createRepositoryRouter } from "./routes/repositories.js";
import { createReviewRouter } from "./routes/reviews.js";
import { createAnalyticsRouter } from "./routes/analytics.js";
import { correlationMiddleware } from "./middleware/correlation.js";
import { errorHandler } from "./middleware/error-handler.js";
import { logger } from "@acr/observability";

export interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

export function createApp(): Express {
  const app: Express = express();

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
  app.use("/api/v1", healthRouter);
  app.use("/api/v1/analytics", createAnalyticsRouter());
  app.use("/api/v1/repositories", createRepositoryRouter());
  app.use("/api/v1", createReviewRouter());
  app.use("/api/v1/fix-proposals", createFixProposalRouter());
  app.use("/api/v1/test-proposals", createTestProposalRouter());

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
