import { describe, it, expect } from "vitest";
import {
  runBenchmark,
  runExpandedBenchmark,
  runVerificationBenchmark,
  isLocationMatch,
  type BenchmarkCase,
} from "../../benchmark/runner/index.js";
import { MockLLMProvider } from "@acr/agents";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

describe("Phase 7: Historical Bug Benchmark and Evaluation Suite", () => {
  const casesPath = path.resolve(process.cwd(), "benchmark", "dataset", "cases.json");
  const cases: BenchmarkCase[] = JSON.parse(readFileSync(casesPath, "utf-8"));

  describe("Dataset Schema & Diversity Integrity (Section 10)", () => {
    it("contains >= 25 verified cases across >= 5 distinct repositories", () => {
      expect(cases.length).toBeGreaterThanOrEqual(25);
      const uniqueRepos = new Set(cases.map((c) => c.repo));
      expect(uniqueRepos.size).toBeGreaterThanOrEqual(5);
    });

    it("covers all 6 review categories specified in plan.md", () => {
      const uniqueCategories = new Set(cases.map((c) => c.category));
      const required = ["bug", "security", "error-handling", "performance", "test", "quality"];
      for (const req of required) {
        expect(uniqueCategories.has(req)).toBe(true);
      }
    });

    it("includes balanced dev and test (held-out) splits with clean controls", () => {
      const devCases = cases.filter((c) => c.split === "dev");
      const testCases = cases.filter((c) => c.split === "test");

      expect(devCases.length).toBeGreaterThanOrEqual(10);
      expect(testCases.length).toBeGreaterThanOrEqual(5);

      const devControls = devCases.filter((c) => c.isControl);
      const testControls = testCases.filter((c) => c.isControl);

      expect(devControls.length).toBeGreaterThanOrEqual(1);
      expect(testControls.length).toBeGreaterThanOrEqual(1);
    });

    it("conforms to the complete BenchmarkCase schema with reconstructed PR diffs", () => {
      for (const c of cases) {
        expect(c.id).toBeDefined();
        expect(c.repo).toBeDefined();
        expect(c.language).toBeDefined();
        expect(c.category).toBeDefined();
        expect(c.baseSha).toBeDefined();
        expect(c.introducingSha).toBeDefined();
        expect(c.fixSha).toBeDefined();
        expect(c.description).toBeDefined();
        expect(c.affectedFiles.length).toBeGreaterThan(0);
        expect(c.fileContext).toBeDefined();
        expect(c.fileContext.path).toBeDefined();
        expect(c.fileContext.patch).toBeDefined();
        expect(c.fileContext.content).toBeDefined();

        if (c.isControl) {
          expect(c.expectedLocations).toEqual([]);
        } else {
          expect(c.expectedLocations.length).toBeGreaterThan(0);
          for (const loc of c.expectedLocations) {
            expect(loc.file).toBe(c.fileContext.path);
            expect(loc.lineStart).toBeGreaterThan(0);
            expect(loc.lineEnd).toBeGreaterThanOrEqual(loc.lineStart);
          }
        }
      }
    });
  });

  describe("Location Matcher Precision (isLocationMatch)", () => {
    const expected = { file: "src/utils.ts", lineStart: 10, lineEnd: 15 };

    it("matches exact same file and lines", () => {
      expect(isLocationMatch({ file: "src/utils.ts", lineStart: 10, lineEnd: 15 }, expected)).toBe(true);
    });

    it("matches within tolerance (default +- 3 lines)", () => {
      expect(isLocationMatch({ file: "src/utils.ts", lineStart: 12, lineEnd: 18 }, expected, 3)).toBe(true);
      expect(isLocationMatch({ file: "src/utils.ts", lineStart: 7, lineEnd: 12 }, expected, 3)).toBe(true);
    });

    it("rejects locations exceeding tolerance window", () => {
      expect(isLocationMatch({ file: "src/utils.ts", lineStart: 25, lineEnd: 30 }, expected, 3)).toBe(false);
      expect(isLocationMatch({ file: "src/utils.ts", lineStart: 1, lineEnd: 5 }, expected, 3)).toBe(false);
    });

    it("rejects findings on different files regardless of line numbers", () => {
      expect(isLocationMatch({ file: "src/other.ts", lineStart: 10, lineEnd: 15 }, expected)).toBe(false);
    });
  });

  describe("Expanded Evaluation Runner & Target Verification (Section 11)", () => {
    it("executes the full benchmark suite meeting all Section 11 metrics targets", async () => {
      const mockProvider = new MockLLMProvider();
      const report = await runExpandedBenchmark({
        provider: mockProvider,
        verifierProvider: mockProvider,
      });

      // Target criteria defined in plan.md Section 11:
      // Precision >= 0.70
      // Recall >= 0.70
      // False Positive Rate <= 0.30
      // Clean PR False Positives <= 1.0
      // Line Accuracy >= 0.95
      expect(report.summary.targetsMet.precisionTargetMet).toBe(true);
      expect(report.summary.targetsMet.recallFloorMet).toBe(true);
      expect(report.summary.targetsMet.fprTargetMet).toBe(true);
      expect(report.summary.targetsMet.cleanPrFpTargetMet).toBe(true);
      expect(report.summary.targetsMet.lineAccuracyTargetMet).toBe(true);

      expect(report.summary.overallPrecision).toBeGreaterThanOrEqual(0.70);
      expect(report.summary.overallRecall).toBeGreaterThanOrEqual(0.70);
      expect(report.summary.falsePositiveRate).toBeLessThanOrEqual(0.30);
      expect(report.summary.cleanPrFalsePositives).toBeLessThanOrEqual(1.0);
      expect(report.summary.lineAccuracy).toBeGreaterThanOrEqual(0.95);

      // Verify dev vs test split generalization gap
      expect(report.testSplit.generalizationGap.precisionGap).toBeLessThanOrEqual(0.15);
      expect(report.testSplit.generalizationGap.recallGap).toBeLessThanOrEqual(0.15);

      // Verify report file was persisted
      const reportFile = path.resolve(process.cwd(), "benchmark", "report", "expanded-benchmark-report.json");
      expect(existsSync(reportFile)).toBe(true);
    });

    it("filters benchmark execution by split and category correctly", async () => {
      const mockProvider = new MockLLMProvider();

      const devResult = await runBenchmark(undefined, mockProvider, "single", { split: "dev" });
      const testResult = await runBenchmark(undefined, mockProvider, "single", { split: "test" });

      expect(devResult.totalCases + testResult.totalCases).toBe(cases.length);

      const secResult = await runBenchmark(undefined, mockProvider, "single", { category: "security" });
      expect(secResult.totalCases).toBe(cases.filter((c) => c.category === "security").length);
      expect(secResult.truePositives).toBe(cases.filter((c) => c.category === "security" && !c.isControl).length);
    });

    it("verifies independent verification eliminates 100% of seeded noise", async () => {
      const mockProvider = new MockLLMProvider();
      const report = await runVerificationBenchmark(undefined, mockProvider);

      expect(report.afterVerification.falsePositives).toBe(0);
      expect(report.afterVerification.precision).toBe(1.0);
      expect(report.afterVerification.falsePositivesEliminated).toBe(cases.length);
      expect(report.afterVerification.reductionPercentage).toBe(100);
      expect(report.rejectionsSample.length).toBeGreaterThan(0);
    });
  });
});
