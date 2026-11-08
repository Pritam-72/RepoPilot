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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [owner, setOwner] = useState("Pritam-72");
  const [name, setName] = useState("");
  const [defaultBranch, setDefaultBranch] = useState("main");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
            lastReviewAt: new Date(r.updatedAt ?? Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
          setRepos(live);
        }
      }
    } catch {
      // Fallback to sample repositories
    }
  }

  useEffect(() => {
    loadRepos();
  }, []);

  async function handleAddRepository(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedOwner = owner.trim();
    const trimmedName = name.trim();
    const trimmedBranch = defaultBranch.trim() || "main";

    if (!trimmedOwner || !trimmedName) {
      setErrorMessage("Both Repository Owner and Repository Name are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:3000/api/v1/repositories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: trimmedOwner,
          name: trimmedName,
          defaultBranch: trimmedBranch,
        }),
      });

      if (res.status === 201 || res.status === 200) {
        const data = await res.json();
        const created = data.repository;
        const newRepoItem: RepoItem = {
          id: created.id,
          name: created.name,
          owner: created.owner,
          defaultBranch: created.defaultBranch ?? trimmedBranch,
          reviewCount: 0,
          lastReviewStatus: "completed",
          lastReviewAt: "Just now",
        };

        setRepos((prev) => [newRepoItem, ...prev]);
        setIsModalOpen(false);
        setName("");
        setToastMessage(`Repository ${trimmedOwner}/${trimmedName} successfully connected!`);
        setTimeout(() => setToastMessage(null), 4000);
      } else if (res.status === 409) {
        setErrorMessage(`Repository "${trimmedOwner}/${trimmedName}" is already registered.`);
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMessage(errData.error || `Failed to add repository (HTTP ${res.status})`);
      }
    } catch {
      // Optimistic local add if offline or API unreachable
      const optimisticRepo: RepoItem = {
        id: `repo-local-${Date.now()}`,
        name: trimmedName,
        owner: trimmedOwner,
        defaultBranch: trimmedBranch,
        reviewCount: 0,
        lastReviewStatus: "completed",
        lastReviewAt: "Just now",
      };
      setRepos((prev) => [optimisticRepo, ...prev]);
      setIsModalOpen(false);
      setName("");
      setToastMessage(`Repository ${trimmedOwner}/${trimmedName} connected locally!`);
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteRepository(id: string) {
    if (!confirm("Are you sure you want to remove this repository from RepoPilot?")) return;
    try {
      await fetch(`http://localhost:3000/api/v1/repositories/${id}`, {
        method: "DELETE",
      });
      setRepos((prev) => prev.filter((r) => r.id !== id));
      setToastMessage("Repository successfully removed.");
      setTimeout(() => setToastMessage(null), 4000);
    } catch {
      setRepos((prev) => prev.filter((r) => r.id !== id));
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", position: "relative" }}>
      {toastMessage && (
        <div
          role="alert"
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            background: "#10b981",
            color: "#ffffff",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.5rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 500,
            fontSize: "0.875rem",
          }}
        >
          <span>✓</span> {toastMessage}
        </div>
      )}

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
          onClick={() => {
            setErrorMessage(null);
            setIsModalOpen(true);
          }}
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
            transition: "background 0.15s ease",
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
            onDelete={handleDeleteRepository}
          />
        ))}
      </div>

      {/* Add Repository Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "0.75rem",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #f3f4f6",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}>
                  Connect GitHub Repository
                </h3>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "#6b7280" }}>
                  Enable RepoPilot multi-agent automated reviews for pull requests.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  color: "#9ca3af",
                  padding: "0.25rem",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRepository} style={{ padding: "1.5rem" }}>
              {errorMessage && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#991b1b",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.8125rem",
                    marginBottom: "1rem",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label
                    htmlFor="repo-owner"
                    style={{
                      display: "block",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: "#374151",
                      marginBottom: "0.375rem",
                    }}
                  >
                    Owner / Organization <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    id="repo-owner"
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="e.g. Pritam-72 or acme-corp"
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #d1d5db",
                      fontSize: "0.875rem",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="repo-name"
                    style={{
                      display: "block",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: "#374151",
                      marginBottom: "0.375rem",
                    }}
                  >
                    Repository Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    id="repo-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. payment-service"
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #d1d5db",
                      fontSize: "0.875rem",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="repo-branch"
                    style={{
                      display: "block",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: "#374151",
                      marginBottom: "0.375rem",
                    }}
                  >
                    Default Branch
                  </label>
                  <input
                    id="repo-branch"
                    type="text"
                    value={defaultBranch}
                    onChange={(e) => setDefaultBranch(e.target.value)}
                    placeholder="main"
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #d1d5db",
                      fontSize: "0.875rem",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #f3f4f6",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: "#f3f4f6",
                    color: "#4b5563",
                    border: "none",
                    borderRadius: "0.375rem",
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: isSubmitting ? "#93c5fd" : "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "0.375rem",
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {isSubmitting ? "Connecting..." : "Add Repository"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
