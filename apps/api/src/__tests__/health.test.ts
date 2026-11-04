import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "../server.js";

describe("Health & Readiness Routes (Phase 0)", () => {
  const app = createApp();

  it("GET /api/v1/health returns 200 with service status", async () => {
    const res = await request(app).get("/api/v1/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.version).toBe("2.0.0");
    expect(res.body.service).toBe("agentic-code-reviewer-api");
    expect(res.headers["x-correlation-id"]).toBeDefined();
  });

  it("GET /api/v1/healthz returns 200 liveness", async () => {
    const res = await request(app).get("/api/v1/healthz");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET /api/v1/readyz returns 200 with component health", async () => {
    const res = await request(app).get("/api/v1/readyz");

    expect([200, 503]).toContain(res.status);
    expect(res.body.checks).toBeDefined();
    expect(res.body.version).toBe("2.0.0");
  });
});
