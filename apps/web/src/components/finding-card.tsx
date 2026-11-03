import React from "react";
import { DiffViewer } from "./diff-viewer.js";
import { FeedbackButton } from "./feedback-button.js";
import type { Finding } from "@acr/review-contracts";

export interface FindingCardProps {
  finding: Finding & { id?: string | undefined };
  onFeedbackChange?: ((findingId: string, feedback: "useful" | "incorrect" | "dismissed") => void) | undefined;
}

export function FindingCard({ finding, onFeedbackChange }: FindingCardProps) {
  const findingId = finding.id ?? `finding-${finding.file}-${finding.line}`;

  const severityStyles: Record<string, { bg: string; text: string; border: string }> = {
    critical: { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
    high: { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" },
    medium: { bg: "#fefce8", text: "#854d0e", border: "#fef08a" },
    low: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
  };

  const categoryLabels: Record<string, string> = {
    correctness: "Bug / Correctness",
    security: "Security Vulnerability",
    maintainability: "Maintainability / Quality",
    testing: "Test Gap",
  };

  const sevStyle = severityStyles[finding.severity] ?? severityStyles.low;
  const categoryLabel = categoryLabels[finding.category] ?? finding.category;

  return (
    <div
      data-testid={`finding-card-${findingId}`}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        background: "#ffffff",
        padding: "1.25rem",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              padding: "0.125rem 0.5rem",
              borderRadius: "0.25rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              background: sevStyle?.bg,
              color: sevStyle?.text,
              border: `1px solid ${sevStyle?.border}`,
            }}
          >
            {finding.severity.toUpperCase()}
          </span>
          <span
            style={{
              padding: "0.125rem 0.5rem",
              borderRadius: "0.25rem",
              fontSize: "0.75rem",
              fontWeight: 500,
              background: "#f3f4f6",
              color: "#374151",
            }}
          >
            {categoryLabel}
          </span>
          {finding.ruleId && (
            <code style={{ fontSize: "0.75rem", color: "#6b7280", background: "#f9fafb", padding: "0.125rem 0.375rem", borderRadius: "0.25rem" }}>
              {finding.ruleId}
            </code>
          )}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
          Confidence: <strong>{Math.round(finding.confidence * 100)}%</strong>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0.25rem 0", fontSize: "1rem", fontWeight: 600, color: "#111827" }}>
          {finding.title}
        </h4>
        <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "#4b5563", lineHeight: 1.5 }}>
          {finding.description}
        </p>
      </div>

      <div style={{ fontSize: "0.8125rem", color: "#374151", background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", border: "1px solid #e2e8f0" }}>
        <span>File: <strong style={{ color: "#0f172a" }}>{finding.file}</strong>, Line <strong style={{ color: "#0f172a" }}>{finding.line}</strong></span>
      </div>

      {finding.evidence && (
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Observed Evidence
          </span>
          <pre
            style={{
              margin: "0.25rem 0 0 0",
              padding: "0.625rem",
              background: "#f1f5f9",
              borderRadius: "0.375rem",
              fontSize: "0.8125rem",
              color: "#334155",
              overflowX: "auto",
            }}
          >
            {finding.evidence}
          </pre>
        </div>
      )}

      {finding.recommendation && (
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#166534", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Suggested Remediation
          </span>
          <pre
            style={{
              margin: "0.25rem 0 0 0",
              padding: "0.625rem",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "0.375rem",
              fontSize: "0.8125rem",
              color: "#14532d",
              overflowX: "auto",
            }}
          >
            {finding.recommendation}
          </pre>
        </div>
      )}

      <div style={{ marginTop: "0.5rem", paddingTop: "0.75rem", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "flex-end" }}>
        <FeedbackButton findingId={findingId} onFeedbackChange={onFeedbackChange} />
      </div>
    </div>
  );
}
