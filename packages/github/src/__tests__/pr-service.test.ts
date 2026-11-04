import { describe, it, expect, vi } from "vitest";
import { getPRMetadata, getChangedFiles, getPRCommits, getFileContent } from "../pr-service.js";
import type { Octokit } from "@octokit/rest";

function mockOctokit(overrides: Partial<{
  pullsGet: unknown;
  paginateResult: unknown[];
  reposGetContent: unknown;
}> = {}): Octokit {
  const pullsGet = vi.fn().mockResolvedValue(
    overrides.pullsGet ?? {
      data: {
        base: { sha: "base-sha" },
        head: { sha: "head-sha" },
        title: "Test PR",
        user: { login: "testuser" },
      },
    }
  );

  const paginate = vi.fn().mockResolvedValue(
    overrides.paginateResult ?? [
      { filename: "src/index.ts", status: "modified", patch: "@@ -1,1 +1,2 @@\n line1\n+line2", additions: 1, deletions: 0 },
      { filename: "removed.ts", status: "removed", patch: undefined, additions: 0, deletions: 5 },
    ]
  );

  const reposGetContent = vi.fn().mockResolvedValue(
    overrides.reposGetContent ?? {
      data: {
        type: "file",
        content: Buffer.from("export const hello = 'world';").toString("base64"),
      },
    }
  );

  return {
    pulls: { get: pullsGet, listFiles: {}, listCommits: {} },
    repos: { getContent: reposGetContent },
    paginate,
  } as unknown as Octokit;
}

describe("getPRMetadata", () => {
  it("returns parsed PR metadata", async () => {
    const octokit = mockOctokit();
    const meta = await getPRMetadata(octokit, "acme", "repo", 1);
    expect(meta).toEqual({
      baseSha: "base-sha",
      headSha: "head-sha",
      title: "Test PR",
      author: "testuser",
    });
  });
});

describe("getChangedFiles", () => {
  it("filters out removed files and returns changed files with patch", async () => {
    const octokit = mockOctokit();
    const files = await getChangedFiles(octokit, "acme", "repo", 1);
    expect(files).toHaveLength(1);
    expect(files[0]!.path).toBe("src/index.ts");
    expect(files[0]!.additions).toBe(1);
  });

  it("handles pagination with >100 files across multiple pages", async () => {
    // Generate 150 changed files simulating paginated API response
    const largeFileList = Array.from({ length: 150 }, (_, i) => ({
      filename: `src/module_${i}.ts`,
      status: "modified",
      patch: `@@ -1,1 +1,2 @@\n+const x${i} = ${i};`,
      additions: 1,
      deletions: 0,
    }));

    const octokit = mockOctokit({ paginateResult: largeFileList });
    const files = await getChangedFiles(octokit, "acme", "repo", 1);

    expect(files).toHaveLength(150);
    expect(files[0]!.path).toBe("src/module_0.ts");
    expect(files[149]!.path).toBe("src/module_149.ts");
  });

  it("returns empty array when no files", async () => {
    const octokit = mockOctokit({ paginateResult: [] });
    const files = await getChangedFiles(octokit, "acme", "repo", 2);
    expect(files).toEqual([]);
  });
});

describe("getPRCommits", () => {
  it("fetches paginated commits and extracts sha, message, and author", async () => {
    const mockCommits = [
      {
        sha: "commit-111",
        commit: { message: "feat: add user login", author: { name: "Alice" } },
        author: { login: "alice" },
      },
      {
        sha: "commit-222",
        commit: { message: "fix: prevent NPE", author: { name: "Bob" } },
        author: null,
      },
    ];

    const octokit = mockOctokit({ paginateResult: mockCommits });
    const commits = await getPRCommits(octokit, "acme", "repo", 42);

    expect(commits).toHaveLength(2);
    expect(commits[0]).toEqual({
      sha: "commit-111",
      message: "feat: add user login",
      author: "alice",
    });
    expect(commits[1]).toEqual({
      sha: "commit-222",
      message: "fix: prevent NPE",
      author: "Bob",
    });
  });
});

describe("getFileContent", () => {
  it("fetches and decodes base64 file content", async () => {
    const octokit = mockOctokit();
    const content = await getFileContent(octokit, "acme", "repo", "src/hello.ts", "main");
    expect(content).toBe("export const hello = 'world';");
  });

  it("throws when response is not a file", async () => {
    const octokit = mockOctokit({
      reposGetContent: { data: [{ name: "folder_item" }] },
    });
    await expect(
      getFileContent(octokit, "acme", "repo", "src/dir", "main")
    ).rejects.toThrow("Not a file: src/dir");
  });
});
