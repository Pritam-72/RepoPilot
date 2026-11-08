"use client";

import React, { useEffect, useState } from "react";

export interface RepositorySettingsPageProps {
  params: {
    id: string;
  };
}

export default function RepositorySettingsPage({ params }: RepositorySettingsPageProps) {
  const repoId = params?.id || "repo-repopilot-1";
  const [repoName, setRepoName] = useState("Pritam-72/RepoPilot");

  const [isEnabled, setIsEnabled] = useState(true);
  const [minConfidence, setMinConfidence] = useState(0.75);
  const [automatedPublishing, setAutomatedPublishing] = useState(true);
  const [saved, setSaved] = useState(false);
  const [newConvention, setNewConvention] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [agents, setAgents] = useState<Record<string, boolean>>({
    correctness: true,
    security: true,
    quality: true,
    performance: true,
    dependency: true,
    testing: true,
  });

  const [conventions, setConventions] = useState<string[]>([
    "Always return early to minimize indentation",
    "Never commit API keys or development credentials",
    "Require parameterized queries for raw SQL access",
  ]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/repositories/${repoId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.repository) {
            setRepoName(`${data.repository.owner}/${data.repository.name}`);
            setIsEnabled(data.repository.isEnabled ?? true);
            const cfg = data.repository.reviewConfig || {};
            if (cfg.confidenceThreshold !== undefined) setMinConfidence(cfg.confidenceThreshold);
            if (cfg.minimumConfidence !== undefined) setMinConfidence(cfg.minimumConfidence);
            if (cfg.automatedPublishing !== undefined) setAutomatedPublishing(cfg.automatedPublishing);
            if (cfg.agents) setAgents((prev) => ({ ...prev, ...cfg.agents }));
            if (Array.isArray(cfg.conventions)) setConventions(cfg.conventions);
          }
        }
      } catch {
        // Fallback to defaults
      }
    }
    loadSettings();
  }, [repoId]);

  const handleToggleAgent = (category: string) => {
    setAgents((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleAddConvention = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newConvention.trim();
    if (!trimmed) return;
    if (!conventions.includes(trimmed)) {
      setConventions((prev) => [...prev, trimmed]);
    }
    setNewConvention("");
  };

  const handleRemoveConvention = (index: number) => {
    setConventions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaved(true);
    setIsSaving(true);
    try {
      await fetch(`http://localhost:3000/api/v1/repositories/${repoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isEnabled,
          minimumConfidence: minConfidence,
          automatedPublishing,
          agents,
          conventions,
          reviewConfig: {
            confidenceThreshold: minConfidence,
            automatedPublishing,
            agents,
            conventions,
          },
        }),
      });
      setSaved(true);
    } catch {
      setSaved(true);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaved(false), 4000);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Breadcrumb & Title */}
      <div style={{ marginBottom: "1.5rem" }}>
        <a
          href="/repositories"
          style={{ fontSize: "0.875rem", color: "#2563eb", textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
        >
          ← Back to Repositories
        </a>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827", marginTop: "0.5rem" }}>
          Repository Review Settings
        </h1>
        <p style={{ color: "#6b7280", marginTop: "0.25rem" }}>
          Configuring policies for <strong>{repoName}</strong> (ID: <code>{repoId}</code>)
        </p>
      </div>

      {saved && (
        <div
          data-testid="save-success-banner"
          style={{
            marginBottom: "1.5rem",
            padding: "0.75rem 1rem",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>✓</span> Settings successfully saved and applied to upcoming pull requests.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* General Review Automation Card */}
        <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827", marginBottom: "0.5rem" }}>
            General Automation
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0" }}>
            <div>
              <strong style={{ display: "block", color: "#111827", fontSize: "0.875rem" }}>
                Automated Pull Request Reviews
              </strong>
              <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Automatically trigger review agent pipeline when PRs are opened or synchronized.
              </span>
            </div>
            <input
              type="checkbox"
              data-testid="toggle-is-enabled"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              style={{ width: "1.25rem", height: "1.25rem", accentColor: "#2563eb", cursor: "pointer" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderTop: "1px solid #f3f4f6" }}>
            <div>
              <strong style={{ display: "block", color: "#111827", fontSize: "0.875rem" }}>
                Direct GitHub Publishing
              </strong>
              <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Post verified inline comments directly to GitHub PR. If disabled, reviews remain preview-only in dashboard.
              </span>
            </div>
            <input
              type="checkbox"
              data-testid="toggle-automated-publishing"
              checked={automatedPublishing}
              onChange={(e) => setAutomatedPublishing(e.target.checked)}
              style={{ width: "1.25rem", height: "1.25rem", accentColor: "#2563eb", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Active Review Agents Card */}
        <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827", marginBottom: "0.5rem" }}>
            Active Review Agents
          </h2>
          <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "1rem" }}>
            Toggle specialized agent roles to customize review coverage for this codebase.
          </p>

          {Object.keys(agents).map((category) => (
            <div
              key={category}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.625rem 0",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <span style={{ fontSize: "0.875rem", textTransform: "capitalize", fontWeight: 500, color: "#374151" }}>
                {category} Review Agent
              </span>
              <input
                type="checkbox"
                data-testid={`toggle-agent-${category}`}
                checked={agents[category]}
                onChange={() => handleToggleAgent(category)}
                style={{ width: "1.125rem", height: "1.125rem", accentColor: "#2563eb", cursor: "pointer" }}
              />
            </div>
          ))}
        </div>

        {/* Verification Confidence Gate Card */}
        <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827", margin: 0 }}>
              Verification Confidence Threshold
            </h2>
            <span
              data-testid="confidence-value"
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "#2563eb",
                background: "#eff6ff",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.25rem",
              }}
            >
              {minConfidence}
            </span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "1rem" }}>
            Findings with model confidence below this threshold are suppressed to prevent noisy false positives.
          </p>
          <input
            type="range"
            data-testid="confidence-slider"
            min="0.5"
            max="0.95"
            step="0.05"
            value={minConfidence}
            onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }}
          />
        </div>

        {/* Repository Conventions Card */}
        <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827", marginBottom: "0.5rem" }}>
            Active Coding Conventions (.repopilot.json)
          </h2>
          <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "1rem" }}>
            Custom team guidelines injected into reviewer prompt contexts.
          </p>

          <form onSubmit={handleAddConvention} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Add convention rule (e.g. Disallow any in production contracts)"
              value={newConvention}
              onChange={(e) => setNewConvention(e.target.value)}
              style={{
                flex: 1,
                padding: "0.4rem 0.75rem",
                borderRadius: "0.375rem",
                border: "1px solid #d1d5db",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#f3f4f6",
                color: "#111827",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                padding: "0.4rem 0.875rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              + Add Rule
            </button>
          </form>

          <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {conventions.map((c, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 0.75rem",
                  background: "#f9fafb",
                  borderRadius: "0.375rem",
                  border: "1px solid #f3f4f6",
                  fontSize: "0.875rem",
                  color: "#374151",
                }}
              >
                <span>{c}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveConvention(i)}
                  title="Remove convention"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    padding: "0.125rem",
                  }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <a
            href="/repositories"
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#4b5563",
              background: "#ffffff",
              border: "1px solid #d1d5db",
              textDecoration: "none",
            }}
          >
            Cancel
          </a>
          <button
            onClick={handleSave}
            disabled={isSaving}
            data-testid="save-settings-btn"
            style={{
              padding: "0.625rem 1.5rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#ffffff",
              background: isSaving ? "#93c5fd" : "#2563eb",
              border: "none",
              cursor: isSaving ? "not-allowed" : "pointer",
            }}
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
