# Known Issues & Operational Considerations

This document records architectural boundaries, current operational limits, and considerations for running **RepoPilot / Agentic Code Reviewer** in production.

---

## 1. Supported Languages & Parsers
- **Current Support:** Full AST analysis and symbol queries are supported for **TypeScript/JavaScript** (`.ts`, `.tsx`, `.js`, `.jsx`) and **Python** (`.py`) via Tree-sitter.
- **Other Languages:** General diff analysis and LLM reasoning function for all text formats; deep AST symbol extraction for Go, Java, or Rust requires registering corresponding Tree-sitter grammars in `@acr/repository-context`.

## 2. Token Budget & Diff Scaling
- **Default File Limit:** 50 files per pull request. Pull requests exceeding this limit have priority files reviewed first (manifests, source files) while generated assets or lockfiles are omitted.
- **Diff Budget:** Max 2,000 changed lines per job. Diffs exceeding the budget are chunked by file to ensure prompt token safety.

## 3. Sandbox Execution Boundaries
- **Container Isolation:** The Fix Proposal Agent executes test commands in an ephemeral non-root container with `--network none` and `--read-only` root filesystem.
- **Host Process Fallback:** On environments without Docker daemon access, the runner falls back to an unprivileged child process with stripped environment variables and bounded execution timeouts. Production deployments should always ensure the Docker daemon or a microVM runner (e.g. Firecracker/gVisor) is configured.

## 4. GitHub API Secondary Rate Limits
- High-volume review runs (multiple large PRs simultaneously) may encounter GitHub REST API rate limits. The Octokit client utilizes exponential backoff, and inline review comments are submitted as a single unified batch review (`pulls.createReview`) rather than individual comment API calls.

## 5. Model Provider Latency & Quotas
- While provider circuit-breaking and fallback routing are in place, LLM inference latency scales with prompt size and provider load. BullMQ queue workers should be scaled horizontally to maintain job intake SLA during peak development hours.
