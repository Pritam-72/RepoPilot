import type { Request, Response, NextFunction } from "express";
import { tracer, formatTraceparent } from "@acr/observability";

export interface TracedRequest extends Request {
  traceId?: string;
  spanId?: string;
}

export function tracingMiddleware(req: TracedRequest, res: Response, next: NextFunction): void {
  const incomingHeader = (req.headers["traceparent"] as string) || undefined;

  const span = tracer.startSpan(`http-${req.method.toLowerCase()}-${req.path}`, {
    parentHeader: incomingHeader,
    attributes: {
      method: req.method,
      path: req.path,
      userAgent: (req.headers["user-agent"] as string) || "unknown",
    },
  });

  req.traceId = span.traceId;
  req.spanId = span.spanId;

  const outgoingHeader = formatTraceparent(span.traceId, span.spanId, true);
  res.setHeader("traceparent", outgoingHeader);
  res.setHeader("x-trace-id", span.traceId);

  res.on("finish", () => {
    const status = res.statusCode >= 500 ? "error" : "ok";
    tracer.endSpan(span, status);
  });

  next();
}
