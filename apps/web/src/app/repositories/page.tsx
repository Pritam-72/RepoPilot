import React from "react";
import { RepoCard } from "../../components/repo-card.js";

export const sampleRepositories = [
  {
    id: "repo-1",
    name: "RepoPilot",
    owner: "Pritam-72",
    defaultBranch: "main",
    reviewCount: 42,
    lastReviewStatus: "completed" as const,
    lastReviewAt: "10 minutes ago",
  },
  {
    id: "repo-2",
    name: "ecommerce-api",
    owner: "acme-corp",
    defaultBranch: "master",
    reviewCount: 128,
    lastReviewStatus: "completed" as const,
    lastReviewAt: "1 hour ago",
  },
  {
    id: "repo-3",
    name: "auth-service",
    owner: "infra-team",
    defaultBranch: "main",
    reviewCount: 65,
    lastReviewStatus: "analyzing" as const,
    lastReviewAt: "In progress",
  },
  {
    id: "repo-4",
    name: "data-pipeline",
    owner: "analytics",
    defaultBranch: "main",
    reviewCount: 19,
    lastReviewStatus: "completed" as const,
    lastReviewAt: "Yesterday",
  },
];

export default function RepositoriesPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, margin: 0, color: "#111827" }}>
            Tracked Repositories
          </h1>
          <p style={{ margin: "0.5rem 0 0 0", color: "#6b7280", fontSize: "1rem" }}>
            Active GitHub repositories with RepoPilot webhook installations
          </p>
        </div>
        <button
          type="button"
          style={{
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          + Connect Repository
        </button>
      </div>

      <div
        data-testid="repositories-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {sampleRepositories.map((repo) => (
          <RepoCard key={repo.id} {...repo} />
        ))}
      </div>
    </div>
  );
}

