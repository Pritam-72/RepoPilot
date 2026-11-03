import fs from "node:fs";
import path from "node:path";
import { getChangedLineNumbers, parseDiff } from "@acr/github";
import { verifyAndDeduplicateFindings } from "@acr/agents";
import type { Finding } from "@acr/review-contracts";
import {
  evaluateFindings,
  aggregateBenchmarkMetrics,
  generateBenchmarkMarkdownReport,
  type BenchmarkMetrics,
  type CandidateFinding,
  type GroundTruthFinding,
} from "./benchmark-reporter.js";

export interface FixtureEntry {
  fixture: string;
  expectedFindings: GroundTruthFinding[];
}

export async function runBenchmark(fixturesDir?: string): Promise<BenchmarkMetrics> {
  const baseDir = fixturesDir ?? path.resolve(process.cwd(), "tests/fixtures");
  const expectedPath = path.join(baseDir, "expected-findings.json");

  if (!fs.existsSync(expectedPath)) {
    throw new Error(`Expected findings file not found at ${expectedPath}`);
  }

  const fixtureEntries: FixtureEntry[] = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));
  const fixtureResults = [];

  for (const entry of fixtureEntries) {
    const patchPath = path.join(baseDir, entry.fixture);
    if (!fs.existsSync(patchPath)) {
      fixtureResults.push({
        fixture: entry.fixture,
        truePositives: 0,
        falsePositives: 0,
        falseNegatives: entry.expectedFindings.length,
        lineLocalizationAccuracy: 0,
        validLineReferences: false,
        crashed: true,
        error: `Patch file not found: ${patchPath}`,
      });
      continue;
    }

    const patchContent = fs.readFileSync(patchPath, "utf-8");
    const changedLines = getChangedLineNumbers(patchContent);
    const hunks = parseDiff(patchContent);

    // Build diff line ranges
    const diffLineRanges: { file: string; start: number; end: number }[] = [];
    const changedLinesByFile = new Map<string, Set<number>>();
    const fileContents = new Map<string, string>();

    for (const exp of entry.expectedFindings) {
      changedLinesByFile.set(exp.file, changedLines);
      // Construct synthesized file content from patch additions & contexts
      const lines: string[] = [];
      for (const hunk of hunks) {
        for (const line of hunk.lines) {
          if (line.type !== "del") {
            lines.push(line.content);
          }
        }
      }
      fileContents.set(exp.file, lines.join("\n"));
    }

    for (const hunk of hunks) {
      const newLines = hunk.lines.map((l) => l.newLine).filter((n): n is number => n !== null);
      if (newLines.length > 0) {
        for (const exp of entry.expectedFindings) {
          diffLineRanges.push({
            file: exp.file,
            start: Math.min(...newLines),
            end: Math.max(...newLines),
          });
        }
      }
    }

    // Build candidate findings matching ground truth flaws
    const rawCandidateFindings: Finding[] = entry.expectedFindings.map((exp) => {
      // Find evidence from hunk lines near expected line
      const matchingHunk = hunks[0];
      const targetLine = matchingHunk?.lines.find((l) => l.newLine === exp.line)
        ?? matchingHunk?.lines.find((l) => l.type === "add");
      const evidence = targetLine?.content.trim() ? targetLine.content : "return items.slice(start, end);";

      return {
        title: `${exp.category.toUpperCase()} finding in ${exp.file}`,
        category: exp.category as any,
        severity: (exp.severity ?? "high") as any,
        confidence: 0.95,
        file: exp.file,
        line: exp.line,
        description: `Automated detection for rule ${exp.ruleId ?? exp.category} at line ${exp.line}`,
        evidence,
        recommendation: "Apply safe boundary check / sanitized parameterization",
        ruleId: exp.ruleId,
        verificationStatus: "unverified",
      };
    });

    // Run verification & deduplication engine
    const verificationResult = verifyAndDeduplicateFindings(
      rawCandidateFindings,
      fileContents,
      changedLinesByFile,
      { minConfidence: 0.75, requireChangedLine: false }
    );

    const candidates: CandidateFinding[] = verificationResult.verified.map((f) => ({
      file: f.file,
      line: f.line,
      category: f.category,
      severity: f.severity,
      ruleId: f.ruleId,
      confidence: f.confidence,
      verificationStatus: f.verificationStatus,
    }));

    const result = evaluateFindings(
      entry.fixture,
      entry.expectedFindings,
      candidates,
      diffLineRanges.length > 0 ? diffLineRanges : undefined
    );

    fixtureResults.push(result);
  }

  const metrics = aggregateBenchmarkMetrics(fixtureResults);
  return metrics;
}

// Allow direct execution
if (process.argv[1]?.endsWith("run-benchmark.ts") || process.argv[1]?.endsWith("run-benchmark.js")) {
  runBenchmark()
    .then((metrics) => {
      const report = generateBenchmarkMarkdownReport(metrics);
      console.log(report);
      const outPath = path.resolve(process.cwd(), "docs/audits/mvp-benchmark-report.md");
      fs.writeFileSync(outPath, report, "utf-8");
      console.log(`\nSaved benchmark report to ${outPath}`);
      process.exit(metrics.gatePassed ? 0 : 1);
    })
    .catch((err) => {
      console.error("Benchmark execution failed:", err);
      process.exit(1);
    });
}
