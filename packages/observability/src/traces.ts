import { randomBytes } from "node:crypto";

/**
 * OpenTelemetry / W3C Trace Context Implementation (Phase 9)
 * Formats and propagates traceparent: "00-<trace_id>-<span_id>-<trace_flags>"
 */

export interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string | undefined;
  name: string;
  startTime: number;
  endTime?: number | undefined;
  durationMs?: number | undefined;
  status: "ok" | "error";
  attributes: Record<string, string | number | boolean>;
  error?: string | undefined;
}

export function generateTraceId(): string {
  return randomBytes(16).toString("hex"); // 32 hex chars
}

export function generateSpanId(): string {
  return randomBytes(8).toString("hex"); // 16 hex chars
}

export function formatTraceparent(traceId: string, spanId: string, sampled = true): string {
  const flags = sampled ? "01" : "00";
  return `00-${traceId}-${spanId}-${flags}`;
}

export function parseTraceparent(header?: string): { traceId: string; parentSpanId: string; sampled: boolean } | null {
  if (!header) return null;
  const match = header.trim().match(/^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/i);
  if (!match) return null;

  return {
    traceId: match[1]!,
    parentSpanId: match[2]!,
    sampled: match[3] === "01",
  };
}

export class Tracer {
  private static instance: Tracer;
  private spans = new Map<string, Span>();

  static getInstance(): Tracer {
    if (!Tracer.instance) {
      Tracer.instance = new Tracer();
    }
    return Tracer.instance;
  }

  startSpan(
    name: string,
    options?: {
      parentHeader?: string | undefined;
      parentSpanId?: string | undefined;
      traceId?: string | undefined;
      attributes?: Record<string, string | number | boolean> | undefined;
    }
  ): Span {
    let traceId = options?.traceId;
    let parentSpanId = options?.parentSpanId;

    if (options?.parentHeader) {
      const parsed = parseTraceparent(options.parentHeader);
      if (parsed) {
        traceId = parsed.traceId;
        parentSpanId = parsed.parentSpanId;
      }
    }

    if (!traceId) {
      traceId = generateTraceId();
    }

    const spanId = generateSpanId();
    const span: Span = {
      traceId,
      spanId,
      parentSpanId,
      name,
      startTime: Date.now(),
      status: "ok",
      attributes: options?.attributes ?? {},
    };

    this.spans.set(spanId, span);
    return span;
  }

  endSpan(span: Span, status: "ok" | "error" = "ok", error?: string): Span {
    span.endTime = Date.now();
    span.durationMs = span.endTime - span.startTime;
    span.status = status;
    if (error) {
      span.error = error;
    }
    return span;
  }

  getSpan(spanId: string): Span | undefined {
    return this.spans.get(spanId);
  }

  getTraceSpans(traceId: string): Span[] {
    return Array.from(this.spans.values()).filter((s) => s.traceId === traceId);
  }

  reset(): void {
    this.spans.clear();
  }
}

export const tracer = Tracer.getInstance();

