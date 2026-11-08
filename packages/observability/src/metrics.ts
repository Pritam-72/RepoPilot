/**
 * OpenTelemetry-compatible metrics recorder and Prometheus exposition generator (Phase 9)
 */

export interface HistogramSnapshot {
  count: number;
  sum: number;
  min: number;
  max: number;
  p50: number;
  p90: number;
  p95: number;
  p99: number;
}

export interface MetricsSnapshot {
  timestamp: string;
  reviewDurationMs: HistogramSnapshot;
  tokensConsumedTotal: Record<string, number>;
  totalTokens: number;
  estimatedCostUsd: number;
  reviewsTotal: {
    completed: number;
    partial: number;
    failed: number;
    skipped: number;
    total: number;
  };
  reviewFailureRate: number;
  queueDepth: number;
  providerErrorsTotal: Record<string, number>;
  rateLimitHitsTotal: Record<string, number>;
}

export class Histogram {
  private values: number[] = [];

  record(val: number): void {
    if (val < 0) return;
    this.values.push(val);
  }

  getSnapshot(): HistogramSnapshot {
    if (this.values.length === 0) {
      return { count: 0, sum: 0, min: 0, max: 0, p50: 0, p90: 0, p95: 0, p99: 0 };
    }

    const sorted = [...this.values].sort((a, b) => a - b);
    const count = sorted.length;
    const sum = sorted.reduce((acc, v) => acc + v, 0);
    const min = sorted[0]!;
    const max = sorted[count - 1]!;

    const getPercentile = (p: number) => {
      const idx = Math.min(count - 1, Math.floor((p / 100) * count));
      return sorted[idx]!;
    };

    return {
      count,
      sum: Number(sum.toFixed(2)),
      min,
      max,
      p50: getPercentile(50),
      p90: getPercentile(90),
      p95: getPercentile(95),
      p99: getPercentile(99),
    };
  }

  reset(): void {
    this.values = [];
  }
}

export class MetricsRegistry {
  private static instance: MetricsRegistry;

  private reviewDuration = new Histogram();
  private tokensByAgentModel = new Map<string, number>();
  private totalTokensCount = 0;
  private totalCost = 0;
  private reviewsStatus = { completed: 0, partial: 0, failed: 0, skipped: 0 };
  private currentQueueDepth = 0;
  private providerErrors = new Map<string, number>();
  private rateLimitHits = new Map<string, number>();

  static getInstance(): MetricsRegistry {
    if (!MetricsRegistry.instance) {
      MetricsRegistry.instance = new MetricsRegistry();
    }
    return MetricsRegistry.instance;
  }

  recordReviewDuration(ms: number): void {
    this.reviewDuration.record(ms);
  }

  recordTokens(agent: string, model: string, tokens: number): void {
    const key = `${agent}:${model}`;
    const prev = this.tokensByAgentModel.get(key) ?? 0;
    this.tokensByAgentModel.set(key, prev + tokens);
    this.totalTokensCount += tokens;

    // Approximate cost: blended average $1.50 per 1M tokens ($0.0000015/token)
    this.totalCost += tokens * 0.0000015;
  }

  recordReviewStatus(status: "completed" | "partial" | "failed" | "skipped"): void {
    this.reviewsStatus[status]++;
  }

  recordProviderError(provider: string, errorType: string): void {
    const key = `${provider}:${errorType}`;
    const prev = this.providerErrors.get(key) ?? 0;
    this.providerErrors.set(key, prev + 1);
  }

  recordRateLimitHit(endpoint: string): void {
    const prev = this.rateLimitHits.get(endpoint) ?? 0;
    this.rateLimitHits.set(endpoint, prev + 1);
  }

  setQueueDepth(depth: number): void {
    this.currentQueueDepth = Math.max(0, depth);
  }

  getSnapshot(): MetricsSnapshot {
    const totalReviews =
      this.reviewsStatus.completed +
      this.reviewsStatus.partial +
      this.reviewsStatus.failed +
      this.reviewsStatus.skipped;

    const attempted =
      this.reviewsStatus.completed + this.reviewsStatus.partial + this.reviewsStatus.failed;

    const failureRate = attempted > 0 ? this.reviewsStatus.failed / attempted : 0;

    const tokensMap: Record<string, number> = {};
    for (const [k, v] of this.tokensByAgentModel.entries()) {
      tokensMap[k] = v;
    }

    const providerErrorsMap: Record<string, number> = {};
    for (const [k, v] of this.providerErrors.entries()) {
      providerErrorsMap[k] = v;
    }

    const rateLimitMap: Record<string, number> = {};
    for (const [k, v] of this.rateLimitHits.entries()) {
      rateLimitMap[k] = v;
    }

    return {
      timestamp: new Date().toISOString(),
      reviewDurationMs: this.reviewDuration.getSnapshot(),
      tokensConsumedTotal: tokensMap,
      totalTokens: this.totalTokensCount,
      estimatedCostUsd: Number(this.totalCost.toFixed(6)),
      reviewsTotal: {
        ...this.reviewsStatus,
        total: totalReviews,
      },
      reviewFailureRate: Number(failureRate.toFixed(4)),
      queueDepth: this.currentQueueDepth,
      providerErrorsTotal: providerErrorsMap,
      rateLimitHitsTotal: rateLimitMap,
    };
  }

  toPrometheus(): string {
    const s = this.getSnapshot();
    const lines: string[] = [];

    lines.push("# HELP acr_review_duration_ms Review execution latency in milliseconds");
    lines.push("# TYPE acr_review_duration_ms summary");
    lines.push(`acr_review_duration_ms{quantile="0.5"} ${s.reviewDurationMs.p50}`);
    lines.push(`acr_review_duration_ms{quantile="0.9"} ${s.reviewDurationMs.p90}`);
    lines.push(`acr_review_duration_ms{quantile="0.95"} ${s.reviewDurationMs.p95}`);
    lines.push(`acr_review_duration_ms{quantile="0.99"} ${s.reviewDurationMs.p99}`);
    lines.push(`acr_review_duration_ms_sum ${s.reviewDurationMs.sum}`);
    lines.push(`acr_review_duration_ms_count ${s.reviewDurationMs.count}`);

    lines.push("# HELP acr_reviews_total Total number of pull request reviews processed");
    lines.push("# TYPE acr_reviews_total counter");
    lines.push(`acr_reviews_total{status="completed"} ${s.reviewsTotal.completed}`);
    lines.push(`acr_reviews_total{status="partial"} ${s.reviewsTotal.partial}`);
    lines.push(`acr_reviews_total{status="failed"} ${s.reviewsTotal.failed}`);
    lines.push(`acr_reviews_total{status="skipped"} ${s.reviewsTotal.skipped}`);

    lines.push("# HELP acr_review_failure_rate Ratio of failed reviews to attempted reviews");
    lines.push("# TYPE acr_review_failure_rate gauge");
    lines.push(`acr_review_failure_rate ${s.reviewFailureRate}`);

    lines.push("# HELP acr_queue_depth Current backlog depth in review queue");
    lines.push("# TYPE acr_queue_depth gauge");
    lines.push(`acr_queue_depth ${s.queueDepth}`);

    lines.push("# HELP acr_tokens_consumed_total Total tokens consumed by agent and model");
    lines.push("# TYPE acr_tokens_consumed_total counter");
    for (const [key, val] of Object.entries(s.tokensConsumedTotal)) {
      const [agent, model] = key.split(":");
      lines.push(`acr_tokens_consumed_total{agent="${agent}",model="${model}"} ${val}`);
    }

    lines.push("# HELP acr_estimated_cost_usd Cumulative estimated LLM token expenditure in USD");
    lines.push("# TYPE acr_estimated_cost_usd counter");
    lines.push(`acr_estimated_cost_usd ${s.estimatedCostUsd}`);

    lines.push("# HELP acr_provider_errors_total Count of external provider errors by type");
    lines.push("# TYPE acr_provider_errors_total counter");
    for (const [key, val] of Object.entries(s.providerErrorsTotal)) {
      const [provider, errType] = key.split(":");
      lines.push(`acr_provider_errors_total{provider="${provider}",error="${errType}"} ${val}`);
    }

    lines.push("# HELP acr_rate_limit_hits_total Number of requests rejected due to rate limits");
    lines.push("# TYPE acr_rate_limit_hits_total counter");
    for (const [endpoint, val] of Object.entries(s.rateLimitHitsTotal)) {
      lines.push(`acr_rate_limit_hits_total{endpoint="${endpoint}"} ${val}`);
    }

    return lines.join("\n") + "\n";
  }

  reset(): void {
    this.reviewDuration.reset();
    this.tokensByAgentModel.clear();
    this.totalTokensCount = 0;
    this.totalCost = 0;
    this.reviewsStatus = { completed: 0, partial: 0, failed: 0, skipped: 0 };
    this.currentQueueDepth = 0;
    this.providerErrors.clear();
    this.rateLimitHits.clear();
  }
}

export const metrics = MetricsRegistry.getInstance();

