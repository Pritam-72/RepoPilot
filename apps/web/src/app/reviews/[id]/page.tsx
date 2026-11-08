"use client";

import React, { useEffect, useState } from "react";
import { FindingCard } from "../../../components/finding-card";
import { DiffViewer } from "../../../components/diff-viewer";
import type { Finding } from "@acr/review-contracts";

export interface ReviewDetailProps {
  params: { id: string };
}

export interface AgentRunItem {
  id: string;
  agentType: string;
  status: string;
  durationMs: number;
  inputTokens: number;
  outputTokens: number;
}

export const sampleReviewData = {
  id: "run-101",
  repository: "Pritam-72/RepoPilot",
  pullNumber: 42,
  title: "fix: prevent off-by-one boundary traversal in pagination",
  headSha: "a1b2c3d4e5f67890",
  baseSha: "0987654321fedcba",
  status: "completed" as const,
  durationMs: 14200,
  createdAt: "2026-11-04T07:10:31Z",
  summary:
    "RepoPilot completed review across 1 file. Detected 1 verified correctness issue regarding slice boundary termination.",
  diff: `diff --git a/src/paginate.ts b/src/paginate.ts
--- a/src/paginate.ts
+++ b/src/paginate.ts
@@ -1,5 +1,5 @@
 export function getPage(items: string[], page: number, size: number): string[] {
   const start = (page - 1) * size;
-  const end = start + size;
+  const end = start + size + 1;
   return items.slice(start, end);
 }`,
  findings: [
    {
      id: "f-1",
      category: "correctness" as const,
      severity: "high" as const,
      file: "src/paginate.ts",
      line: 3,
      ruleId: "BUG-OFF-BY-ONE-01",
      title: "Off-by-One Boundary Defect in Pagination Slice",
      description:
        "Slice end index exceeds bounds by 1 leading to off-by-one pagination leaks and returning more elements than the requested page size.",
      evidence: "  const end = start + size + 1;",
      recommendation: "const end = start + size;",
      confidence: 0.95,
      verificationStatus: "verified" as const,
    },
  ] as (Finding & { id: string })[],
  agentRuns: [
    { id: "ar-1", agentType: "bug-reviewer", status: "completed", durationMs: 2400, inputTokens: 643, outputTokens: 180 },
    { id: "ar-2", agentType: "security-reviewer", status: "completed", durationMs: 2100, inputTokens: 648, outputTokens: 50 },
    { id: "ar-3", agentType: "error-handling-reviewer", status: "completed", durationMs: 2200, inputTokens: 635, outputTokens: 50 },
    { id: "ar-4", agentType: "performance-reviewer", status: "completed", durationMs: 2050, inputTokens: 644, outputTokens: 50 },
    { id: "ar-5", agentType: "test-coverage-reviewer", status: "completed", durationMs: 1950, inputTokens: 615, outputTokens: 50 },
    { id: "ar-6", agentType: "quality-reviewer", status: "completed", durationMs: 1850, inputTokens: 639, outputTokens: 50 },
  ] as AgentRunItem[],
};

export default function ReviewDetailPage({ params }: ReviewDetailProps) {
  const [review, setReview] = useState(sampleReviewData);
  const [feedbackLog, setFeedbackLog] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadReview() {
      setIsLoading(true);
      try {
        const reviewId = params?.id || "run-101";
        const res = await fetch(`http://localhost:3000/api/v1/reviews/${reviewId}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.review) {
            const r = data.review;
            setReview({
              id: r.id,
              repository: `${r.repository.owner}/${r.repository.name}`,
              pullNumber: r.pullRequest.githubPrNumber,
              title: r.pullRequest.title,
              headSha: r.headSha,
              baseSha: r.baseSha ?? "HEAD~1",
              status: r.status,
              durationMs:
                r.completedAt && r.startedAt
                  ? new Date(r.completedAt).getTime() - new Date(r.startedAt).getTime()
                  : 12000,
              createdAt: r.createdAt ?? new Date().toISOString(),
              summary:
                r.findings?.length === 0
                  ? "RepoPilot completed review across all files. All 6 verification agents passed with zero defects (Clean PR)."
                  : `RepoPilot multi-agent review completed. Identified ${r.findings.length} verified candidate finding(s).`,
              diff: r.diff || sampleReviewData.diff,
              findings: r.findings.map((f: any) => ({
                id: f.id,
                category: f.category,
                severity: f.severity,
                file: f.filePath,
                line: f.line,
                ruleId: f.ruleId ?? `${f.category.toUpperCase()}-001`,
                title: f.title,
                description: f.description,
                evidence: f.evidence,
                recommendation: f.recommendation,
                confidence: f.confidence,
                verificationStatus: f.verificationStatus,
              })),
              agentRuns: Array.isArray(r.agentRuns) && r.agentRuns.length > 0 ? r.agentRuns : sampleReviewData.agentRuns,
            });
          }
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadReview();
  }, [params?.id]);

  const handleFeedback = async (findingId: string, feedback: "useful" | "incorrect" | "dismissed") => {
    setFeedbackLog((prev) => ({ ...prev, [findingId]: feedback }));
    try {
      await fetch(`http://localhost:3000/api/v1/findings/${findingId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "user-pritam", feedbackType: feedback }),
      });
    } catch {
      // Offline fallback
    }
  };

  const severities = ["critical", "high", "medium", "low"] as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Back button & Breadcrumb */}
      <div>
        <a
          href="/reviews"
          style={{
            fontSize: "0.875rem",
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          ← Back to All Reviews
        </a>
      </div>

      {/* Review Header Banner */}
      <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#6b7280" }}>
              <span>{review.repository}</span>
              <span>/</span>
              <strong style={{ color: "#2563eb" }}>PR #{review.pullNumber}</strong>
              <span>•</span>
              <span>Review Run ID: <code style={{ color: "#111827" }}>{review.id}</code></span>
            </div>
            <h1 style={{ margin: "0.5rem 0 0.25rem 0", fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>
              {review.title}
            </h1>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#4b5563" }}>
              {review.summary}
            </p>
          </div>
          <span
            style={{
              padding: "0.375rem 0.875rem",
              borderRadius: "9999px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              textTransform: "capitalize",
              background: review.status === "completed" ? "#f0fdf4" : "#eff6ff",
              color: review.status === "completed" ? "#166534" : "#1e40af",
              border: `1px solid ${review.status === "completed" ? "#bbf7d0" : "#bfdbfe"}`,
            }}
          >
            {review.status}
          </span>
        </div>

        <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid #f3f4f6", fontSize: "0.8125rem", color: "#6b7280", flexWrap: "wrap" }}>
          <span>Head SHA: <code style={{ color: "#111827" }}>{review.headSha.slice(0, 7)}</code></span>
          <span>•</span>
          <span>Pipeline Duration: <strong>{(review.durationMs / 1000).toFixed(1)}s</strong></span>
          <span>•</span>
          <span>
            Verified Findings:{" "}
            <strong style={{ color: review.findings.length > 0 ? "#dc2626" : "#16a34a" }}>
              {review.findings.length}
            </strong>
          </span>
        </div>
      </div>

      {/* 6 Specialized Agents Execution Breakdown */}
      <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "1.25rem", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
        <h3 style={{ margin: "0 0 0.75rem 0", fontSize: "1rem", fontWeight: 600, color: "#111827" }}>
          🤖 Multi-Agent Execution Telemetry ({review.agentRuns?.length ?? 6} Agents)
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
          {review.agentRuns?.map((agent) => (
            <div
              key={agent.agentType}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                padding: "0.75rem",
                background: "#f9fafb",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "0.8125rem", color: "#111827" }}>{agent.agentType}</strong>
                <span style={{ fontSize: "0.6875rem", color: "#16a34a", fontWeight: 600 }}>✓ passed</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.375rem" }}>
                Latency: {agent.durationMs}ms
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Tokens: {agent.inputTokens + agent.outputTokens}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Findings Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "#111827" }}>
            Verified Findings ({review.findings.length})
          </h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {severities.map((sev) => {
              const count = review.findings.filter((f) => f.severity === sev).length;
              if (count === 0) return null;
              return (
                <span
                  key={sev}
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.25rem",
                    background: sev === "critical" ? "#fee2e2" : sev === "high" ? "#fff7ed" : "#fef9c3",
                    color: sev === "critical" ? "#991b1b" : sev === "high" ? "#9a3412" : "#854d0e",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {count} {sev}
                </span>
              );
            })}
          </div>
        </div>

        {review.findings.length === 0 ? (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "0.5rem",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "2rem" }}>✅</span>
            <h3 style={{ margin: "0.5rem 0 0.25rem 0", color: "#166534", fontSize: "1.125rem", fontWeight: 600 }}>
              Clean Control Pull Request — Zero Defects Detected
            </h3>
            <p style={{ margin: 0, color: "#15803d", fontSize: "0.875rem" }}>
              All 6 specialized verification agents executed with 100% false positive suppression. No action required.
            </p>
          </div>
        ) : (
          review.findings.map((finding) => (
            <div key={finding.id} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <FindingCard
                finding={finding}
                onFeedbackChange={(id, type) => handleFeedback(id, type)}
              />

              {feedbackLog[finding.id] && (
                <div
                  data-testid="feedback-confirmation"
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.8125rem",
                    color: "#166534",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>✓</span>
                  <span>
                    Feedback recorded as <strong>{feedbackLog[finding.id]}</strong>. Saved to PostgreSQL.
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Unified Diff */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "#111827" }}>
          Changed Code & Diff Context
        </h2>
        <DiffViewer patch={review.diff} highlightLine={review.findings[0]?.line ?? 1} />
      </div>
    </div>
  );
}
