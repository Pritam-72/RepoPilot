# Changelog

All notable changes and architectural decisions for the **RepoPilot / Agentic Code Reviewer** platform are documented in this file.

---

## [Phase 12] - 2026-11-03
### Added
- **Automated Regression Test Generation Agent** (`packages/agents/src/test-gen-agent.ts`): Automatically creates minimal, runnable regression test cases verifying boundary logic and defects identified by verified findings.
- **Test Proposal Schema Contract** (`packages/review-contracts/src/test-proposal.schema.ts`): Type-safe entity schema for generated regression tests and sandbox validation logs.
- **Test Proposals API** (`apps/api/src/routes/test-proposals.ts`): Endpoints for requesting and inspecting automated regression test cases.

---

## [Phase 11] - 2026-11-03
### Added
- **Organization Analytics Endpoint** (`apps/api/src/routes/analytics.ts`): Aggregate review statistics, duration metrics, verified finding rates, and developer feedback acceptance percentages.
- **Analytics Dashboard UI** (`apps/web/src/app/analytics/page.tsx`): Overview KPI cards and distribution bars for finding severities and agent categories.
- **Interactive Repository Settings UI** (`apps/web/src/app/repositories/[id]/settings/page.tsx`): Per-repository review automation toggles, agent role selection, confidence threshold sliders, and convention viewing.

---

## [Phase 10] - 2026-11-03
### Added
- **GitHub Actions CI/CD Pipeline** (`.github/workflows/ci.yml`): Automated typechecking, monorepo test suites, and pilot benchmark gate verification on push and pull requests.
- **Root Documentation & Environment Blueprint** (`README.md`, `.env.example`): Architecture blueprints, Quickstart guide, and environment variable configurations.

---

## [Phase 9] - 2026-11-03
### Added
- **PerformanceReviewAgent** (`packages/agents/src/performance-agent.ts`): Analyzes code diffs and AST queries for $O(N^2)$ algorithmic loops, N+1 query patterns, unindexed access, and resource leaks.
- **DependencyReviewAgent** (`packages/agents/src/dependency-agent.ts`): Specialized review agent for package manifests (`package.json`, `requirements.txt`) detecting wildcard version pins (`*`), typosquatting, and vulnerable packages.
- **Intelligent Agent Routing** (`packages/agents/src/orchestrator.ts`): Routes changed files selectively based on file paths and AST types (e.g. manifest changes routed to dependency reviewer).
- **Multi-Model Provider Fallback & Circuit Breaking** (`packages/agents/src/llm-provider.ts`): Transparent fallback across primary and secondary models upon 429 quota exhaustion or timeouts.
- **Repository Conventions Engine** (`packages/repository-context/src/config-loader.ts`): Schema validation and loader for `.repopilot.json` and `.acr.json` configuring custom guidelines, banned code patterns, and category filters.
- **Expanded Benchmark Suite** (`tests/fixtures/performance-prs` and `tests/fixtures/dependency-prs`): Added N+1 and vulnerable dependency fixtures, achieving 100% precision, 0% FPR, 100% recall, and 0 crashes across all 7 benchmark test cases.
- **Tenant Concurrency Limiter & Retention Workflows** (`apps/worker/src/concurrency-limiter.ts`, `apps/worker/src/retention-service.ts`): Concurrency token slots per installation, automated retention cleanup (`cleanupOldData`), and GDPR-compliant tenant export (`exportTenantData`).

---

## [Phase 8] - 2026-11-03
### Added
- **Safe Remediation & Fix Proposal Agent** (`packages/agents/src/fix-agent.ts`): Minimal unified diff patch generation strictly constrained to verified findings.
- **Isolated Docker Sandbox Runner** (`packages/static-analysis/src/sandbox-runner.ts`, `docker/Dockerfile.sandbox`): Disposable non-root container environment (`--network none`) enforcing CPU, memory, and timeout bounds.
- **Fix Proposal Approval & Application API** (`apps/api/src/routes/fix-proposals.ts`): Human-in-the-loop sign-off flow (`POST /api/v1/fix-proposals/:id/approve` and `apply`) preventing unapproved write actions.

---

## [Phase 7] - 2026-11-03
### Added
- **Next.js 14 Web Dashboard** (`apps/web`): Overview metrics, tracked repository index (`/repositories`), review run detail (`/reviews/[id]`), inline diff viewer, and feedback buttons.
- **Automated Benchmark Evaluation Suite** (`tests/evaluation/run-benchmark.ts`, `benchmark-reporter.ts`): Pilot readiness evaluation testing true/false positives, line localization, and crash resistance.
- **Repository Settings & Authorization API** (`apps/api/src/routes/repositories.ts`, `apps/api/src/routes/reviews.ts`): Tenant isolation, cross-tenant 403 access guards, and review configuration endpoints.

---

## [Phase 6] - 2026-11-02
### Added
- **Verification & Proximity Deduplication Engine** (`packages/agents/src/verification.ts`): Evidence validation against exact head SHA file content, diff hunk range checking, and confidence thresholding ($\ge 0.75$).
- **GitHub Review Publisher** (`packages/github/src/review-publisher.ts`): Idempotent inline pull request comments with stable markdown markers (`<!-- acr-finding:... -->`) and overview summaries.

---

## [Phase 5] - 2026-11-02
### Added
- **Multi-Agent Orchestrator** (`packages/agents/src/orchestrator.ts`): Concurrent agent execution with fault isolation (`Promise.allSettled`).
- **SecurityReviewAgent** (`packages/agents/src/security-agent.ts`): Specialized CWE security scanner targeting injection, traversal, and hardcoded secrets.
- **QualityReviewAgent** (`packages/agents/src/quality-agent.ts`): Code maintainability and missing test coverage detection.

---

## [Phase 4] - 2026-11-02
### Added
- **Repository Context Builder** (`packages/repository-context`): Tree-sitter AST queries for TypeScript and Python, symbol extraction, and lexical context search.
- **Semgrep Adapter** (`packages/static-analysis/src/semgrep-runner.ts`): Deterministic static analysis rule execution and finding normalization.

---

## [Phase 3] - 2026-11-02
### Added
- **Single Bug Review Agent** (`packages/agents/src/bug-agent.ts`): Google Gemini structured output generation conforming to `FindingSchema`.
- **Agent Run Logging**: Database persistence of tokens, durations, and output JSON in Prisma `agent_runs`.

---

## [Phase 2] - 2026-11-02
### Added
- **GitHub Webhook Ingestion** (`apps/api/src/routes/webhooks.ts`): HMAC-SHA256 signature verification via `crypto.timingSafeEqual`.
- **Diff Parser** (`packages/github/src/diff-parser.ts`): Unified diff parser extracting changed line numbers, hunks, additions, and deletions.

---

## [Phase 1] - 2026-11-02
### Added
- **TypeScript ES2022 Monorepo Foundation**: Turborepo, pnpm workspaces, `@acr/database` (10 Prisma models), `@acr/observability` (Pino correlation logging), `@acr/review-contracts` (Zod schemas), and BullMQ queue pipelines.

---

## [Phase 0] - 2026-11-02
### Added
- **Product Definition & Test PR Fixtures**: Standardized ground-truth fixtures (`bug-prs`, `security-prs`, `clean-prs`), `expected-findings.json`, and GitHub App permissions specification.

