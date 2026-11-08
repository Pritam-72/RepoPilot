import { describe, it, expect, beforeEach } from "vitest";
import {
  metrics,
  tracer,
  evaluateAlertRules,
  generatePrometheusAlertRulesYaml,
  formatTraceparent,
  parseTraceparent,
} from "@acr/observability";
import { evaluatePrTriviality } from "@acr/repository-context";
import { buildDockerRunArgs, type SandboxConfig } from "@acr/static-analysis";
import { runLoadTest } from "../load/load-test.js";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

describe("Phase 9: Production Hardening, Optimization & Deployment", () => {
  beforeEach(() => {
    metrics.reset();
    tracer.reset();
  });

  describe("1. OpenTelemetry Metrics & Prometheus Scraper Integration", () => {
    it("records full review lifecycle metrics and generates Prometheus exposition format", () => {
      metrics.recordReviewDuration(350);
      metrics.recordReviewStatus("completed");
      metrics.recordTokens("bug-reviewer", "gemini-1.5-pro", 2500);
      metrics.recordTokens("security-reviewer", "gemini-1.5-pro", 3000);
      metrics.setQueueDepth(5);

      const snap = metrics.getSnapshot();
      expect(snap.reviewsTotal.completed).toBe(1);
      expect(snap.totalTokens).toBe(5500);
      expect(snap.estimatedCostUsd).toBeGreaterThan(0);
      expect(snap.queueDepth).toBe(5);

      const prom = metrics.toPrometheus();
      expect(prom).toContain("acr_review_duration_ms");
      expect(prom).toContain('acr_reviews_total{status="completed"} 1');
      expect(prom).toContain("acr_queue_depth 5");
    });
  });

  describe("2. W3C Distributed Tracing (traceparent Context Propagation)", () => {
    it("generates, parses, and propagates traceparent across pipeline stages", () => {
      const traceId = "1234567890abcdef1234567890abcdef";
      const spanId = "abcdef1234567890";
      const header = formatTraceparent(traceId, spanId, true);

      expect(header).toBe(`00-${traceId}-${spanId}-01`);
      const parsed = parseTraceparent(header);
      expect(parsed?.traceId).toBe(traceId);
      expect(parsed?.parentSpanId).toBe(spanId);

      // Verify span lifecycle
      const span = tracer.startSpan("review-job-execution", { parentHeader: header });
      expect(span.traceId).toBe(traceId);
      expect(span.parentSpanId).toBe(spanId);

      tracer.endSpan(span, "ok");
      expect(span.endTime).toBeDefined();
      expect(span.status).toBe("ok");
    });
  });

  describe("3. SLO Alert Rules & Failure Ceiling Enforcement", () => {
    it("triggers critical alert when failure rate exceeds 2% ceiling", () => {
      for (let i = 0; i < 9; i++) metrics.recordReviewStatus("completed");
      metrics.recordReviewStatus("failed"); // 1/10 = 10% failure rate (> 2% ceiling)

      const snap = metrics.getSnapshot();
      const alerts = evaluateAlertRules(snap);

      const failureAlert = alerts.find((a) => a.id === "HighReviewFailureRate");
      expect(failureAlert).toBeDefined();
      expect(failureAlert?.severity).toBe("critical");
      expect(failureAlert?.currentValue).toBe(0.1);
    });

    it("triggers alert on queue backlog accumulating past threshold", () => {
      metrics.setQueueDepth(55); // > 50 jobs
      const snap = metrics.getSnapshot();
      const alerts = evaluateAlertRules(snap);

      const backlogAlert = alerts.find((a) => a.id === "ReviewQueueBacklog");
      expect(backlogAlert).toBeDefined();
      expect(backlogAlert?.severity).toBe("warning");
    });

    it("generates valid Prometheus alert rules YAML", () => {
      const yaml = generatePrometheusAlertRulesYaml();
      expect(yaml).toContain("alert: HighReviewFailureRate");
      expect(yaml).toContain("alert: ReviewQueueBacklog");
      expect(yaml).toContain("alert: ProviderErrorSpike");
    });
  });

  describe("4. Performance: Skip-Trivial-PR Heuristics", () => {
    it("identifies documentation-only changes and skips heavy LLM review", () => {
      const docPr = [
        { path: "README.md" },
        { path: "docs/getting-started.md" },
        { path: "LICENSE" },
      ];

      const res = evaluatePrTriviality(docPr);
      expect(res.isTrivial).toBe(true);
      expect(res.category).toBe("docs_only");
    });

    it("identifies lockfile-only changes as trivial", () => {
      const lockfilePr = [{ path: "pnpm-lock.yaml" }];
      const res = evaluatePrTriviality(lockfilePr);
      expect(res.isTrivial).toBe(true);
      expect(res.category).toBe("lockfile_only");
    });

    it("correctly identifies code changes as non-trivial requiring full review", () => {
      const codePr = [
        { path: "src/auth/jwt.ts" },
        { path: "src/controllers/user.ts" },
      ];

      const res = evaluatePrTriviality(codePr);
      expect(res.isTrivial).toBe(false);
      expect(res.category).toBe("non_trivial");
    });
  });

  describe("5. Security & Container Hardening", () => {
    it("configures unprivileged user and no-new-privileges flags in sandbox execution", () => {
      const config: SandboxConfig = {
        workdir: process.cwd(),
        network: "none",
        readOnlyRoot: true,
      };

      const args = buildDockerRunArgs(config, "npm test");
      expect(args).toContain("--security-opt=no-new-privileges:true");
      expect(args).toContain("--network");
      expect(args).toContain("none");
      expect(args).toContain("-u");
      expect(args).toContain("1000:1000");
      expect(args).toContain("--read-only");
    });

    it("verifies production Dockerfile configures unprivileged user and healthcheck", () => {
      const dockerfilePath = path.resolve(process.cwd(), "Dockerfile");
      const dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      expect(dockerfileContent).toContain("USER acruser");
      expect(dockerfileContent).toContain("HEALTHCHECK");
      expect(dockerfileContent).toContain("/healthz");
    });

    it("verifies operational runbook and deployment compose exist", () => {
      expect(existsSync(path.resolve(process.cwd(), "RUNBOOK.md"))).toBe(true);
      expect(existsSync(path.resolve(process.cwd(), "docker-compose.prod.yml"))).toBe(true);
      expect(existsSync(path.resolve(process.cwd(), "prometheus.yml"))).toBe(true);
    });
  });

  describe("6. Load Testing & SLO Concurrency Verification", () => {
    it("meets all SLO targets under concurrent load", async () => {
      const report = await runLoadTest(10, 30);

      expect(report.totalRequests).toBe(30);
      expect(report.failureRate).toBeLessThanOrEqual(0.02); // <= 2% SLO ceiling
      expect(report.sloCompliance.failureRateTargetMet).toBe(true);
      expect(report.sloCompliance.p95LatencyTargetMet).toBe(true);
      expect(report.skippedCount).toBeGreaterThan(0); // Trivial PR fast-path exercised

      const reportPath = path.resolve(process.cwd(), "docs", "audits", "load-test-report.md");
      expect(existsSync(reportPath)).toBe(true);
    });
  });
});

