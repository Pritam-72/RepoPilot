import { describe, it, expect } from "vitest";
import { createLogger, newCorrelationId } from "../index.js";

describe("createLogger", () => {
  it("returns a logger with expected methods", () => {
    const log = createLogger("test");
    expect(typeof log.info).toBe("function");
    expect(typeof log.error).toBe("function");
    expect(typeof log.warn).toBe("function");
  });

  it("returns a child logger when correlationId provided", () => {
    const id = newCorrelationId();
    const log = createLogger("test", id);
    expect(typeof log.info).toBe("function");
  });
});

describe("newCorrelationId", () => {
  it("generates a valid UUID", () => {
    const id = newCorrelationId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, newCorrelationId));
    expect(ids.size).toBe(100);
  });
});
