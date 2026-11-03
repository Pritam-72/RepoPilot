"use client";

import React, { useState } from "react";
import { Nav } from "../../../../components/nav";

export interface RepositorySettingsPageProps {
  params: {
    id: string;
  };
}

export default function RepositorySettingsPage({ params }: RepositorySettingsPageProps) {
  const repoId = params?.id || "repo-1";

  const [isEnabled, setIsEnabled] = useState(true);
  const [minConfidence, setMinConfidence] = useState(0.75);
  const [automatedPublishing, setAutomatedPublishing] = useState(true);
  const [saved, setSaved] = useState(false);

  const [agents, setAgents] = useState({
    correctness: true,
    security: true,
    quality: true,
    performance: true,
    dependency: true,
  });

  const [conventions] = useState<string[]>([
    "Always return early to minimize indentation",
    "Never commit API keys or development credentials",
    "Require parameterized queries for raw SQL access",
  ]);

  const handleToggleAgent = (category: keyof typeof agents) => {
    setAgents((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <Nav activePath="/repositories" />

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Breadcrumb & Title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <a
            href="/repositories"
            style={{ fontSize: "0.875rem", color: "#2563eb", textDecoration: "none", fontWeight: 500 }}
          >
            ← Back to Repositories
          </a>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827", marginTop: "0.5rem" }}>
            Repository Review Settings
          </h1>
          <p style={{ color: "#6b7280", marginTop: "0.25rem" }}>
            Configuring policies for repository ID: <code>{repoId}</code>
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
            }}
          >
            ✅ Settings successfully saved and applied to upcoming pull requests.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* General Review Automation Card */}
          <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
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
          <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827", marginBottom: "0.5rem" }}>
              Active Review Agents
            </h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "1rem" }}>
              Toggle specialized agent roles to customize review coverage for this codebase.
            </p>

            {(Object.keys(agents) as Array<keyof typeof agents>).map((category) => (
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
          <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
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
          <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827", marginBottom: "0.5rem" }}>
              Active Coding Conventions (.repopilot.json)
            </h2>
            <ul style={{ paddingLeft: "1.25rem", margin: "0.5rem 0", color: "#4b5563", fontSize: "0.875rem" }}>
              {conventions.map((c, i) => (
                <li key={i} style={{ marginBottom: "0.375rem" }}>
                  {c}
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
              data-testid="save-settings-btn"
              style={{
                padding: "0.625rem 1.5rem",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#ffffff",
                background: "#2563eb",
                border: "none",
                cursor: "pointer",
              }}
            >
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

