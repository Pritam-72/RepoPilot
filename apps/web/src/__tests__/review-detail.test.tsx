import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ReviewDetailPage from "../app/reviews/[id]/page.js";
import { FindingCard } from "../components/finding-card.js";
import { DiffViewer } from "../components/diff-viewer.js";
import { FeedbackButton } from "../components/feedback-button.js";

describe("Review Detail & Finding Feedback (Task 7.2)", () => {
  it("renders diff viewer with syntax lines", () => {
    const diff = `--- a/file.ts\n+++ b/file.ts\n@@ -1,1 +1,1 @@\n+const a = 1;`;
    render(<DiffViewer patch={diff} highlightLine={4} />);
    expect(screen.getByTestId("diff-viewer")).toBeDefined();
    expect(screen.getByText("+const a = 1;")).toBeDefined();
  });

  it("renders finding card with severity, evidence, and remediation", () => {
    const finding = {
      id: "test-finding-1",
      category: "correctness" as const,
      severity: "high" as const,
      file: "src/calc.ts",
      line: 12,
      title: "Division by zero",
      description: "Potential divide by zero when count is 0",
      evidence: "return total / count;",
      recommendation: "return count === 0 ? 0 : total / count;",
      confidence: 0.92,
      verificationStatus: "verified" as const,
    };

    render(<FindingCard finding={finding} />);
    expect(screen.getByText("HIGH")).toBeDefined();
    expect(screen.getByText("Bug / Correctness")).toBeDefined();
    expect(screen.getByText("Division by zero")).toBeDefined();
    expect(screen.getByText("return total / count;")).toBeDefined();
    expect(screen.getByText("return count === 0 ? 0 : total / count;")).toBeDefined();
  });

  it("handles feedback button clicks (useful, incorrect, dismissed)", () => {
    const onFeedback = vi.fn();
    render(<FeedbackButton findingId="f-1" onFeedbackChange={onFeedback} />);

    const usefulBtn = screen.getByTestId("feedback-useful-f-1");
    fireEvent.click(usefulBtn);
    expect(onFeedback).toHaveBeenCalledWith("f-1", "useful");

    const incorrectBtn = screen.getByTestId("feedback-incorrect-f-1");
    fireEvent.click(incorrectBtn);
    expect(onFeedback).toHaveBeenCalledWith("f-1", "incorrect");
  });

  it("renders complete review detail page with review information and feedback confirmation", () => {
    render(<ReviewDetailPage params={{ id: "run-101" }} />);
    expect(screen.getByText("PR #42")).toBeDefined();
    expect(screen.getByText("Verified Findings (1)")).toBeDefined();

    const usefulBtn = screen.getByTestId("feedback-useful-f-1");
    fireEvent.click(usefulBtn);
    expect(screen.getByTestId("feedback-confirmation")).toBeDefined();
  });
});
