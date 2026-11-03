import React from "react";

export interface DashboardMetric {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

export interface ReviewRunSummary {
  id: string;
  repository: string;
  pullNumber: number;
  title: string;
  status: "completed" | "analyzing" | "failed";
  findingsCount: number;
  criticalCount: number;
  createdAt: string;
  durationMs: number;
}

export const sampleMetrics: DashboardMetric[] = [
  { label: "Total Reviews", value: "142", change: "+12% this week", isPositive: true },
  { label: "Verified Findings", value: "89", change: "92% precision rate", isPositive: true },
  { label: "False Positive Rate", value: "7.8%", change: "Within <15% target", isPositive: true },
  { label: "Avg Review Latency", value: "24.3s", change: "-3.2s optimization", isPositive: true },
];

export const sampleRecentRuns: ReviewRunSummary[] = [
  {
    id: "run-101",
    repository: "Pritam-72/RepoPilot",
    pullNumber: 42,
    title: "fix: prevent off-by-one boundary traversal in pagination",
    status: "completed",
    findingsCount: 1,
    criticalCount: 0,
    createdAt: "5m ago",
    durationMs: 14200,
  },
  {
    id: "run-102",
    repository: "acme-corp/ecommerce-api",
    pullNumber: 88,
    title: "feat: add user account balance reconciliation endpoints",
    status: "completed",
    findingsCount: 2,
    criticalCount: 1,
    createdAt: "28m ago",
    durationMs: 22100,
  },
  {
    id: "run-103",
    repository: "infra-team/auth-service",
    pullNumber: 15,
    title: "refactor: simplify token validation logic",
    status: "completed",
    findingsCount: 0,
    criticalCount: 0,
    createdAt: "1h ago",
    durationMs: 9800,
  },
];

export default function DashboardPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, margin: 0, color: "#111827" }}>
          Review Operations Dashboard
        </h1>
        <p style={{ margin: "0.5rem 0 0 0", color: "#6b7280", fontSize: "1rem" }}>
          Live telemetry and agentic review metrics across tracked repositories
        </p>
      </div>

      {/* Metrics Grid */}
      <div
        data-testid="metrics-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {sampleMetrics.map((metric) => (
          <div
            key={metric.label}
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "1.25rem",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>{metric.label}</span>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#111827", margin: "0.375rem 0" }}>
              {metric.value}
            </div>
            {metric.change && (
              <span style={{ fontSize: "0.75rem", color: metric.isPositive ? "#16a34a" : "#dc2626", fontWeight: 500 }}>
                {metric.change}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Recent Reviews Table */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          overflow: "hidden",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ padding: "1.25rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, margin: 0, color: "#111827" }}>
              Recent Review Runs
            </h2>
            <span style={{ fontSize: "0.8125rem", color: "#6b7280" }}>
              Latest pull requests processed by multi-agent pipeline
            </span>
          </div>
          <a
            href="/repositories"
            style={{ fontSize: "0.875rem", color: "#2563eb", fontWeight: 500, textDecoration: "none" }}
          >
            Manage Repositories →
          </a>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table data-testid="recent-runs-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", color: "#6b7280", fontSize: "0.75rem", textTransform: "uppercase" }}>
                <th style={{ padding: "0.75rem 1.25rem" }}>Repository / PR</th>
                <th style={{ padding: "0.75rem 1.25rem" }}>Status</th>
                <th style={{ padding: "0.75rem 1.25rem" }}>Findings</th>
                <th style={{ padding: "0.75rem 1.25rem" }}>Duration</th>
                <th style={{ padding: "0.75rem 1.25rem" }}>Timestamp</th>
                <th style={{ padding: "0.75rem 1.25rem", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sampleRecentRuns.map((run) => (
                <tr key={run.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ fontWeight: 600, color: "#111827" }}>
                      {run.repository} <span style={{ color: "#2563eb" }}>#{run.pullNumber}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.125rem" }}>{run.title}</div>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        background: run.status === "completed" ? "#f0fdf4" : "#eff6ff",
                        color: run.status === "completed" ? "#166534" : "#1e40af",
                        border: `1px solid ${run.status === "completed" ? "#bbf7d0" : "#bfdbfe"}`,
                      }}
                    >
                      {run.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    {run.findingsCount === 0 ? (
                      <span style={{ color: "#16a34a", fontWeight: 500 }}>Clean (0)</span>
                    ) : (
                      <span style={{ fontWeight: 600, color: run.criticalCount > 0 ? "#dc2626" : "#d97706" }}>
                        {run.findingsCount} finding{run.findingsCount > 1 ? "s" : ""}
                        {run.criticalCount > 0 && ` (${run.criticalCount} crit)`}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "1rem 1.25rem", color: "#4b5563" }}>
                    {(run.durationMs / 1000).toFixed(1)}s
                  </td>
                  <td style={{ padding: "1rem 1.25rem", color: "#9ca3af" }}>
                    {run.createdAt}
                  </td>
                  <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                    <a
                      href={`/reviews/${run.id}`}
                      style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}
                    >
                      Inspect →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

