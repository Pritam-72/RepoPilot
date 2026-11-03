import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RepositorySettingsPage from "../app/repositories/[id]/settings/page.js";

describe("Repository Settings Page (Task 7.1 / FR-21)", () => {
  it("renders settings form with automation toggles and confidence slider", () => {
    render(<RepositorySettingsPage params={{ id: "repo-123" }} />);
    expect(screen.getByText("Repository Review Settings")).toBeDefined();
    expect(screen.getByText("Automated Pull Request Reviews")).toBeDefined();
    expect(screen.getByText("Verification Confidence Threshold")).toBeDefined();
    expect(screen.getByTestId("confidence-slider")).toBeDefined();
    expect(screen.getByTestId("confidence-value").textContent).toBe("0.75");
  });

  it("allows updating confidence threshold via slider", () => {
    render(<RepositorySettingsPage params={{ id: "repo-123" }} />);
    const slider = screen.getByTestId("confidence-slider");

    fireEvent.change(slider, { target: { value: "0.85" } });
    expect(screen.getByTestId("confidence-value").textContent).toBe("0.85");
  });

  it("displays success banner when save button is clicked", () => {
    render(<RepositorySettingsPage params={{ id: "repo-123" }} />);
    const saveBtn = screen.getByTestId("save-settings-btn");

    fireEvent.click(saveBtn);
    expect(screen.getByTestId("save-success-banner")).toBeDefined();
  });
});

