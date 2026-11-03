import React from "react";

export interface RepoCardProps {
  id: string;
  name: string;
  owner: string;
  defaultBranch?: string;
  reviewCount: number;
  lastReviewStatus?: "completed" | "analyzing" | "failed";
  lastReviewAt?: string;
}

export function RepoCard({
  id,
  name,
  owner,
  defaultBranch = "main",
  reviewCount,
  lastReviewStatus = "completed",
  lastReviewAt = "Just now",
}: RepoCardProps) {
  const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
    completed: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
    analyzing: { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
    failed: { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
  };

  const statusStyle = statusStyles[lastReviewStatus] ?? statusStyles.completed;

  return (
    <div
      data-testid={`repo-card-${id}`}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        background: "#ffffff",
        padding: "1.25rem",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {owner}
          </span>
          <h3 style={{ margin: "0.125rem 0 0 0", fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}>
            {name}
          </h3>
        </div>
        <span
          style={{
            fontSize: "0.75rem",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.25rem",
            fontWeight: 500,
            textTransform: "capitalize",
            background: statusStyle?.bg,
            color: statusStyle?.text,
            border: `1px solid ${statusStyle?.border}`,
          }}
        >
          {lastReviewStatus}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.875rem", color: "#4b5563" }}>
        <span>Branch: <strong style={{ color: "#111827" }}>{defaultBranch}</strong></span>
        <span>•</span>
        <span>Reviews: <strong style={{ color: "#111827" }}>{reviewCount}</strong></span>
      </div>

      <div style={{ marginTop: "0.5rem", paddingTop: "0.75rem", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Last review: {lastReviewAt}</span>
        <a
          href={`/repositories/${owner}/${name}`}
          style={{
            fontSize: "0.875rem",
            color: "#2563eb",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          View Reviews →
        </a>
      </div>
    </div>
  );
}
