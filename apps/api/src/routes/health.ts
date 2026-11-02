import { Router } from "express";

export const healthRouter: Router = Router();

healthRouter.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "agentic-code-reviewer-api",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
