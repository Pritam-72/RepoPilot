"use client";

import React, { useEffect, useState } from "react";
import { RepoCard } from "../../components/repo-card";

export interface RepoItem {
  id: string;
  name: string;
  owner: string;
  defaultBranch?: string;
  reviewCount: number;
  lastReviewStatus?: "completed" | "analyzing" | "failed";
  lastReviewAt?: string;
}

export const sampleRepositories: RepoItem[] = [
  {
    id: "repo-1",
    name: "RepoPilot",
    owner: "Pritam-72",
    defaultBranch: "main",
    reviewCount: 1,
    lastReviewStatus: "completed" as const,
    lastReviewAt: "1 hour ago",
  },
  {
    id: "repo-2",
    name: "ecommerce-api",
    owner: "acme-corp",
    defaultBranch: "master",
    reviewCount: 0,
    lastReviewStatus: "completed" as const,
    lastReviewAt: "Yesterday",
  },
];

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<RepoItem[]>(sampleRepositories);

  useEffect(() => {
    async function loadRepos() {
      try {
        const res = await fetch("http://localhost:3000/api/v1/repositories");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.repositories) && data.repositories.length > 0) {
            const live = data.repositories.map((r: any) => ({
              id: r.id,
              name: r.name,
              owner: r.owner,
              defaultBranch: r.defaultBranch ?? "main",
              reviewCount: 1,
              lastReviewStatus: "completed" as const,
              lastReviewAt: new Date(r.updatedAt ?? Date.now()).toLocaleTimeString(),
            }));
            setRepos(live);
          }
        }
      } catch {
        // Fallback to sample repositories
      }
    }

    loadRepos();
  }, []);

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
            borderRadius: "0.375rem",
            padding: "0.625rem 1rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>+</span> Add Repository
        </button>
      </div>

      <div
        data-testid="repo-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {repos.map((repo) => (
          <RepoCard
            key={repo.id}
            id={repo.id}
            name={repo.name}
            owner={repo.owner}
            defaultBranch={repo.defaultBranch}
            reviewCount={repo.reviewCount}
            lastReviewStatus={repo.lastReviewStatus}
            lastReviewAt={repo.lastReviewAt}
          />
        ))}
      </div>
    </div>
  );
}
