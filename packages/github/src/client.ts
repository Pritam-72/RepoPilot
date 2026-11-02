import { App } from "@octokit/app";
import { Octokit } from "@octokit/rest";

/**
 * Creates an Octokit REST client authenticated as a GitHub App installation.
 */
export async function createInstallationOctokit(
  installationId: number,
  appId: number | string,
  privateKey: string
): Promise<Octokit> {
  const app = new App({ appId, privateKey });
  const octokit = await app.getInstallationOctokit(installationId);
  // Cast: @octokit/app returns OctokitType which is compatible with Octokit
  return octokit as unknown as Octokit;
}
