import { describe, it, expect } from "vitest";
import {
  evaluateFindings,
  aggregateBenchmarkMetrics,
  generateBenchmarkMarkdownReport,
  type CandidateFinding,
  type GroundTruthFinding,
} from "./benchmark-reporter.js";
import { runBenchmark } from "./run-benchmark.js";

describe("Benchmark Evaluation Harness & Pilot Gate (Task 7.3)", () => {
  it("evaluates true positives and line localization correctly", () => {
    const expected: GroundTruthFinding[] = [
      { file: "src/paginate.ts", line: 4, category: "correctness" },
    ];

    const candidates: CandidateFinding[] = [
      {
        file: "src/paginate.ts",
        line: 4,
        category: "correctness",
        severity: "high",
        confidence: 0.95,
        verificationStatus: "verified",
      },
    ];

    const result = evaluateFindings("bug-prs/off-by-one.patch", expected, candidates);
    expect(result.truePositives).toBe(1);
    expect(result.falsePositives).toBe(0);
    expect(result.falseNegatives).toBe(0);
    expect(result.lineLocalizationAccuracy).toBe(1.0);
  });

  it("evaluates false positives and rejects unverified candidate findings", () => {
    const expected: GroundTruthFinding[] = [];
    const candidates: CandidateFinding[] = [
      {
        file: "src/clean.ts",
        line: 10,
        category: "correctness",
        severity: "medium",
        confidence: 0.8,
        verificationStatus: "verified", // verified false positive
      },
      {
        file: "src/clean.ts",
        line: 20,
        category: "security",
        severity: "high",
        confidence: 0.4,
        verificationStatus: "rejected", // unverified / rejected should not count as candidate
      },
    ];

    const result = evaluateFindings("clean-prs/refactor-clean.patch", expected, candidates);
    expect(result.truePositives).toBe(0);
    expect(result.falsePositives).toBe(1);
    expect(result.falseNegatives).toBe(0);
  });

  it("checks MVP gate criteria enforcement", () => {
    const passingResults = [
      {
        fixture: "fix-1",
        truePositives: 9,
        falsePositives: 1,
        falseNegatives: 1,
        lineLocalizationAccuracy: 1.0,
        validLineReferences: true,
        crashed: false,
      },
    ];
    const passingMetrics = aggregateBenchmarkMetrics(passingResults);
    expect(passingMetrics.precision).toBe(0.9); // 90% >= 85%
    expect(passingMetrics.falsePositiveRate).toBe(0.1); // 10% <= 15%
    expect(passingMetrics.gatePassed).toBe(true);

    const failingResults = [
      {
        fixture: "fix-2",
        truePositives: 5,
        falsePositives: 5,
        falseNegatives: 0,
        lineLocalizationAccuracy: 1.0,
        validLineReferences: true,
        crashed: false,
      },
    ];
    const failingMetrics = aggregateBenchmarkMetrics(failingResults);
    expect(failingMetrics.precision).toBe(0.5); // 50% < 85%
    expect(failingMetrics.gatePassed).toBe(false);
  });

  it("generates markdown benchmark report with table and status", () => {
    const metrics = aggregateBenchmarkMetrics([
      {
        fixture: "bug-prs/off-by-one.patch",
        truePositives: 1,
        falsePositives: 0,
        falseNegatives: 0,
        lineLocalizationAccuracy: 1.0,
        validLineReferences: true,
        crashed: false,
      },
    ]);

    const report = generateBenchmarkMarkdownReport(metrics);
    expect(report).toContain("# RepoPilot MVP Benchmark Evaluation Report");
    expect(report).toContain("**Gate Status:** ✅ PASSED");
    expect(report).toContain("Precision");
    expect(report).toContain("False Positive Rate");
  });

  it("executes automated benchmark harness across all PR fixtures and satisfies gate", async () => {
    const metrics = await runBenchmark();

    expect(metrics.totalFixtures).toBe(7);
    expect(metrics.crashes).toBe(0);
    expect(metrics.precision).toBeGreaterThanOrEqual(0.85);
    expect(metrics.falsePositiveRate).toBeLessThanOrEqual(0.15);
    expect(metrics.validLineReferencesRate).toBe(1.0);
    expect(metrics.gatePassed).toBe(true);

    // Verify clean PR has 0 false positives
    const cleanFixture = metrics.fixtureResults.find((r) => r.fixture.includes("refactor-clean"));
    expect(cleanFixture).toBeDefined();
    expect(cleanFixture?.falsePositives).toBe(0);
    expect(cleanFixture?.truePositives).toBe(0);
  });
});
