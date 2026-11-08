import type { Request, Response, NextFunction } from "express";
import { metrics } from "@acr/observability";

export interface RateLimiterOptions {
  windowMs?: number;
  maxRequests?: number;
  keyGenerator?: (req: Request) => string;
}

interface RequestRecord {
  timestamps: number[];
}

export function createRateLimiter(options: RateLimiterOptions = {}) {
  const windowMs = options.windowMs ?? 60_000; // 1 minute
  const maxRequests = options.maxRequests ?? 60; // 60 req/min default
  const keyGen =
    options.keyGenerator ??
    ((req: Request) => {
      const tenant = (req.headers["x-tenant-id"] as string) || "";
      const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
      return tenant ? `tenant:${tenant}` : `ip:${ip}`;
    });

  const clients = new Map<string, RequestRecord>();

  // Periodically evict expired entries to prevent memory leaks
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of clients.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
      if (record.timestamps.length === 0) {
        clients.delete(key);
      }
    }
  }, Math.max(30_000, windowMs));

  // Ensure timer does not prevent process exit
  if (interval.unref) {
    interval.unref();
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGen(req);
    const now = Date.now();

    let record = clients.get(key);
    if (!record) {
      record = { timestamps: [] };
      clients.set(key, record);
    }

    // Filter out timestamps outside current window
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

    const remaining = Math.max(0, maxRequests - record.timestamps.length);
    const resetTimeSeconds = Math.ceil(windowMs / 1000);

    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", resetTimeSeconds);

    if (record.timestamps.length >= maxRequests) {
      metrics.recordRateLimitHit(req.baseUrl || req.path);
      res.setHeader("Retry-After", resetTimeSeconds);
      res.status(429).json({
        error: "Too Many Requests",
        message: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 1000}s allowed.`,
        retryAfterSeconds: resetTimeSeconds,
      });
      return;
    }

    record.timestamps.push(now);
    next();
  };
}
