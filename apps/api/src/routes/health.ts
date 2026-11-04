import { Router } from "express";
import { prisma } from "@acr/database";

export const healthRouter: Router = Router();

// Liveness probes
healthRouter.get(["/health", "/healthz"], (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "agentic-code-reviewer-api",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Readiness probe checking DB connectivity
healthRouter.get("/readyz", async (_req, res) => {
  const checks: Record<string, "healthy" | "unhealthy"> = {
    database: "healthy",
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    checks["database"] = "unhealthy";
  }

  const isReady = checks["database"] === "healthy";
  res.status(isReady ? 200 : 503).json({
    status: isReady ? "ready" : "not_ready",
    version: "2.0.0",
    checks,
    timestamp: new Date().toISOString(),
  });
});
