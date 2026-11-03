import React from "react";
import { Nav } from "../../components/nav.js";

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

const DEFAULT_ANALYTICS: AnalyticsData = {
  metrics: {
    reviews: {
      total: 128,
      completed: 125,
      failed: 3,
      successRate: 97.7,
      meanDurationSec: 3.8,
    },
    findings: {
      total: 312,
      verified: 298,
      verificationRate: 95.5,
      bySeverity: {
        critical: 18,
        high: 64,
        medium: 142,
        low: 76,
        informational: 12,
      },
      byCategory: {
        correctness: 110,
        security: 82,
        performance: 48,
        quality: 42,
        dependency: 30,
      },
    },
    feedback: {
      useful: 94,
      incorrect: 4,
      dismissed: 8,
      acceptanceRate: 88.7,
    },
  },
};

export default function AnalyticsPage() {
  const data = DEFAULT_ANALYTICS;
  const { reviews, findings, feedback } = data.metrics;

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <Nav activePath="/analytics" />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
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
              {feedback.useful} positive developer votes
            </span>
          </div>
        </div>

        {/* Breakdown Grids */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
          {/* Findings by Severity */}
          <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827", marginBottom: "1rem" }}>
              Findings by Severity
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {Object.entries(findings.bySeverity).map(([severity, count]) => {
                const total = findings.total || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={severity}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                      <span style={{ textTransform: "capitalize", fontWeight: 500, color: "#374151" }}>{severity}</span>
                      <span style={{ color: "#6b7280" }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ width: "100%", height: "0.5rem", background: "#f3f4f6", borderRadius: "9999px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background:
                            severity === "critical" ? "#dc2626" :
                            severity === "high" ? "#ea580c" :
                            severity === "medium" ? "#d97706" :
                            severity === "low" ? "#2563eb" : "#6b7280",
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
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827", marginBottom: "1rem" }}>
              Findings by Agent Category
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {Object.entries(findings.byCategory).map(([category, count]) => {
                const total = findings.total || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={category}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                      <span style={{ textTransform: "capitalize", fontWeight: 500, color: "#374151" }}>{category}</span>
                      <span style={{ color: "#6b7280" }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ width: "100%", height: "0.5rem", background: "#f3f4f6", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "#4f46e5" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
