import { describe, it, expect, beforeEach } from "vitest";
import {
  metrics,
  tracer,
  evaluateAlertRules,
  generatePrometheusAlertRulesYaml,
  formatTraceparent,
  parseTraceparent,
} from "../index.js";

describe("OpenTelemetry Metrics, Tracing & Alerting (Phase 9)", () => {
  beforeEach(() => {
    metrics.reset();
    tracer.reset();
  });

  describe("MetricsRegistry & Prometheus Exposition", () => {
    it("records review durations and computes accurate percentiles", () => {
      // Record 10 review durations
      [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].forEach((d) =>
        metrics.recordReviewDuration(d)
      );

      const snap = metrics.getSnapshot();
      expect(snap.reviewDurationMs.count).toBe(10);
      expect(snap.reviewDurationMs.min).toBe(100);
      expect(snap.reviewDurationMs.max).toBe(1000);
      expect(snap.reviewDurationMs.p50).toBe(600);
      expect(snap.reviewDurationMs.p95).toBe(1000);
    });

    it("tracks tokens consumed and estimates blended USD expenditure", () => {
      metrics.recordTokens("bug-reviewer", "gemini-1.5-pro", 10_000);
      metrics.recordTokens("security-reviewer", "gemini-1.5-pro", 15_000);

      const snap = metrics.getSnapshot();
      expect(snap.totalTokens).toBe(25_000);
      expect(snap.tokensConsumedTotal["bug-reviewer:gemini-1.5-pro"]).toBe(10_000);
      expect(snap.tokensConsumedTotal["security-reviewer:gemini-1.5-pro"]).toBe(15_000);
      expect(snap.estimatedCostUsd).toBeCloseTo(0.0375, 4);
    });

    it("computes failure rate gauge and queue depth", () => {
      metrics.recordReviewStatus("completed");
      metrics.recordReviewStatus("completed");
      metrics.recordReviewStatus("failed");
      metrics.recordReviewStatus("skipped");
      metrics.setQueueDepth(12);

      const snap = metrics.getSnapshot();
      expect(snap.reviewsTotal.completed).toBe(2);
      expect(snap.reviewsTotal.failed).toBe(1);
      expect(snap.reviewsTotal.skipped).toBe(1);
      expect(snap.reviewsTotal.total).toBe(4);
      expect(snap.reviewFailureRate).toBeCloseTo(0.3333, 2); // 1 / 3 attempted
      expect(snap.queueDepth).toBe(12);
    });

    it("formats metrics into compliant Prometheus exposition format", () => {
      metrics.recordReviewDuration(250);
      metrics.recordReviewStatus("completed");
      metrics.recordTokens("bug-reviewer", "gemini-1.5-pro", 500);

      const prom = metrics.toPrometheus();
      expect(prom).toContain("# HELP acr_review_duration_ms");
      expect(prom).toContain("# TYPE acr_review_duration_ms summary");
      expect(prom).toContain('acr_review_duration_ms{quantile="0.5"} 250');
      expect(prom).toContain('acr_reviews_total{status="completed"} 1');
      expect(prom).toContain('acr_tokens_consumed_total{agent="bug-reviewer",model="gemini-1.5-pro"} 500');
    });
  });

  describe("Distributed Tracing (W3C Trace Context)", () => {
    it("formats and parses traceparent header correctly", () => {
      const traceId = "4bf92f3577b34da6a3ce929d0e0e4736";
      const spanId = "00f067aa0ba902b7";
      const header = formatTraceparent(traceId, spanId, true);

      expect(header).toBe(`00-${traceId}-${spanId}-01`);

      const parsed = parseTraceparent(header);
      expect(parsed).not.toBeNull();
      expect(parsed?.traceId).toBe(traceId);
      expect(parsed?.parentSpanId).toBe(spanId);
      expect(parsed?.sampled).toBe(true);
    });

    it("creates, tracks, and ends spans with duration and status", () => {
      const span = tracer.startSpan("webhook-received", {
        attributes: { repository: "Pritam-72/RepoPilot", pr: 42 },
      });

      expect(span.traceId).toBeDefined();
      expect(span.spanId).toBeDefined();
      expect(span.status).toBe("ok");

      tracer.endSpan(span, "ok");
      expect(span.endTime).toBeDefined();
      expect(span.durationMs).toBeGreaterThanOrEqual(0);
    });

    it("propagates parent trace context across child spans", () => {
      const parent = tracer.startSpan("parent-job");
      const parentHeader = formatTraceparent(parent.traceId, parent.spanId);

      const child = tracer.startSpan("child-agent", { parentHeader });
      expect(child.traceId).toBe(parent.traceId);
      expect(child.parentSpanId).toBe(parent.spanId);
    });
  });

  describe("SLO Alerting Evaluation", () => {
    it("triggers critical alert when failure rate exceeds 2% ceiling", () => {
      // 10 reviews, 2 failed = 20% failure rate
      for (let i = 0; i < 8; i++) metrics.recordReviewStatus("completed");
      for (let i = 0; i < 2; i++) metrics.recordReviewStatus("failed");

      const snap = metrics.getSnapshot();
      const alerts = evaluateAlertRules(snap);

      const failureAlert = alerts.find((a) => a.id === "HighReviewFailureRate");
      expect(failureAlert).toBeDefined();
      expect(failureAlert?.severity).toBe("critical");
      expect(failureAlert?.currentValue).toBe(0.2);
    });

    it("triggers queue backlog alert when depth exceeds 50", () => {
      metrics.setQueueDepth(65);
      const snap = metrics.getSnapshot();
      const alerts = evaluateAlertRules(snap);

      const backlogAlert = alerts.find((a) => a.id === "ReviewQueueBacklog");
      expect(backlogAlert).toBeDefined();
      expect(backlogAlert?.severity).toBe("warning");
    });

    it("generates Prometheus alerting rules YAML", () => {
      const yaml = generatePrometheusAlertRulesYaml();
      expect(yaml).toContain("alert: HighReviewFailureRate");
      expect(yaml).toContain("alert: ReviewQueueBacklog");
      expect(yaml).toContain("alert: ProviderErrorSpike");
    });
  });
});
