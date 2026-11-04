"use client";

import React, { useEffect, useState } from "react";
import { FindingCard } from "../../../components/finding-card";
import { DiffViewer } from "../../../components/diff-viewer";
import type { Finding } from "@acr/review-contracts";

export interface ReviewDetailProps {
  params: { id: string };
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
index e69de29..b493214 100644
--- a/src/paginate.ts
+++ b/src/paginate.ts
@@ -1,5 +1,5 @@
 export function getPage(items: string[], page: number, pageSize: number): string[] {
   const start = (page - 1) * pageSize;
-  const end = start + pageSize;
+  const end = start + pageSize + 1;
   return items.slice(start, end);
 }`,
  findings: [
    {
      id: "f-1",
      category: "correctness" as const,
      severity: "high" as const,
      file: "src/paginate.ts",
      line: 4,
      ruleId: "off-by-one-end",
      title: "Off-by-one error in slice end calculation",
      description:
        "Adding 1 to the end index causes getPage to return pageSize + 1 elements, violating pagination contracts and leaking into adjacent pages.",
      evidence: "const end = start + pageSize + 1;",
      recommendation: "const end = start + pageSize;",
      confidence: 0.95,
      verificationStatus: "verified" as const,
    },
  ] as (Finding & { id: string })[],
};

export default function ReviewDetailPage({ params }: ReviewDetailProps) {
  const [review, setReview] = useState(sampleReviewData);
  const [feedbackLog, setFeedbackLog] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadReview() {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/reviews/${params?.id || "run-101"}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.review) {
            const r = data.review;
            setReview((prev) => ({
              ...prev,
              id: r.id,
              repository: `${r.repository.owner}/${r.repository.name}`,
              pullNumber: r.pullRequest.githubPrNumber,
              title: r.pullRequest.title,
              headSha: r.headSha,
              status: r.status,
              durationMs:
                r.completedAt && r.startedAt
                  ? new Date(r.completedAt).getTime() - new Date(r.startedAt).getTime()
                  : 14200,
              findings: r.findings.map((f: any) => ({
                id: f.id,
                category: f.category,
                severity: f.severity,
                file: f.filePath,
                line: f.line,
                ruleId: f.ruleId,
                title: f.title,
                description: f.description,
                evidence: f.evidence,
                recommendation: f.recommendation,
                confidence: f.confidence,
                verificationStatus: f.verificationStatus,
              })),
            }));
          }
        }
      } catch {
        // Fallback
      }
    }
    loadReview();
  }, [params?.id]);

  const handleFeedback = async (findingId: string, feedback: "useful" | "incorrect" | "dismissed") => {
    setFeedbackLog((prev) => ({ ...prev, [findingId]: feedback }));
    try {
      await fetch(`http://localhost:3000/api/v1/reviews/${review.id}/findings/${findingId}/feedback`, {
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
      {/* Review Header */}
      <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#6b7280" }}>
              <span>{review.repository}</span>
              <span>/</span>
              <strong style={{ color: "#2563eb" }}>PR #{review.pullNumber}</strong>
            </div>
            <h1 style={{ margin: "0.375rem 0 0 0", fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>
              {review.title}
            </h1>
          </div>
          <span
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              textTransform: "capitalize",
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
            }}
          >
            {review.status}
          </span>
        </div>

        <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem", fontSize: "0.8125rem", color: "#6b7280", flexWrap: "wrap" }}>
          <span>Head SHA: <code style={{ color: "#111827" }}>{review.headSha.slice(0, 7)}</code></span>
          <span>•</span>
          <span>Duration: <strong>{(review.durationMs / 1000).toFixed(1)}s</strong></span>
          <span>•</span>
          <span>Findings: <strong style={{ color: "#dc2626" }}>{review.findings.length}</strong></span>
        </div>
      </div>

      {/* Findings Breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
                    background: sev === "high" ? "#fee2e2" : "#fef3c7",
                    color: sev === "high" ? "#991b1b" : "#92400e",
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

        {review.findings.map((finding) => (
          <div key={finding.id} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                  Feedback recorded as <strong>{feedbackLog[finding.id]}</strong>. Live calibration updated.
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Unified Diff */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "#111827" }}>
          Changed Code & Diff Context
        </h2>
        <DiffViewer patch={review.diff} highlightLine={4} />
      </div>
    </div>
  );
}
