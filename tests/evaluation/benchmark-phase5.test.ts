import { describe, it, expect } from "vitest";
import { runVerificationBenchmark } from "../../benchmark/runner/index.js";
import { MockLLMProvider } from "@acr/agents";

describe("Historical Bug Benchmark Harness - Verification & False Positive Reduction (Phase 5)", () => {
  it("evaluates precision improvement and false positive elimination before vs after verification", async () => {
    const mockProvider = new MockLLMProvider();
    const report = await runVerificationBenchmark(undefined, mockProvider);

    expect(report.totalCases).toBe(6);
    expect(report.bugCases).toBe(4);
    expect(report.controlCases).toBe(2);

    // Before verification: candidate findings contain noisy/unverified findings
    expect(report.beforeVerification.candidateCount).toBe(10); // 4 true bugs + 4 seeded FPs on bug PRs + 2 seeded FPs on controls
    expect(report.beforeVerification.truePositives).toBe(4);
    expect(report.beforeVerification.falsePositives).toBe(6);
    expect(report.beforeVerification.precision).toBeCloseTo(0.40, 1); // 4 / 10 = 40%

    // After verification pipeline:
    // Precision jumps to 100%, 100% of false positives blocked, 100% recall preserved
    expect(report.afterVerification.truePositives).toBe(4);
    expect(report.afterVerification.falsePositives).toBe(0);
    expect(report.afterVerification.precision).toBe(1.0); // 100% precision
    expect(report.afterVerification.recall).toBe(1.0); // 100% recall
    expect(report.afterVerification.falsePositivesEliminated).toBe(6);
    expect(report.afterVerification.reductionPercentage).toBe(100);

    // Rejection reasons are recorded for prompt and filter tuning
    expect(report.rejectionsSample.length).toBeGreaterThan(0);
    expect(report.rejectionsSample[0]!.reason).toBeDefined();
  });
});

