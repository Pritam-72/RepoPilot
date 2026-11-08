import type { MetricsSnapshot } from "./metrics.js";

/**
 * Production Alerting & SLO Threshold Rules (plan.md Phase 9 & Section 11)
 */

export interface AlertRule {
  id: string;
  name: string;
  severity: "critical" | "warning";
  threshold: number;
  description: string;
  evaluate: (snapshot: MetricsSnapshot) => {
    triggered: boolean;
    currentValue: number;
    message?: string;
  };
}

export interface ActiveAlert {
  id: string;
  name: string;
  severity: "critical" | "warning";
  currentValue: number;
  threshold: number;
  message: string;
  triggeredAt: string;
}

export const PRODUCTION_ALERT_RULES: AlertRule[] = [
  {
    id: "HighReviewFailureRate",
    name: "Review Failure Rate Exceeds SLO Floor",
    severity: "critical",
    threshold: 0.02, // 2% failure rate ceiling per plan.md Section 11
    description: "Failure rate (reviews failed / reviews attempted) has exceeded the 2% ceiling.",
    evaluate: (s) => ({
      triggered: s.reviewsTotal.total >= 5 && s.reviewFailureRate > 0.02,
      currentValue: s.reviewFailureRate,
      message: `Review failure rate is ${(s.reviewFailureRate * 100).toFixed(2)}%, exceeding 2.0% SLO ceiling`,
    }),
  },
  {
    id: "ReviewQueueBacklog",
    name: "Review Queue Backlog Critical",
    severity: "warning",
    threshold: 50,
    description: "Queue depth has accumulated more than 50 pending PR review jobs.",
    evaluate: (s) => ({
      triggered: s.queueDepth > 50,
      currentValue: s.queueDepth,
      message: `Queue depth is ${s.queueDepth} pending jobs, exceeding threshold of 50`,
    }),
  },
  {
    id: "ProviderErrorSpike",
    name: "LLM Provider Error Spike (429 / 5xx)",
    severity: "critical",
    threshold: 10,
    description: "More than 10 upstream provider failures or rate-limit rejections observed.",
    evaluate: (s) => {
      const totalErrors = Object.values(s.providerErrorsTotal).reduce((a, b) => a + b, 0);
      return {
        triggered: totalErrors >= 10,
        currentValue: totalErrors,
        message: `Total external provider error count reached ${totalErrors}`,
      };
    },
  },
  {
    id: "ReviewBudgetExceeded",
    name: "Token Budget Exceeded Warning",
    severity: "warning",
    threshold: 100_000,
    description: "Total token consumption has exceeded single-review token budget threshold.",
    evaluate: (s) => ({
      triggered: s.totalTokens >= 100_000,
      currentValue: s.totalTokens,
      message: `Total tokens consumed is ${s.totalTokens}, approaching token budget threshold`,
    }),
  },
  {
    id: "HighReviewLatency",
    name: "P95 Review Latency Exceeds Target",
    severity: "warning",
    threshold: 120_000, // 120 seconds
    description: "95th percentile review latency exceeds 120 seconds.",
    evaluate: (s) => ({
      triggered: s.reviewDurationMs.count >= 5 && s.reviewDurationMs.p95 > 120_000,
      currentValue: s.reviewDurationMs.p95,
      message: `P95 review latency is ${s.reviewDurationMs.p95}ms, exceeding 120,000ms target`,
    }),
  },
];

export function evaluateAlertRules(
  snapshot: MetricsSnapshot,
  rules: AlertRule[] = PRODUCTION_ALERT_RULES
): ActiveAlert[] {
  const activeAlerts: ActiveAlert[] = [];
  const now = new Date().toISOString();

  for (const rule of rules) {
    const res = rule.evaluate(snapshot);
    if (res.triggered) {
      activeAlerts.push({
        id: rule.id,
        name: rule.name,
        severity: rule.severity,
        currentValue: res.currentValue,
        threshold: rule.threshold,
        message: res.message || rule.description,
        triggeredAt: now,
      });
    }
  }

  return activeAlerts;
}

export function generatePrometheusAlertRulesYaml(): string {
  return `groups:
  - name: repopilot_production_alerts
    rules:
      - alert: HighReviewFailureRate
        expr: acr_review_failure_rate > 0.02
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Review failure rate > 2% (SLO breached)"
          description: "Current failure rate is {{ $value }}."

      - alert: ReviewQueueBacklog
        expr: acr_queue_depth > 50
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Review queue backlog > 50 jobs"
          description: "Current queue backlog is {{ $value }} jobs."

      - alert: ProviderErrorSpike
        expr: sum(rate(acr_provider_errors_total[5m])) > 10
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "LLM Provider errors spiking"
          description: "Upstream AI model provider is returning 429 rate-limits or 5xx failures."

      - alert: HighReviewLatency
        expr: acr_review_duration_ms{quantile="0.95"} > 120000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "P95 Review Latency > 120 seconds"
          description: "P95 review completion duration has exceeded target threshold."
`;
}

