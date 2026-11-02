import type { Octokit } from "@octokit/rest";

export interface PRMetadata {
  baseSha: string;
  headSha: string;
  title: string;
  author: string;
}

export interface ChangedFile {
  path: string;
  status: string;
  patch: string;
  additions: number;
  deletions: number;
}

export async function getPRMetadata(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number
): Promise<PRMetadata> {
  const { data } = await octokit.pulls.get({ owner, repo, pull_number: prNumber });
  return {
    baseSha: data.base.sha,
    headSha: data.head.sha,
    title: data.title,
    author: data.user?.login ?? "unknown",
  };
}

export async function getChangedFiles(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number
): Promise<ChangedFile[]> {
  const files = await octokit.paginate(octokit.pulls.listFiles, {
    owner,
    repo,
    pull_number: prNumber,
    per_page: 100,
  });

  return files
    .filter((f) => f.status !== "removed" && f.patch !== undefined)
    .map((f) => ({
      path: f.filename,
      status: f.status,
      patch: f.patch ?? "",
      additions: f.additions,
      deletions: f.deletions,
    }));
}

export async function getFileContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  ref: string
): Promise<string> {
  const { data } = await octokit.repos.getContent({ owner, repo, path, ref });
  if (!("content" in data) || typeof data.content !== "string") {
    throw new Error(`Not a file: ${path}`);
  }
  return Buffer.from(data.content, "base64").toString("utf8");
}

