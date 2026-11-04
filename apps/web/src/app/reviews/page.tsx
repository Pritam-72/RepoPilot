"use client";

import React, { useEffect, useState } from "react";

export interface ReviewItem {
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

const initialReviews: ReviewItem[] = [
  {
    id: "run-101",
    repository: "Pritam-72/RepoPilot",
    pullNumber: 42,
    title: "fix: prevent off-by-one boundary traversal in pagination",
    status: "completed",
    findingsCount: 1,
    criticalCount: 0,
    createdAt: "1 hour ago",
    durationMs: 14200,
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [filter, setFilter] = useState<"all" | "completed" | "failed">("all");

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("http://localhost:3000/api/v1/reviews");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.reviews) && data.reviews.length > 0) {
            setReviews(data.reviews);
          }
        }
      } catch {
        // Fallback to initial reviews
      }
    }
    loadReviews();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, margin: 0, color: "#111827" }}>
            Code Review Runs
          </h1>
          <p style={{ margin: "0.5rem 0 0 0", color: "#6b7280", fontSize: "1rem" }}>
            All historical and active pull request review jobs analyzed by RepoPilot
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["all", "completed", "failed"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              style={{
                padding: "0.375rem 0.75rem",
                borderRadius: "0.375rem",
                fontSize: "0.8125rem",
                fontWeight: 500,
                border: filter === tab ? "1px solid #2563eb" : "1px solid #e5e7eb",
                background: filter === tab ? "#eff6ff" : "#ffffff",
                color: filter === tab ? "#2563eb" : "#4b5563",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          overflow: "hidden",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", color: "#6b7280", fontSize: "0.75rem", textTransform: "uppercase" }}>
                <th style={{ padding: "0.75rem 1.25rem" }}>Review ID</th>
                <th style={{ padding: "0.75rem 1.25rem" }}>Repository & Pull Request</th>
                <th style={{ padding: "0.75rem 1.25rem" }}>Status</th>
                <th style={{ padding: "0.75rem 1.25rem" }}>Verified Findings</th>
                <th style={{ padding: "0.75rem 1.25rem" }}>Latency</th>
                <th style={{ padding: "0.75rem 1.25rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
                    No reviews matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "1rem 1.25rem", fontFamily: "monospace", color: "#4b5563", fontSize: "0.8125rem" }}>
                      {rev.id}
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ fontWeight: 600, color: "#111827" }}>
                        {rev.repository} <span style={{ color: "#2563eb" }}>#{rev.pullNumber}</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.125rem" }}>
                        {rev.title}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          background: rev.status === "completed" ? "#f0fdf4" : "#eff6ff",
                          color: rev.status === "completed" ? "#166534" : "#1e40af",
                          border: `1px solid ${rev.status === "completed" ? "#bbf7d0" : "#bfdbfe"}`,
                        }}
                      >
                        {rev.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      {rev.findingsCount === 0 ? (
                        <span style={{ color: "#16a34a", fontWeight: 500 }}>Clean (0)</span>
                      ) : (
                        <span style={{ fontWeight: 600, color: rev.criticalCount > 0 ? "#dc2626" : "#d97706" }}>
                          {rev.findingsCount} finding{rev.findingsCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#4b5563" }}>
                      {(rev.durationMs / 1000).toFixed(1)}s
                    </td>
                    <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                      <a
                        href={`/reviews/${rev.id}`}
                        style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}
                      >
                        Inspect Review →
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

