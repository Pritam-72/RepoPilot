import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../server.js";
import { metrics } from "@acr/observability";

describe("API Hardening, Metrics & Rate Limiting (Phase 9)", () => {
  beforeEach(() => {
    metrics.reset();
  });

  it("exposes /metrics in standard Prometheus exposition format", async () => {
    const app = createApp();
    metrics.recordReviewDuration(120);
    metrics.recordReviewStatus("completed");
    metrics.recordTokens("bug-reviewer", "gemini-1.5-pro", 1200);

    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/plain");
    expect(res.text).toContain("acr_review_duration_ms");
    expect(res.text).toContain('acr_reviews_total{status="completed"} 1');
    expect(res.text).toContain('acr_tokens_consumed_total{agent="bug-reviewer",model="gemini-1.5-pro"} 1200');
  });

  it("exposes /api/v1/alerts and returns healthy status when no SLOs breached", async () => {
    const app = createApp();
    const res = await request(app).get("/api/v1/alerts");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("healthy");
    expect(res.body.activeCount).toBe(0);
    expect(Array.isArray(res.body.alerts)).toBe(true);
  });

  it("propagates W3C traceparent and x-trace-id response headers", async () => {
    const app = createApp();
    const incomingTrace = "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01";

    const res = await request(app)
      .get("/healthz")
      .set("traceparent", incomingTrace);

    expect(res.status).toBe(200);
    expect(res.headers["traceparent"]).toBeDefined();
    expect(res.headers["traceparent"]).toContain("4bf92f3577b34da6a3ce929d0e0e4736");
    expect(res.headers["x-trace-id"]).toBe("4bf92f3577b34da6a3ce929d0e0e4736");
  });

  it("enforces rate limit headers and rejects bursts with HTTP 429", async () => {
    // Set low limit for testing
    const originalLimit = process.env["RATE_LIMIT_MAX_REQUESTS"];
    process.env["RATE_LIMIT_MAX_REQUESTS"] = "5";

    try {
      const app = createApp();

      // Make 5 successful requests
      for (let i = 0; i < 5; i++) {
        const res = await request(app)
          .get("/api/v1/healthz")
          .set("x-tenant-id", "test-tenant-burst");
        expect(res.status).toBe(200);
        expect(res.headers["x-ratelimit-limit"]).toBe("5");
      }

      // 6th request must trigger 429 Too Many Requests
      const burstRes = await request(app)
        .get("/api/v1/healthz")
        .set("x-tenant-id", "test-tenant-burst");

      expect(burstRes.status).toBe(429);
      expect(burstRes.body.error).toBe("Too Many Requests");
      expect(burstRes.headers["retry-after"]).toBeDefined();
    } finally {
      process.env["RATE_LIMIT_MAX_REQUESTS"] = originalLimit;
    }
  });
});

