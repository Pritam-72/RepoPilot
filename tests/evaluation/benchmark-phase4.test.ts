import { describe, it, expect } from "vitest";
import { runBenchmark } from "../../benchmark/runner/index.js";
import { MockLLMProvider } from "@acr/agents";

describe("Historical Bug Benchmark Harness - Multi-Agent (Phase 4)", () => {
  it("runs benchmark suite over dataset cases with 6 parallel specialised agents", async () => {
    const mockProvider = new MockLLMProvider();
    const metrics = await runBenchmark(undefined, mockProvider, "multi");

    expect(metrics.mode).toBe("multi");
    expect(metrics.totalCases).toBe(6);
    expect(metrics.bugCases).toBe(4);
    expect(metrics.controlCases).toBe(2);

    // Multi-agent target benchmarks
    expect(metrics.precision).toBeGreaterThanOrEqual(0.70);
    expect(metrics.recall).toBeGreaterThanOrEqual(0.70);
    expect(metrics.falsePositiveRate).toBeLessThanOrEqual(0.30);
    expect(metrics.cleanPrFalsePositives).toBeLessThanOrEqual(1.0);
    expect(metrics.lineAccuracy).toBeGreaterThanOrEqual(0.95);
    expect(metrics.totalTokens).toBeGreaterThan(0);

    // Per-agent contribution table verification
    expect(metrics.agentContributions).toBeDefined();
    expect(metrics.agentContributions?.length).toBe(6);

    const bugAgentStats = metrics.agentContributions?.find((a) => a.agent === "bug-reviewer");
    const secAgentStats = metrics.agentContributions?.find((a) => a.agent === "security-reviewer");
    const errAgentStats = metrics.agentContributions?.find((a) => a.agent === "error-handling-reviewer");
    const perfAgentStats = metrics.agentContributions?.find((a) => a.agent === "performance-reviewer");

    expect(bugAgentStats?.bugsDetected).toBe(1);
    expect(secAgentStats?.bugsDetected).toBe(1);
    expect(errAgentStats?.bugsDetected).toBe(1);
    expect(perfAgentStats?.bugsDetected).toBe(1);

    // Zero false positives on clean control PRs across all agents
    metrics.agentContributions?.forEach((a) => {
      expect(a.falsePositives).toBe(0);
    });
  });
});
