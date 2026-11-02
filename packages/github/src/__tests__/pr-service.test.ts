import { describe, it, expect, vi, type MockedFunction } from "vitest";
import { getPRMetadata, getChangedFiles } from "../pr-service.js";
import type { Octokit } from "@octokit/rest";

// Minimal mock of Octokit focused on the methods we use
function mockOctokit(overrides: Partial<{
  pullsGet: unknown;
  paginateResult: unknown[];
}>): Octokit {
  const pullsGet = vi.fn().mockResolvedValue({
    data: {
      base: { sha: "base-sha" },
      head: { sha: "head-sha" },
      title: "Test PR",
      user: { login: "testuser" },
    },
  });

  const paginate = vi.fn().mockResolvedValue(
    overrides.paginateResult ?? [
      { filename: "src/index.ts", status: "modified", patch: "@@ -1,1 +1,2 @@\n line1\n+line2", additions: 1, deletions: 0 },
      { filename: "removed.ts", status: "removed", patch: undefined, additions: 0, deletions: 5 },
    ]
  );

  return {
    pulls: { get: pullsGet, listFiles: {} },
    paginate,
  } as unknown as Octokit;
}

describe("getPRMetadata", () => {
  it("returns parsed PR metadata", async () => {
    const octokit = mockOctokit({});
    const meta = await getPRMetadata(octokit, "acme", "repo", 1);
    expect(meta).toEqual({ baseSha: "base-sha", headSha: "head-sha", title: "Test PR", author: "testuser" });
  });
});

describe("getChangedFiles", () => {
  it("filters out removed files and returns changed files with patch", async () => {
    const octokit = mockOctokit({});
    const files = await getChangedFiles(octokit, "acme", "repo", 1);
    expect(files).toHaveLength(1);
    expect(files[0]!.path).toBe("src/index.ts");
    expect(files[0]!.additions).toBe(1);
  });

  it("returns empty array when no files", async () => {
    const octokit = mockOctokit({ paginateResult: [] });
    const files = await getChangedFiles(octokit, "acme", "repo", 2);
    expect(files).toEqual([]);
  });
});

