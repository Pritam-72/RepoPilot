"use client";

import React, { useState } from "react";

export interface FeedbackButtonProps {
  findingId: string;
  initialFeedback?: "useful" | "incorrect" | "dismissed" | null | undefined;
  onFeedbackChange?: ((findingId: string, feedback: "useful" | "incorrect" | "dismissed") => void) | undefined;
}

export function FeedbackButton({
  findingId,
  initialFeedback = null,
  onFeedbackChange,
}: FeedbackButtonProps) {
  const [currentFeedback, setCurrentFeedback] = useState<"useful" | "incorrect" | "dismissed" | null>(
    initialFeedback
  );

  const handleSelect = (feedback: "useful" | "incorrect" | "dismissed") => {
    setCurrentFeedback(feedback);
    onFeedbackChange?.(findingId, feedback);
  };

  const buttonStyle = (active: boolean, activeColor: string) => ({
    padding: "0.25rem 0.625rem",
    borderRadius: "0.375rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    cursor: "pointer",
    border: active ? `1px solid ${activeColor}` : "1px solid #d1d5db",
    background: active ? activeColor : "#ffffff",
    color: active ? "#ffffff" : "#374151",
    transition: "all 0.15s ease",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} data-testid={`feedback-group-${findingId}`}>
      <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Helpful?</span>
      <button
        type="button"
        data-testid={`feedback-useful-${findingId}`}
        onClick={() => handleSelect("useful")}
        style={buttonStyle(currentFeedback === "useful", "#16a34a")}
      >
        👍 Yes
      </button>
      <button
        type="button"
        data-testid={`feedback-incorrect-${findingId}`}
        onClick={() => handleSelect("incorrect")}
        style={buttonStyle(currentFeedback === "incorrect", "#dc2626")}
      >
        👎 False Positive
      </button>
      <button
        type="button"
        data-testid={`feedback-dismissed-${findingId}`}
        onClick={() => handleSelect("dismissed")}
        style={buttonStyle(currentFeedback === "dismissed", "#6b7280")}
      >
        ✕ Dismiss
      </button>
    </div>
  );
}
