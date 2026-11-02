import type { Request, Response, NextFunction } from "express";
import { newCorrelationId } from "@acr/observability";

export function correlationMiddleware(req: Request, res: Response, next: NextFunction) {
  const correlationId = (req.headers["x-correlation-id"] as string) || newCorrelationId();
  req.headers["x-correlation-id"] = correlationId;
  res.setHeader("X-Correlation-ID", correlationId);
  next();
}

