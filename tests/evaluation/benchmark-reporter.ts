export interface GroundTruthFinding {
  file: string;
  line: number;
  category: string;
  severity?: string;
  ruleId?: string;
}

export interface CandidateFinding {
  file: string;
  line: number;
  category: string;
  severity: string;
  ruleId?: string;
  confidence: number;
  verificationStatus: "verified" | "rejected" | "unverified";
}

export interface FixtureEvaluationResult {
  fixture: string;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  lineLocalizationAccuracy: number;
  validLineReferences: boolean;
  crashed: boolean;
  error?: string;
}

export interface BenchmarkMetrics {
  totalFixtures: number;
  totalExpected: number;
  totalCandidate: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  falsePositiveRate: number;
  f1Score: number;
  lineLocalizationAccuracy: number;
  validLineReferencesRate: number;
  crashes: number;
  gatePassed: boolean;
  fixtureResults: FixtureEvaluationResult[];
}

export function evaluateFindings(
  fixture: string,
  expected: GroundTruthFinding[],
  candidates: CandidateFinding[],
  diffLineRanges?: { file: string; start: number; end: number }[]
): FixtureEvaluationResult {
  let truePositives = 0;
  let exactLineMatches = 0;
  const matchedExpected = new Set<number>();
  let allLinesValid = true;

  // Only verified findings count towards candidate evaluation
  const verifiedCandidates = candidates.filter((c) => c.verificationStatus === "verified");

  for (const candidate of verifiedCandidates) {
    // Check if line reference is within diff line ranges (if supplied)
    if (diffLineRanges && diffLineRanges.length > 0) {
      const inRange = diffLineRanges.some(
        (r) => r.file === candidate.file && candidate.line >= r.start && candidate.line <= r.end
      );
      if (!inRange) {
        allLinesValid = false;
      }
    }

    let matchIdx = -1;
    for (let i = 0; i < expected.length; i++) {
      if (matchedExpected.has(i)) continue;
      const exp = expected[i]!;
      const fileMatches = candidate.file.endsWith(exp.file) || exp.file.endsWith(candidate.file);
      const lineNear = Math.abs(candidate.line - exp.line) <= 1;
      const catMatches = candidate.category === exp.category;

      if (fileMatches && lineNear && catMatches) {
        matchIdx = i;
        if (candidate.line === exp.line) {
          exactLineMatches++;
        }
        break;
      }
    }

    if (matchIdx >= 0) {
      truePositives++;
      matchedExpected.add(matchIdx);
    }
  }

  const falsePositives = verifiedCandidates.length - truePositives;
  const falseNegatives = expected.length - matchedExpected.size;
  const lineLocAcc = truePositives > 0 ? exactLineMatches / truePositives : 1.0;

  return {
    fixture,
    truePositives,
    falsePositives,
    falseNegatives,
    lineLocalizationAccuracy: lineLocAcc,
    validLineReferences: allLinesValid,
    crashed: false,
  };
}

export function aggregateBenchmarkMetrics(results: FixtureEvaluationResult[]): BenchmarkMetrics {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let crashes = 0;
  let validLineFixtures = 0;
  let totalLocalizationAccSum = 0;

  for (const r of results) {
    tp += r.truePositives;
    fp += r.falsePositives;
    fn += r.falseNegatives;
    if (r.crashed) crashes++;
    if (r.validLineReferences) validLineFixtures++;
    totalLocalizationAccSum += r.lineLocalizationAccuracy;
  }

  const precision = tp + fp > 0 ? tp / (tp + fp) : 1.0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 1.0;
  const falsePositiveRate = tp + fp > 0 ? fp / (tp + fp) : 0.0;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0.0;
  const avgLineLocalization = results.length > 0 ? totalLocalizationAccSum / results.length : 1.0;
  const validLineReferencesRate = results.length > 0 ? validLineFixtures / results.length : 1.0;

  // Gate Criteria: Precision >= 85%, False-Positive Rate <= 15%, 100% valid line refs, 0 crashes
  const gatePassed =
    precision >= 0.85 &&
    falsePositiveRate <= 0.15 &&
    validLineReferencesRate === 1.0 &&
    crashes === 0;

  return {
    totalFixtures: results.length,
    totalExpected: tp + fn,
    totalCandidate: tp + fp,
    truePositives: tp,
    falsePositives: fp,
    falseNegatives: fn,
    precision,
    recall,
    falsePositiveRate,
    f1Score,
    lineLocalizationAccuracy: avgLineLocalization,
    validLineReferencesRate,
    crashes,
    gatePassed,
    fixtureResults: results,
  };
}

export function generateBenchmarkMarkdownReport(metrics: BenchmarkMetrics): string {
  const gateStatus = metrics.gatePassed ? "✅ PASSED" : "❌ FAILED";

  return `# RepoPilot MVP Benchmark Evaluation Report

**Gate Status:** ${gateStatus}
**Date:** ${new Date().toISOString()}

---

## 1. Summary Metrics

| Metric | Measured | MVP Target Gate | Status |
|---|---|---|---|
| **Precision** | ${(metrics.precision * 100).toFixed(1)}% | $\\ge 85\\%$ | ${metrics.precision >= 0.85 ? "✅ PASS" : "❌ FAIL"} |
| **False Positive Rate** | ${(metrics.falsePositiveRate * 100).toFixed(1)}% | $\\le 15\\%$ | ${metrics.falsePositiveRate <= 0.15 ? "✅ PASS" : "❌ FAIL"} |
| **Recall** | ${(metrics.recall * 100).toFixed(1)}% | $\\ge 75\\%$ | ${metrics.recall >= 0.75 ? "✅ PASS" : "❌ FAIL"} |
| **F1 Score** | ${(metrics.f1Score * 100).toFixed(1)}% | $\\ge 80\\%$ | ${metrics.f1Score >= 0.80 ? "✅ PASS" : "❌ FAIL"} |
| **Diff Line Accuracy** | ${(metrics.validLineReferencesRate * 100).toFixed(1)}% | $100\\%$ | ${metrics.validLineReferencesRate === 1.0 ? "✅ PASS" : "❌ FAIL"} |
| **Pipeline Crashes** | ${metrics.crashes} | $0$ | ${metrics.crashes === 0 ? "✅ PASS" : "❌ FAIL"} |

---

## 2. Per-Fixture Breakdown

| Fixture | Expected | True Positives | False Positives | False Negatives | Status |
|---|---|---|---|---|---|
${metrics.fixtureResults
  .map(
    (r) =>
      `| \`${r.fixture}\` | ${r.truePositives + r.falseNegatives} | ${r.truePositives} | ${r.falsePositives} | ${r.falseNegatives} | ${r.crashed ? "💥 Crashed" : r.falsePositives === 0 && r.falseNegatives === 0 ? "✅ Perfect" : "⚠️ Discrepancy"} |`
  )
  .join("\n")}

---

## 3. Pilot Readiness Conclusion

${
  metrics.gatePassed
    ? "All primary MVP criteria have been satisfied. The multi-agent review pipeline, AST context enrichment, static analysis normalization, and verification engines achieve high precision without hallucinations or false positive regressions."
    : "MVP gate threshold requirements were not met. Further prompt tuning, confidence filtering, or verification adjustments are required before pilot deployment."
}
`;
}
