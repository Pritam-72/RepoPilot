import { describe, it, expect } from "vitest";
import { runBenchmark } from "../../benchmark/runner/index.js";
import { MockLLMProvider } from "@acr/agents";

describe("Historical Bug Benchmark Harness (Phase 3)", () => {
  it("runs benchmark suite over dataset cases with deterministic mock", async () => {
    const mockProvider = new MockLLMProvider();
    const metrics = await runBenchmark(undefined, mockProvider);

    // Validate case counts
    expect(metrics.totalCases).toBe(6);
    expect(metrics.bugCases).toBe(4);
    expect(metrics.controlCases).toBe(2);

    // Baseline targets verification (plan.md Section 11)
    expect(metrics.precision).toBeGreaterThanOrEqual(0.70); // Target >= 70%
    expect(metrics.recall).toBeGreaterThanOrEqual(0.70);
    expect(metrics.falsePositiveRate).toBeLessThanOrEqual(0.30); // Target <= 30%
    expect(metrics.cleanPrFalsePositives).toBeLessThanOrEqual(1.0); // Target <= 1 per clean PR
    expect(metrics.lineAccuracy).toBeGreaterThanOrEqual(0.95); // Target >= 95%
    expect(metrics.totalTokens).toBeGreaterThan(0);
  });
});
