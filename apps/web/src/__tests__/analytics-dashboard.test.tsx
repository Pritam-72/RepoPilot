import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AnalyticsPage from "../app/analytics/page.js";

describe("Analytics Page (FR-22)", () => {
  it("renders organization analytics header and KPI cards", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("Organization Analytics & Quality")).toBeDefined();
    expect(screen.getByText("Total Reviews")).toBeDefined();
    expect(screen.getByText("Mean Review Latency")).toBeDefined();
    expect(screen.getByText("Verified Finding Rate")).toBeDefined();
    expect(screen.getByText("Helpful Feedback Rate")).toBeDefined();
  });

  it("renders severity and agent category distribution breakdown sections", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("Findings by Severity")).toBeDefined();
    expect(screen.getByText("Findings by Agent Category")).toBeDefined();
    expect(screen.getByText("critical")).toBeDefined();
    expect(screen.getByText("security")).toBeDefined();
    expect(screen.getByText("performance")).toBeDefined();
  });
});

