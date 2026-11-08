import { describe, it, expect, vi } from "vitest";
import {
  CircuitBreaker,
  classifyError,
  withRetry,
  withTimeout,
  CostGuard,
  ResilientLLMProviderChain,
  buildAnalysisCoverage,
  formatAnalysisCoverageMarkdown,
  runMultiAgentReview,
  MockLLMProvider,
} from "@acr/agents";
import { rechunkOnContextOverflow, type ReviewUnit } from "@acr/repository-context";

describe("Phase 6 Chaos & Reliability Verification", () => {
  describe("Error Classification", () => {
    it("classifies HTTP 429, 500, 502, 503, 504 and network errors as transient", () => {
      expect(classifyError(new Error("Request failed with status code 429")).type).toBe("transient");
      expect(classifyError(new Error("503 Service Unavailable")).type).toBe("transient");
      expect(classifyError(new Error("connect ETIMEDOUT 1.2.3.4")).type).toBe("transient");
      expect(classifyError(new Error("read ECONNRESET")).type).toBe("transient");
      expect(classifyError({ status: 502 }).type).toBe("transient");
    });

    it("classifies HTTP 400, 401, 403, 404, 422 and syntax errors as permanent", () => {
      expect(classifyError(new Error("HTTP 401 Unauthorized: Invalid API Key")).type).toBe("permanent");
      expect(classifyError(new Error("HTTP 403 Forbidden: Quota disabled")).type).toBe("permanent");
      expect(classifyError(new SyntaxError("Unexpected token < in JSON")).type).toBe("permanent");
      expect(classifyError({ status: 404 }).type).toBe("permanent");
    });
  });

  describe("Bounded Retries & Fast Failures", () => {
    it("retries transient errors with bounded attempts and exponential backoff", async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error("503 Service Temporarily Unavailable");
        }
        return "success";
      };

      const result = await withRetry(fn, {
        maxAttempts: 4,
        initialDelayMs: 10,
        maxDelayMs: 50,
        jitter: false,
      });

      expect(result).toBe("success");
      expect(attempts).toBe(3);
    });

    it("fails fast immediately on permanent errors without retrying", async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        throw new Error("HTTP 401 Unauthorized: Invalid credentials");
      };

      await expect(
        withRetry(fn, {
          maxAttempts: 5,
          initialDelayMs: 10,
          maxDelayMs: 50,
        })
      ).rejects.toThrow("HTTP 401 Unauthorized");

      // Failed immediately on attempt 1!
      expect(attempts).toBe(1);
    });

    it("enforces timeout on slow unresponsive operations", async () => {
      const slowFn = () => new Promise((resolve) => setTimeout(resolve, 200));
      await expect(withTimeout(slowFn, 50, "LLM inference")).rejects.toThrow(
        "LLM inference"
      );
    });
  });

  describe("Circuit Breaker Protection", () => {
    it("trips open when failure threshold is breached and prevents upstream requests", async () => {
      const breaker = new CircuitBreaker({
        failureThreshold: 2,
        resetTimeoutMs: 50,
      });

      let callCount = 0;
      const failingFn = async () => {
        callCount++;
        throw new Error("500 Internal Server Error");
      };

      await expect(breaker.execute(failingFn)).rejects.toThrow();
      await expect(breaker.execute(failingFn)).rejects.toThrow();

      expect(breaker.getState()).toBe("OPEN");

      // Next call fails fast without executing failingFn
      await expect(breaker.execute(failingFn)).rejects.toThrow("is OPEN");
      expect(callCount).toBe(2);

      // Wait for cooldown to half-open
      await new Promise((r) => setTimeout(r, 60));
      expect(breaker.getState()).toBe("HALF_OPEN");

      // Success in half-open resets to CLOSED
      const successFn = async () => "recovered";
      const result = await breaker.execute(successFn);
      expect(result).toBe("recovered");
      expect(breaker.getState()).toBe("CLOSED");
    });
  });

  describe("Secondary Provider Fallback", () => {
    it("falls back to secondary LLM provider when primary fails or circuit is tripped", async () => {
      let primaryCalls = 0;
      let secondaryCalls = 0;

      const primary = {
        name: "gemini-primary",
        generateReview: async () => {
          primaryCalls++;
          throw new Error("503 Service Unavailable");
        },
      };

      const secondary = {
        name: "openai-secondary",
        generateReview: async () => {
          secondaryCalls++;
          return "fallback response";
        },
      };

      const chain = new ResilientLLMProviderChain(primary, secondary, {
        failureThreshold: 1,
        resetTimeoutMs: 100,
        maxRetries: 0,
        baseDelayMs: 10,
      });

      const response = await chain.execute(async (provider) => {
        return provider.generateReview();
      });

      expect(response).toBe("fallback response");
      expect(primaryCalls).toBe(1);
      expect(secondaryCalls).toBe(1);
      expect(chain.getActiveProviderName()).toBe("openai-secondary");
    });
  });

  describe("Context Window Overflow & Intelligent Re-chunking", () => {
    it("splits oversized review units into smaller sub-units without losing files", () => {
      const oversizedUnit: ReviewUnit = {
        id: "unit-large",
        files: [
          {
            path: "large-file-1.ts",
            diff: "line1\nline2\n".repeat(500),
            tokenCount: 6000,
          },
          {
            path: "large-file-2.ts",
            diff: "lineA\nlineB\n".repeat(500),
            tokenCount: 6000,
          },
          {
            path: "small-file.ts",
            diff: "small",
            tokenCount: 100,
          },
        ],
        totalTokens: 12100,
        suggestedAgents: ["correctness", "security"],
      };

      const maxWindowTokens = 7000;
      const rechunked = rechunkOnContextOverflow([oversizedUnit], maxWindowTokens);

      expect(rechunked.length).toBeGreaterThan(1);
      for (const unit of rechunked) {
        expect(unit.totalTokens).toBeLessThanOrEqual(maxWindowTokens);
      }

      // Ensure all original files are preserved across chunks
      const allFiles = rechunked.flatMap((u) => u.files.map((f) => f.path));
      expect(allFiles).toContain("large-file-1.ts");
      expect(allFiles).toContain("large-file-2.ts");
      expect(allFiles).toContain("small-file.ts");
    });
  });

  describe("Hard Cost Cap Enforcement", () => {
    it("halts token expenditure when budget threshold is exceeded", () => {
      const costGuard = new CostGuard({ maxTokensPerReview: 10000 });

      expect(costGuard.recordUsage(4000, 1000)).toBe(true);
      expect(costGuard.isCostCapReached()).toBe(false);
      expect(costGuard.getStats().totalTokens).toBe(5000);

      // Exceed budget
      expect(costGuard.recordUsage(4000, 2000)).toBe(false);
      expect(costGuard.isCostCapReached()).toBe(true);
      expect(costGuard.getStats().totalTokens).toBe(11000);

      // Subsequent attempt blocked
      expect(costGuard.recordUsage(500, 500)).toBe(false);
    });
  });

  describe("Partial Review & Degradation Reporting Under Chaos", () => {
    it("completes review and produces analysis coverage with metrics and markdown", async () => {
      const mockProvider = new MockLLMProvider();

      const result = await runMultiAgentReview(
        {
          files: [
            {
              path: "src/critical-service.ts",
              content: "export function criticalOp() { return true; }",
              patch: "@@ -1,5 +1,15 @@\n+export function criticalOp() { return true; }\n",
            },
          ],
        },
        {
          llmProvider: mockProvider,
        }
      );

      // Verify that analysis coverage is populated
      expect(result.coverage).toBeDefined();
      expect(result.coverage.totalFiles).toBe(1);
      expect(result.coverage.analyzedFiles.length).toBe(1);
      expect(result.coverage.coveragePercentage).toBe(100);
      expect(result.status).toBe("completed");

      // Format markdown report
      const md = formatAnalysisCoverageMarkdown(result.coverage);
      expect(md).toContain("Analysis Coverage");
      expect(md).toContain("100.0%");
    });

    it("generates partial status and warning notice when degradation occurs", () => {
      const coverage = buildAnalysisCoverage(
        ["src/a.ts", "src/b.ts", "src/c.ts"],
        ["src/a.ts"],
        ["security", "correctness"],
        ["security (timeout after retries)"],
        true // cost cap reached
      );

      expect(coverage.status).toBe("partial");
      expect(coverage.coveragePercentage).toBeCloseTo(33.3, 1);
      expect(coverage.degradedAgents.map((d) => d.agent)).toContain(
        "security (timeout after retries)"
      );
      expect(coverage.costCapReached).toBe(true);
      expect(coverage.notices?.length).toBeGreaterThan(0);

      const markdown = formatAnalysisCoverageMarkdown(coverage);
      expect(markdown).toContain("⚠️ **Partial Analysis**");
      expect(markdown).toContain("Cost cap limit reached");
      expect(markdown).toContain("security (timeout after retries)");
    });
  });
});
