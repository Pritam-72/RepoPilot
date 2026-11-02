import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../server.js";

describe("Health Route", () => {
  const app = createApp();

  it("GET /api/v1/health returns 200 with service status", async () => {
    const res = await request(app).get("/api/v1/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("agentic-code-reviewer-api");
    expect(res.headers["x-correlation-id"]).toBeDefined();
  });
});
