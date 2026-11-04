"use client";

import React, { useEffect, useState } from "react";
import { Nav } from "../../components/nav";

export interface AnalyticsData {
  metrics: {
    reviews: {
      total: number;
      completed: number;
      failed: number;
      successRate: number;
      meanDurationSec: number;
    };
    findings: {
      total: number;
      verified: number;
      verificationRate: number;
      bySeverity: Record<string, number>;
      byCategory: Record<string, number>;
    };
    feedback: {
      useful: number;
      incorrect: number;
      dismissed: number;
      acceptanceRate: number;
    };
  };
}

export const DEFAULT_ANALYTICS: AnalyticsData = {
  metrics: {
    reviews: {
      total: 1,
      completed: 1,
      failed: 0,
      successRate: 100,
      meanDurationSec: 14.2,
    },
    findings: {
      total: 1,
      verified: 1,
      verificationRate: 100,
      bySeverity: {
        critical: 0,
        high: 1,
        medium: 0,
        low: 0,
        informational: 0,
      },
      byCategory: {
        correctness: 1,
        security: 0,
        performance: 0,
        quality: 0,
        dependency: 0,
      },
    },
    feedback: {
      useful: 1,
      incorrect: 0,
      dismissed: 0,
      acceptanceRate: 100,
    },
  },
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(DEFAULT_ANALYTICS);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("http://localhost:3000/api/v1/analytics/overview");
        if (res.ok) {
          const liveData = await res.json();
          if (liveData?.metrics) {
            setData(liveData);
          }
        }
      } catch {
        // Fallback to initial state
      }
    }
    fetchAnalytics();
  }, []);

  const { reviews, findings, feedback } = data.metrics;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827", margin: 0 }}>
            Organization Analytics & Quality
          </h1>
          <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
            Aggregate review throughput, agent accuracy metrics, and developer feedback trends.
          </p>
        </div>

        {/* Top KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
            <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>Total Reviews</span>
            <div style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827", marginTop: "0.25rem" }}>
              {reviews.total}
            </div>
            <span style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: 500 }}>
              {reviews.successRate}% success rate
            </span>
          </div>

          <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
            <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>Mean Review Latency</span>
            <div style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827", marginTop: "0.25rem" }}>
              {reviews.meanDurationSec}s
            </div>
            <span style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 500 }}>
              Webhook to GitHub comment
            </span>
          </div>

          <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
            <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>Verified Finding Rate</span>
            <div style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827", marginTop: "0.25rem" }}>
              {findings.verificationRate}%
            </div>
            <span style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: 500 }}>
              {findings.verified} of {findings.total} verified
            </span>
          </div>

          <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
            <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>Helpful Feedback Rate</span>
            <div style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827", marginTop: "0.25rem" }}>
              {feedback.acceptanceRate}%
            </div>
            <span style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: 500 }}>
              {feedback.useful} positive ratings
            </span>
          </div>
        </div>

        {/* Severity & Category Breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Findings by Severity */}
          <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827", margin: "0 0 1rem 0" }}>
              Findings by Severity
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {Object.entries(findings.bySeverity).map(([sev, count]) => {
                const total = Math.max(1, findings.total);
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={sev}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                      <span style={{ textTransform: "capitalize", fontWeight: 500, color: "#374151" }}>{sev}</span>
                      <span style={{ color: "#6b7280" }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: "0.5rem", background: "#f3f4f6", borderRadius: "9999px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background:
                            sev === "critical" ? "#dc2626" :
                            sev === "high" ? "#ea580c" :
                            sev === "medium" ? "#f59e0b" : "#3b82f6",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Findings by Category */}
          <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827", margin: "0 0 1rem 0" }}>
              Findings by Agent Category
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {Object.entries(findings.byCategory).map(([cat, count]) => {
                const total = Math.max(1, findings.total);
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={cat}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                      <span style={{ textTransform: "capitalize", fontWeight: 500, color: "#374151" }}>{cat}</span>
                      <span style={{ color: "#6b7280" }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: "0.5rem", background: "#f3f4f6", borderRadius: "9999px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: "#6366f1",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
    </div>
  );
}
