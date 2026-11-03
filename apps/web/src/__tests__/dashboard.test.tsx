import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../app/page.js";
import RepositoriesPage from "../app/repositories/page.js";
import { Nav } from "../components/nav.js";

describe("Web Dashboard (Task 7.1)", () => {
  it("renders global navigation bar with links and status", () => {
    render(<Nav activePath="/" />);
    expect(screen.getByText("RepoPilot")).toBeDefined();
    expect(screen.getByText("Overview")).toBeDefined();
    expect(screen.getByText("Repositories")).toBeDefined();
    expect(screen.getByText("System Operational")).toBeDefined();
  });

  it("renders dashboard overview with key metrics", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Review Operations Dashboard")).toBeDefined();
    expect(screen.getByText("Total Reviews")).toBeDefined();
    expect(screen.getByText("Verified Findings")).toBeDefined();
    expect(screen.getByText("False Positive Rate")).toBeDefined();
    expect(screen.getByText("Avg Review Latency")).toBeDefined();
  });

  it("renders recent review runs table", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("recent-runs-table")).toBeDefined();
    expect(screen.getByText("Pritam-72/RepoPilot")).toBeDefined();
    expect(screen.getByText("#42")).toBeDefined();
  });

  it("renders repositories list page with repository cards", () => {
    render(<RepositoriesPage />);
    expect(screen.getByText("Tracked Repositories")).toBeDefined();
    expect(screen.getByTestId("repo-card-repo-1")).toBeDefined();
    expect(screen.getByText("ecommerce-api")).toBeDefined();
  });
});
