"use client";

import React, { useState } from "react";
import { FindingCard } from "../../../components/finding-card.js";
import { DiffViewer } from "../../../components/diff-viewer.js";
import type { Finding } from "@acr/review-contracts";

export interface ReviewDetailProps {
  params: { id: string };
}

const sampleReviewData = {
  id: "run-101",
  repository: "Pritam-72/RepoPilot",
  pullNumber: 42,
  title: "fix: prevent off-by-one boundary traversal in pagination",
  headSha: "a1b2c3d4e5f67890",
  baseSha: "0987654321fedcba",
  status: "completed" as const,
  durationMs: 14200,
  createdAt: "2026-11-03T10:30:00Z",
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

  const handleFeedback = (findingId: string, feedback: "useful" | "incorrect" | "dismissed") => {
    setFeedbackLog((prev) => ({ ...prev, [findingId]: feedback }));
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

        <p style={{ margin: "1rem 0 0 0", padding: "0.75rem", background: "#f8fafc", borderRadius: "0.375rem", fontSize: "0.875rem", color: "#334155", border: "1px solid #e2e8f0" }}>
          {review.summary}
        </p>
      </div>

      {/* Main Content: Diff & Findings */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.75rem" }}>
        {/* Diff Section */}
        <div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "0 0 0.75rem 0", color: "#111827" }}>
            Reviewed PR Diff
          </h2>
          <DiffViewer patch={review.diff} highlightLine={4} />
        </div>

        {/* Findings by Severity */}
        <div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "0 0 0.75rem 0", color: "#111827" }}>
            Verified Findings ({review.findings.length})
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }} data-testid="findings-list">
            {review.findings.map((finding) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                onFeedbackChange={handleFeedback}
              />
            ))}
          </div>

          {Object.keys(feedbackLog).length > 0 && (
            <div
              data-testid="feedback-confirmation"
              style={{
                marginTop: "1rem",
                padding: "0.75rem",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "0.375rem",
                fontSize: "0.8125rem",
                color: "#166534",
              }}
            >
              Feedback submitted successfully for finding! Thank you for tuning the review models.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
