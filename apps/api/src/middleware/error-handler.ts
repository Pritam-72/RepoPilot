import type { Request, Response, NextFunction } from "express";
import { logger } from "@acr/observability";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error({ err }, "Unhandled error in request pipeline");

  const status = (err as { status?: number }).status ?? 500;
  const message = process.env["NODE_ENV"] === "production"
    ? "Internal Server Error"
    : err.message;

  res.status(status).json({
    error: {
      message,
      code: (err as { code?: string }).code ?? "INTERNAL_ERROR",
    },
  });
}

