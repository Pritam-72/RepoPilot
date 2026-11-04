#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runGeneralistReview, type ReviewFileContext } from "./generalist-agent.js";
import { MockLLMProvider, getLLMProvider } from "./llm-provider.js";
import { logger } from "@acr/observability";

export async function runReviewCli(argv: string[] = process.argv.slice(2)): Promise<void> {
  let repo = "";
  let prNumber = 0;
  let filePath = "";
  let patchPath = "";
  let contentPath = "";
  let providerName = process.env["LLM_DEFAULT_PROVIDER"] ?? "gemini";
  let outputJsonOnly = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--repo" && argv[i + 1]) {
      repo = argv[++i]!;
    } else if (arg === "--pr" && argv[i + 1]) {
      prNumber = parseInt(argv[++i]!, 10);
    } else if (arg === "--file" && argv[i + 1]) {
      filePath = argv[++i]!;
    } else if (arg === "--patch" && argv[i + 1]) {
      patchPath = argv[++i]!;
    } else if (arg === "--content" && argv[i + 1]) {
      contentPath = argv[++i]!;
    } else if (arg === "--provider" && argv[i + 1]) {
      providerName = argv[++i]!;
    } else if (arg === "--json") {
      outputJsonOnly = true;
    }
  }

  const files: ReviewFileContext[] = [];

  if (filePath && patchPath) {
    const patch = readFileSync(patchPath, "utf-8");
    const content = contentPath ? readFileSync(contentPath, "utf-8") : readFileSync(filePath, "utf-8");
    files.push({ path: filePath, patch, content });
  } else {
    // Default fallback sample review unit if no flags provided
    files.push({
      path: "src/paginate.ts",
      patch: `@@ -1,5 +1,5 @@\n export function getPage(items: string[], page: number, size: number): string[] {\n   const start = (page - 1) * size;\n-  const end = start + size;\n+  const end = start + size + 1;\n   return items.slice(start, end);\n }`,
      content: `export function getPage(items: string[], page: number, size: number): string[] {\n  const start = (page - 1) * size;\n  const end = start + size + 1;\n  return items.slice(start, end);\n}\n`,
    });
  }

  const provider = getLLMProvider(providerName);
  const result = await runGeneralistReview(files, { provider });

  const output = {
    repo: repo || "local-test",
    pr: prNumber || 1,
    status: "completed",
    provider: result.provider,
    model: result.model,
    promptVersion: result.promptVersion,
    findingsCount: result.findings.length,
    findings: result.findings,
    rejectedFindings: result.rejectedFindings,
    usage: result.usage,
    durationMs: result.durationMs,
  };

  if (outputJsonOnly) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log("\n--- AGENTIC CODE REVIEWER: BASELINE RUN ---");
    console.log(`Repository: ${output.repo} | PR: #${output.pr}`);
    console.log(`Provider: ${output.provider} | Model: ${output.model} | Version: ${output.promptVersion}`);
    console.log(`Duration: ${output.durationMs}ms | Tokens: ${output.usage.totalTokens}`);
    console.log(`Findings: ${output.findingsCount} verified | ${output.rejectedFindings.length} rejected\n`);
    console.log(JSON.stringify(output.findings, null, 2));
  }
}

if (process.argv[1]?.endsWith("cli.js") || process.argv[1]?.endsWith("cli.ts")) {
  runReviewCli().catch((err) => {
    logger.error({ error: err.message }, "CLI Execution error");
    process.exit(1);
  });
}
