import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReviewAgentInput, Finding } from "@acr/review-contracts";

vi.mock("../bug-agent.js", () => ({
  runBugReviewAgent: vi.fn(),
}));

vi.mock("../security-agent.js", () => ({
  runSecurityReviewAgent: vi.fn(),
}));

vi.mock("../quality-agent.js", () => ({
  runQualityReviewAgent: vi.fn(),
}));

const { runBugReviewAgent } = await import("../bug-agent.js");
const { runSecurityReviewAgent } = await import("../security-agent.js");
const { runQualityReviewAgent } = await import("../quality-agent.js");
const { runReviewOrchestrator } = await import("../orchestrator.js");

const dummyInput: ReviewAgentInput = {
  repository: { owner: "acme", name: "app", repositoryId: 1 },
  pullRequest: { number: 40, baseSha: "base", headSha: "head", title: "Feature PR" },
  changedFiles: [
    {
      path: "src/feature.ts",
      status: "modified",
      patch: "@@ -1,2 +1,2 @@\n-old\n+new",
      additions: 1,
      deletions: 1,
    },
  ],
  context: [],
  reviewPolicy: {
    enabledCategories: ["correctness", "security", "testing"],
    minimumConfidence: 0.5,
  },
};

const bugFinding: Finding = {
  title: "Logic Bug",
  category: "correctness",
  severity: "high",
  confidence: 0.9,
  file: "src/feature.ts",
  line: 1,
  description: "Bug description",
  evidence: "new",
  verificationStatus: "unverified",
};

const secFinding: Finding = {
  title: "Security Issue",
  category: "security",
  severity: "critical",
  confidence: 0.95,
  file: "src/feature.ts",
  line: 1,
  description: "Security description",
  evidence: "new",
  verificationStatus: "unverified",
};

const qualFinding: Finding = {
  title: "Missing Test",
  category: "testing",
  severity: "medium",
  confidence: 0.8,
  file: "src/feature.ts",
  line: 1,
  description: "Test gap description",
  evidence: "new",
  verificationStatus: "unverified",
};

describe("runReviewOrchestrator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("orchestrates Bug, Security, and Quality agents in parallel and combines findings", async () => {
    vi.mocked(runBugReviewAgent).mockResolvedValueOnce({ findings: [bugFinding] });
    vi.mocked(runSecurityReviewAgent).mockResolvedValueOnce({ findings: [secFinding] });
    vi.mocked(runQualityReviewAgent).mockResolvedValueOnce({ findings: [qualFinding] });

    const result = await runReviewOrchestrator(dummyInput);

    expect(result.status).toBe("completed");
    expect(result.totalFindings).toBe(3);
    expect(result.agentRuns).toHaveLength(3);
    expect(result.allFindings).toEqual(
      expect.arrayContaining([bugFinding, secFinding, qualFinding])
    );

    expect(runBugReviewAgent).toHaveBeenCalledOnce();
    expect(runSecurityReviewAgent).toHaveBeenCalledOnce();
    expect(runQualityReviewAgent).toHaveBeenCalledOnce();
  });

  it("handles partial failure when one agent times out or throws", async () => {
    vi.mocked(runBugReviewAgent).mockResolvedValueOnce({ findings: [bugFinding] });
    vi.mocked(runSecurityReviewAgent).mockRejectedValueOnce(new Error("Gemini API timeout"));
    vi.mocked(runQualityReviewAgent).mockResolvedValueOnce({ findings: [qualFinding] });

    const result = await runReviewOrchestrator(dummyInput);

    expect(result.status).toBe("partially_completed");
    expect(result.totalFindings).toBe(2);

    const secRun = result.agentRuns.find((r) => r.agentType === "security")!;
    expect(secRun.status).toBe("failed");
    expect(secRun.error).toContain("Gemini API timeout");

    const bugRun = result.agentRuns.find((r) => r.agentType === "bug")!;
    expect(bugRun.status).toBe("completed");
    expect(bugRun.findings).toHaveLength(1);
  });

  it("returns failed status if all agents fail", async () => {
    vi.mocked(runBugReviewAgent).mockRejectedValueOnce(new Error("Bug agent error"));
    vi.mocked(runSecurityReviewAgent).mockRejectedValueOnce(new Error("Sec agent error"));
    vi.mocked(runQualityReviewAgent).mockRejectedValueOnce(new Error("Qual agent error"));

    const result = await runReviewOrchestrator(dummyInput);

    expect(result.status).toBe("failed");
    expect(result.totalFindings).toBe(0);
    expect(result.agentRuns.every((r) => r.status === "failed")).toBe(true);
  });

  it("executes only specified enabledAgents", async () => {
    vi.mocked(runSecurityReviewAgent).mockResolvedValueOnce({ findings: [secFinding] });

    const result = await runReviewOrchestrator(dummyInput, {
      enabledAgents: ["security"],
    });

    expect(result.status).toBe("completed");
    expect(result.agentRuns).toHaveLength(1);
    expect(runSecurityReviewAgent).toHaveBeenCalledOnce();
    expect(runBugReviewAgent).not.toHaveBeenCalled();
    expect(runQualityReviewAgent).not.toHaveBeenCalled();
  });
});

