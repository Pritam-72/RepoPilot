import { Router, type Request, type Response } from "express";
import { metrics, evaluateAlertRules } from "@acr/observability";

export function createMetricsRouter(): Router {
  const router = Router();

  /**
   * GET /metrics
   * Standard Prometheus text exposition endpoint (Phase 9)
   */
  router.get("/metrics", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
    res.send(metrics.toPrometheus());
  });

  /**
   * GET /api/v1/alerts
   * Active SLO alert evaluation
   */
  router.get("/api/v1/alerts", (_req: Request, res: Response) => {
    const snap = metrics.getSnapshot();
    const activeAlerts = evaluateAlertRules(snap);
    res.json({
      status: activeAlerts.length === 0 ? "healthy" : "alerting",
      activeCount: activeAlerts.length,
      alerts: activeAlerts,
      evaluatedAt: new Date().toISOString(),
    });
  });

  /**
   * GET /api/v1/metrics/snapshot
   * Structured JSON metrics snapshot
   */
  router.get("/api/v1/metrics/snapshot", (_req: Request, res: Response) => {
    res.json(metrics.getSnapshot());
  });

  return router;
}
