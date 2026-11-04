import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createInstallationOctokit,
  clearInstallationTokenCache,
  getInstallationCacheSize,
  withRateLimitRetry,
} from "../client.js";

// Mock @octokit/app
vi.mock("@octokit/app", () => {
  return {
    App: vi.fn().mockImplementation(() => ({
      getInstallationOctokit: vi.fn().mockResolvedValue({
        rest: {},
        request: vi.fn(),
      }),
    })),
  };
});

describe("createInstallationOctokit & Token Caching", () => {
  beforeEach(() => {
    clearInstallationTokenCache();
    vi.clearAllMocks();
  });

  it("caches Octokit client per installation and reuses within TTL", async () => {
    expect(getInstallationCacheSize()).toBe(0);

    const client1 = await createInstallationOctokit(12345, 999, "private-key", 10_000);
    expect(getInstallationCacheSize()).toBe(1);

    const client2 = await createInstallationOctokit(12345, 999, "private-key", 10_000);
    expect(client1).toBe(client2);
    expect(getInstallationCacheSize()).toBe(1);
  });

  it("creates separate client instances for different installations", async () => {
    const clientA = await createInstallationOctokit(101, 999, "private-key");
    const clientB = await createInstallationOctokit(102, 999, "private-key");

    expect(clientA).not.toBe(clientB);
    expect(getInstallationCacheSize()).toBe(2);
  });

  it("refreshes client after cache TTL expires", async () => {
    // TTL of -10ms is already expired
    const client1 = await createInstallationOctokit(12345, 999, "private-key", -10);
    const client2 = await createInstallationOctokit(12345, 999, "private-key", 10_000);

    expect(client1).not.toBe(client2);
  });

  it("clears cache upon clearInstallationTokenCache()", async () => {
    await createInstallationOctokit(12345, 999, "private-key");
    expect(getInstallationCacheSize()).toBe(1);

    clearInstallationTokenCache();
    expect(getInstallationCacheSize()).toBe(0);
  });
});

describe("withRateLimitRetry", () => {
  it("resolves immediately when fn succeeds without error", async () => {
    const fn = vi.fn().mockResolvedValue("success");
    const result = await withRateLimitRetry(fn);
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledOnce();
  });

  it("retries and succeeds when hitting HTTP 429 rate limit with Retry-After", async () => {
    const sleepFn = vi.fn().mockResolvedValue(undefined);
    let attempts = 0;
    const fn = vi.fn().mockImplementation(async () => {
      attempts++;
      if (attempts === 1) {
        const err: any = new Error("Rate limit exceeded");
        err.status = 429;
        err.response = { status: 429, headers: { "retry-after": "2" } };
        throw err;
      }
      return "recovered";
    });

    const result = await withRateLimitRetry(fn, { maxRetries: 3, sleepFn });
    expect(result).toBe("recovered");
    expect(attempts).toBe(2);
    expect(sleepFn).toHaveBeenCalledWith(2000);
  });

  it("retries on HTTP 403 secondary rate limit with exponential backoff", async () => {
    const sleepFn = vi.fn().mockResolvedValue(undefined);
    let attempts = 0;
    const fn = vi.fn().mockImplementation(async () => {
      attempts++;
      if (attempts <= 2) {
        const err: any = new Error("Secondary rate limit");
        err.status = 403;
        err.response = { status: 403, headers: {} };
        throw err;
      }
      return "done";
    });

    const result = await withRateLimitRetry(fn, { maxRetries: 3, baseDelayMs: 100, sleepFn });
    expect(result).toBe("done");
    expect(attempts).toBe(3);
    expect(sleepFn).toHaveBeenCalledTimes(2);
  });

  it("throws immediately on non-rate-limit errors (e.g., 404 or 500)", async () => {
    const sleepFn = vi.fn();
    const fn = vi.fn().mockRejectedValue({ status: 404, message: "Not Found" });

    await expect(withRateLimitRetry(fn, { sleepFn })).rejects.toMatchObject({
      status: 404,
    });
    expect(sleepFn).not.toHaveBeenCalled();
  });

  it("throws when maxRetries is exceeded", async () => {
    const sleepFn = vi.fn().mockResolvedValue(undefined);
    const err: any = new Error("Persistent 429");
    err.status = 429;
    const fn = vi.fn().mockRejectedValue(err);

    await expect(withRateLimitRetry(fn, { maxRetries: 2, sleepFn })).rejects.toThrow(
      "Persistent 429"
    );
    expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });
});

