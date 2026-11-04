import type { Octokit } from "@octokit/rest";
import { withRateLimitRetry } from "./client.js";

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

export interface PRCommit {
  sha: string;
  message: string;
  author: string;
}

/**
 * Fetches PR metadata including base/head SHAs, title, and author with rate limit backoff.
 */
export async function getPRMetadata(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number
): Promise<PRMetadata> {
  return withRateLimitRetry(async () => {
    const { data } = await octokit.pulls.get({ owner, repo, pull_number: prNumber });
    return {
      baseSha: data.base.sha,
      headSha: data.head.sha,
      title: data.title,
      author: data.user?.login ?? "unknown",
    };
  });
}

/**
 * Fetches all changed files in a pull request with automatic Octokit pagination
 * and rate limit retry.
 */
export async function getChangedFiles(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number
): Promise<ChangedFile[]> {
  return withRateLimitRetry(async () => {
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
  });
}

/**
 * Fetches all commits associated with a pull request using pagination
 * and rate limit backoff.
 */
export async function getPRCommits(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number
): Promise<PRCommit[]> {
  return withRateLimitRetry(async () => {
    const commits = await octokit.paginate(octokit.pulls.listCommits, {
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100,
    });

    return commits.map((c) => ({
      sha: c.sha,
      message: c.commit.message,
      author: c.author?.login ?? c.commit.author?.name ?? "unknown",
    }));
  });
}

/**
 * Fetches the UTF-8 content of a file at a specific Git ref with rate limit retry.
 */
export async function getFileContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  ref: string
): Promise<string> {
  return withRateLimitRetry(async () => {
    const { data } = await octokit.repos.getContent({ owner, repo, path, ref });
    if (!("content" in data) || typeof data.content !== "string") {
      throw new Error(`Not a file: ${path}`);
    }
    return Buffer.from(data.content, "base64").toString("utf8");
  });
}
