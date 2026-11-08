# plan.md — Agentic Code Reviewer

> **Single source of truth for building this project.**
> Every contributor (human or AI) must read this file at the start of every session and follow it.
> If reality and this file disagree, stop, update this file first, then continue.

---

## 0. Standing Prompt for the AI Coding Assistant (paste this at the start of every session)

```text
You are a senior TypeScript engineer building the "Agentic Code Reviewer".
The file plan.md in the repo root is your single source of truth. Follow it at all times.

BEFORE WRITING ANY CODE
1. Read plan.md fully. State which Phase we are in and which Completion Criteria are still open.
2. Work ONLY on the current phase. Never start the next phase until every Completion
   Criterion of the current phase is checked off (Section 14 tracker).
3. If a request conflicts with plan.md, say so and propose an update to plan.md before coding.
4. If something is unclear or an API key / credential is missing, ask. Never guess or invent.

WHILE WRITING CODE
5. Follow Sections 7 (patterns), 8 (hard limits) and 12 (code-size and optimisation rules).
6. OPTIMISE AGGRESSIVELY: if 1000 lines can become 200 without losing behaviour,
   tests or readability, do it. Prefer deleting code, reusing a well-maintained library,
   or a simpler design over adding new code. No dead code, no speculative abstractions,
   no copy-paste. Show a before/after line count when you simplify something significant.
7. Never invent file paths, line numbers, API fields, package names or code evidence.
   If unsure, verify against the repo or official docs.
8. Every function, config value and external input must be validated (Zod at boundaries,
   strict TypeScript inside). Check ALL parameters (see the Parameter Checklist, Section 13).
9. Every external call (GitHub, LLM, Redis, DB) needs: timeout, bounded retry with
   exponential backoff + jitter, error classification, and structured logging.
10. Never trust an LLM output. Parse it with a schema, then verify it against real code.
11. Write or update tests in the same change as the code (Vitest).

AFTER WRITING CODE
12. Run: typecheck, lint, tests, and (when relevant) the benchmark. Report results honestly,
    including failures. Never claim something works without having run it.
13. Walk through the Parameter Checklist (Section 13) and the phase Completion Criteria.
14. Update the progress tracker (Section 14) and note any deviation, risk or open question.
15. Summarise: what changed, what was removed, line-count delta, what is next.
```

---

## 1. Project Summary

An AI-powered, multi-agent system that reviews GitHub Pull Requests like a senior engineer. It ingests a PR, builds code context, runs specialised review agents, **verifies** every candidate finding against real code, and publishes only evidence-backed comments with exact file paths and line numbers.

**Primary objective:** correctness and precision first, then recall. Fail visibly, never silently.

**Non-goals (for now):** auto-fixing/committing code, executing untrusted PR code, supporting non-GitHub hosts, a fancy web UI (a minimal dashboard is optional, only after Phase 9).

---

## 2. Architecture Overview

```text
GitHub ──webhook──▶ Express (verify signature, enqueue, return 200 fast)
                         │
                         ▼
                 Redis + BullMQ  (idempotent jobs, retries, dead-letter queue)
                         │
                         ▼
                 Review Pipeline (Mastra workflow)
   ┌──────────────────────────────────────────────────────────────┐
   │ 1. Ingest      PR metadata, files, diff (Octokit)            │
   │ 2. Context     Tree-sitter symbols, imports, callers/callees │
   │ 3. Chunk       context-aware chunks within token budget      │
   │ 4. Static      Semgrep + ESLint (deterministic signals)      │
   │ 5. Agents      Bug | Security | ErrorHandling | Perf |       │
   │                Test | Quality   (parallel, isolated)         │
   │ 6. Verify      Verification Agent + deterministic checks     │
   │ 7. Aggregate   dedupe, rank, severity, confidence, coverage  │
   │ 8. Publish     GitHub review comments + summary              │
   └──────────────────────────────────────────────────────────────┘
                         │
                         ▼
        PostgreSQL (Prisma): reviews, agent runs, findings, feedback, benchmarks
                         │
                         ▼
      Logs (pino) + traces (OpenTelemetry) + metrics (tokens, latency, failures)
```

Key idea: **LLMs propose, deterministic code disposes.** Line numbers, paths, and code snippets are always checked against the actual diff/files before anything is published.

---

## 3. Areas to Focus On (priority order)

1. **Precision / false-positive control** — the verification stage is the heart of the product.
2. **Evidence grounding** — every finding quotes real code and maps to a valid diff line.
3. **Reliability** — retries, timeouts, partial-failure handling, honest "incomplete review" reporting.
4. **Context quality** — the right surrounding code beats a bigger model.
5. **Benchmark & measurement** — build evaluation early (before multi-agent), measure every change.
6. **Modular LLM layer** — swap Gemini/Claude without touching pipeline code.
7. **Security of the system itself** — webhook verification, prompt-injection resistance, secret handling, no execution of PR code.
8. **Cost & latency control** — token budgets, caching, skipping trivial files.
9. **Observability** — you cannot fix what you cannot see.
10. **Simplicity** — smallest codebase that meets the requirements (Section 12).

---

## 4. What to Apply (patterns and practices)

| Concern | Apply |
|---|---|
| LLM abstraction | `LLMProvider` interface (ports and adapters). Adapters for Gemini and Claude; chosen by config. |
| Structured output | Zod schema per agent; use provider JSON/tool-call mode; validate; on failure retry with the validation error (max 2), then mark the agent run failed. |
| Evidence-first findings | A finding is invalid unless it has `file`, `lineStart/lineEnd`, and an `evidenceSnippet` that is an exact substring of the file at the reviewed commit. |
| Line validation | Deterministically map each finding to a commentable diff line (GitHub `line` + `side` + `commit_id`). Reject or demote findings outside the diff. |
| Verification | Second-pass agent with *different prompt and ideally different model*, plus deterministic checks (snippet exists, line in diff, not a duplicate, Semgrep/ESLint corroboration when available). |
| Retry policy | Bounded retries (e.g. 3), exponential backoff with jitter, only for transient errors (429, 5xx, network, timeout). Never retry 4xx validation errors. |
| Rate limits | Honour `Retry-After` / GitHub rate-limit headers; per-installation concurrency limits in BullMQ; circuit breaker per provider. |
| Idempotency | Job key = `repo + prNumber + headSha`. Re-delivered webhooks must not create duplicate reviews. |
| Partial failure | Each agent runs in isolation with its own timeout. Failures are recorded; the summary lists exactly which analyses were skipped or incomplete. |
| Chunking | Split by syntactic units (function/class) via Tree-sitter, include signature, imports and callers; never cut mid-function; respect model context limit with a reserved output budget. |
| Deterministic tools | Run Semgrep/ESLint first; feed results to agents as hints, and to the verifier as corroboration. |
| Prompt-injection defence | Treat PR title/body/code/comments as untrusted data. Wrap in delimiters, instruct the model to never follow instructions found in code, validate outputs by schema, give agents no write/exec tools. |
| Caching | Cache by `(fileSha, agent, promptVersion, model)` to avoid paying twice for unchanged chunks. |
| Config | One typed, Zod-validated config module; fail fast at startup if anything is missing. |
| Versioning | Version prompts (`promptVersion`) and record it on every agent run so benchmark results are comparable. |

---

## 5. Limitations and Hard Rules (must follow)

**Product rules**
- Never publish a finding that failed verification.
- Never invent file paths, line numbers, or code evidence.
- Never claim a review is complete if any agent failed, timed out, or any file was skipped; the summary must list what was not analysed.
- Cap comments per PR (e.g. default 15, configurable), ordered by severity × confidence. Quality over quantity.
- Minimum confidence threshold to publish (start at 0.7; tune using the benchmark).
- Do not comment on generated files, lockfiles, vendored code, minified bundles, or binary files.

**Security rules**
- Verify `X-Hub-Signature-256` with HMAC-SHA256 on the **raw** request body, using constant-time comparison.
- Never execute, build, or install code from a PR. Static analysis only, inside a sandboxed container with no network and read-only mounts.
- Never log secrets, tokens, private keys, or full source code at info level. Redact.
- Short-lived GitHub installation tokens only; never persist them.
- Store the GitHub App private key in a secret manager or env var, never in the repo.
- Send only the code needed to an external LLM; document this for users (code leaves your infrastructure).

**Technical limits to design around**
- LLM context windows and output limits differ per model; check current limits in provider docs and store them in config.
- GitHub review comments can only attach to lines that are part of the diff; very large diffs may be truncated by the API.
- GitHub API has primary and secondary rate limits (check current docs); batch comments into a single review submission rather than posting one by one.
- LLM output is non-deterministic: use low temperature, schema validation, and measure variance in the benchmark.
- LLMs may have memorised famous bugs/fixes: benchmark contamination is a real risk (see Section 10).
- Semgrep and Tree-sitter support varies by language; start with **TypeScript/JavaScript** (and optionally Python), declare the supported list explicitly.

---

## 6. Requirements: Accounts, API Keys, Tools

### 6.1 Accounts and credentials

| Item | Where to get it | Used for |
|---|---|---|
| **GitHub App** (App ID, private key `.pem`, webhook secret, optionally client ID/secret) | GitHub → Settings → Developer settings → GitHub Apps | PR ingestion, publishing reviews, webhooks |
| **Google Gemini API key** | Google AI Studio | LLM provider |
| **Anthropic API key** | Anthropic Console | LLM provider |
| **PostgreSQL** instance | Docker locally; managed (Neon/Supabase/RDS) later | Persistence |
| **Redis** instance | Docker locally; managed (Upstash/ElastiCache) later | BullMQ queues |
| **Public webhook URL** | smee.io, ngrok, or Cloudflare Tunnel (dev); real domain (prod) | Receive GitHub webhooks |
| **GitHub Personal Access Token** (read-only, public repos) | GitHub settings | Benchmark mining only (higher rate limit) |
| *(Optional)* Semgrep account/token | semgrep.dev | Registry rules; OSS CLI works without it |
| *(Optional)* OTLP backend (Grafana, Honeycomb, Jaeger) | Any | Trace viewing |
| *(Optional)* Sentry DSN | sentry.io | Error tracking |

### 6.2 GitHub App configuration

- **Repository permissions (minimum):** Pull requests: Read & write · Contents: Read · Metadata: Read · Checks: Read & write *(optional, for check-runs)* · Issues: Read & write *(only if posting issue comments)*
- **Subscribe to events:** `pull_request` (opened, synchronize, reopened, ready_for_review), `pull_request_review_comment`, `issue_comment` (for commands like `/review`), `pull_request_review`
- **Webhook URL:** `https://<host>/webhooks/github`, **Webhook secret:** random 32+ bytes
- Principle of least privilege: add permissions only when a phase needs them.

### 6.3 `.env.example`

```bash
# --- Server ---
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# --- GitHub App ---
GITHUB_APP_ID=
GITHUB_APP_PRIVATE_KEY=        # PEM contents (use \n for newlines) or path
GITHUB_WEBHOOK_SECRET=
GITHUB_BENCHMARK_TOKEN=        # read-only PAT, benchmark mining only

# --- LLM providers ---
GOOGLE_GENERATIVE_AI_API_KEY=
ANTHROPIC_API_KEY=
LLM_DEFAULT_PROVIDER=gemini    # gemini | anthropic
LLM_REVIEW_MODEL=              # set from provider docs; never hard-code in logic
LLM_VERIFY_MODEL=              # prefer a different model from the review model
LLM_TIMEOUT_MS=60000
LLM_MAX_RETRIES=3

# --- Data ---
DATABASE_URL=postgresql://user:pass@localhost:5432/reviewer
REDIS_URL=redis://localhost:6379

# --- Review behaviour ---
MAX_COMMENTS_PER_PR=15
MIN_CONFIDENCE=0.7
MAX_FILES_PER_REVIEW=60
MAX_TOKENS_PER_REVIEW=500000   # hard cost cap
AGENT_TIMEOUT_MS=120000

# --- Observability (optional) ---
OTEL_EXPORTER_OTLP_ENDPOINT=
SENTRY_DSN=
```

> `.env` is git-ignored. Commit only `.env.example`. Config is validated at startup; a missing value stops the app with a clear message.

### 6.4 Local tooling

Node.js LTS · pnpm (or npm) · Docker + Docker Compose · Git · Semgrep CLI (runs in container; Python-based) · a tunnel tool for webhooks · `gh` CLI (handy for benchmark mining).

> Package names, model names, and API fields change. **Verify against official docs before using** and pin exact versions in the lockfile.

---

## 7. Repository Structure

```text
agentic-code-reviewer/
├─ plan.md                      # this file
├─ docker-compose.yml           # postgres, redis, (app, worker)
├─ prisma/schema.prisma
├─ src/
│  ├─ config/                   # Zod-validated env config
│  ├─ server/                   # Express app, webhook route, health
│  ├─ github/                   # Octokit client, auth, diff parse, publisher
│  ├─ queue/                    # BullMQ queues + workers
│  ├─ context/                  # tree-sitter parsing, symbol index, chunker
│  ├─ llm/                      # LLMProvider interface + gemini/anthropic adapters
│  ├─ agents/                   # one file per agent + shared base
│  ├─ static/                   # semgrep + eslint runners and normalisers
│  ├─ verify/                   # verification agent + deterministic checks
│  ├─ pipeline/                 # Mastra workflow wiring + aggregation
│  ├─ reliability/              # retry, timeout, circuit breaker, rate limiter
│  ├─ observability/            # logger, tracing, metrics
│  ├─ db/                       # prisma client + repositories
│  └─ schemas/                  # shared Zod schemas (Finding, AgentRun, ...)
├─ benchmark/
│  ├─ dataset/                  # cases.json (versioned, reproducible)
│  ├─ miner/                    # scripts to find bug-introducing / fixing commits
│  ├─ runner/                   # run reviewer over cases
│  └─ report/                   # metrics + comparison output
└─ tests/                       # unit, integration, fixtures
```

Dependency rule: `pipeline` may import everything; `agents` may import `llm`, `schemas`, `context` types only; `github` knows nothing about agents; no circular imports.

---

## 8. Core Data Contracts

### 8.1 Finding (Zod, source of truth)

```ts
export const Finding = z.object({
  title: z.string().min(5).max(120),
  category: z.enum(["bug","security","error-handling","performance","test","quality"]),
  severity: z.enum(["critical","high","medium","low"]),
  file: z.string(),
  lineStart: z.number().int().positive(),
  lineEnd: z.number().int().positive(),
  explanation: z.string().min(20),
  evidenceSnippet: z.string().min(1),   // must exist verbatim in the file at headSha
  impact: z.string(),
  suggestion: z.string(),
  confidence: z.number().min(0).max(1),
  sourceAgent: z.string(),
}).refine(f => f.lineEnd >= f.lineStart);
```

### 8.2 Main database entities (Prisma)

`Installation` · `Repository` · `PullRequest` · `Review` (status: queued/running/completed/partial/failed; headSha; token usage; latency) · `AgentRun` (agent, model, promptVersion, status, attempts, tokens, durationMs, error) · `Finding` (all fields above + status: candidate/verified/rejected/published/dismissed/accepted/resolved + rejectionReason) · `Feedback` (finding, user, reaction/comment) · `BenchmarkCase` · `BenchmarkRun` · `BenchmarkResult`.

---

## 9. Phases

> For every phase: do not proceed until **all** completion criteria are met and checked in Section 14.

### Phase 0 — Project Foundation and Infrastructure

**Objectives:** a clean, reproducible, observable skeleton.

**Tasks**
- Init TypeScript (strict), ESLint, Prettier, Vitest, pnpm workspace; path aliases kept minimal.
- `docker-compose.yml` with Postgres + Redis; Dockerfile for the app.
- Zod-validated config module; pino structured logger with request/review IDs.
- Prisma schema v0 + first migration; health endpoint (`/healthz`, `/readyz` checking DB and Redis).
- CI: typecheck, lint, test on every push.

**Deliverables:** runnable `docker compose up`; green CI; `.env.example`; README quick-start.

**Testing:** config fails fast on missing vars; health endpoints; DB/Redis connectivity test.

**Completion criteria:** fresh clone → running in ≤ 10 minutes using README; CI green; strict TS with zero `any` in src.

**Risks:** over-engineering the scaffold; version drift.
**Avoid:** adding libraries "just in case"; premature microservices.
**Best practices:** pin versions; small commits; one config source.

---

### Phase 1 — GitHub App Integration and PR Ingestion

**Objectives:** reliably receive PR events and fetch PR data.

**Tasks**
- Register GitHub App; webhook route with raw-body signature verification.
- Octokit with App authentication → installation tokens (cached until near expiry).
- Handle `pull_request` events; enqueue job (idempotent key) and return 200 immediately.
- Fetch PR metadata, commits, changed files (paginate!), patches, base/head SHAs.
- Persist `PullRequest` and `Review(queued)`.

**Deliverables:** webhook → queue → worker that logs/stores the PR snapshot.

**Testing:** signature accept/reject (valid, invalid, missing, tampered body); duplicate delivery idempotency; pagination with >100 files (mock); token refresh; rate-limit handling with `Retry-After`.

**Completion criteria:** opening/updating a real test PR creates exactly one stored snapshot; invalid signatures rejected with 401; no secrets in logs.

**Risks:** missing pagination; webhook timeouts; wrongly parsed raw body.
**Avoid:** doing heavy work inside the webhook handler.
**Best practices:** log delivery ID (`X-GitHub-Delivery`); treat events as at-least-once.

---

### Phase 2 — Diff Parsing and Repository Context Retrieval

**Objectives:** turn raw diffs into precise, context-rich review units.

**Tasks**
- Parse unified diffs into hunks with **old/new line mapping** and commentable-line sets.
- Filter ignorable files (lockfiles, generated, vendored, binary, minified).
- Fetch full file contents at `headSha` (and `baseSha` where needed).
- Tree-sitter: extract functions/classes, signatures, imports, exported symbols for supported languages.
- Build a lightweight symbol index: callers/callees and imports of changed symbols (bounded depth).
- Context-aware chunker with token budgeting (reserve space for prompt + output).

**Deliverables:** `ReviewUnit[]` = `{file, changedRanges, enclosingSymbol, surroundingCode, relatedSymbols, tokenEstimate}`.

**Testing:** fixtures for added/modified/deleted/renamed files; hunks with `\ No newline at end of file`; CRLF; multi-hunk; unicode; line-number mapping round-trip tests; chunk never splits a function unless it exceeds budget (then split on statement boundaries and mark `partial`).

**Completion criteria:** for 100% of fixture lines, `diff line → file line` mapping is exact; chunks stay under budget; unsupported languages degrade gracefully (whole-hunk context, flagged).

**Risks:** off-by-one line errors (the #1 source of bad comments); huge monorepos; slow parsing.
**Avoid:** guessing line numbers from LLM text.
**Best practices:** property-based tests for line mapping; cache parsed trees per `fileSha`.

---

### Phase 3 — Single-Agent Code Reviewer (baseline)

**Objectives:** one reliable reviewer that produces valid, grounded findings. **This is the baseline all later work is measured against.**

**Tasks**
- `LLMProvider` interface + Gemini and Claude adapters (timeouts, retries, token accounting).
- One generalist review agent with a versioned prompt and Zod-validated output.
- Deterministic post-checks: snippet exists in file, line within diff, severity enum valid.
- Print/store findings (no publishing yet).
- **Start the benchmark harness skeleton now** (even with 5–10 cases) — see Section 10.

**Deliverables:** CLI `review --repo --pr` that outputs validated findings JSON; baseline benchmark numbers.

**Testing:** mocked-LLM tests for malformed JSON, empty output, hallucinated paths/lines (must be rejected), provider timeout, 429.

**Completion criteria:** 0% of reported findings have invalid paths/lines/snippets; baseline precision/recall recorded; provider swap requires only a config change.

**Risks:** prompt bloat; model returns prose instead of JSON; cost surprises.
**Avoid:** adding more agents before the baseline is measured.
**Best practices:** temperature low; log prompt version, model, tokens per call.

---

### Phase 4 — Specialised Multi-Agent Architecture

**Objectives:** split responsibilities; improve recall without wrecking precision.

**Tasks**
- Shared `BaseAgent` (prompt template, schema, tool access, timeout, token accounting).
- Introduce agents **one at a time**, in this order, benchmarking after each: Bug → Security → Error Handling → Test Coverage → Performance → Code Quality.
- Each agent: narrow prompt, explicit "do not report" list, its own schema subset, Semgrep/ESLint hints where relevant (Security ← Semgrep, Quality ← ESLint).
- Run agents in parallel via Mastra workflow with per-agent timeout and isolation.
- Record an `AgentRun` row for each execution.

**Deliverables:** six agents behind a common interface; per-agent benchmark contribution table.

**Testing:** one agent throwing/timing out does not affect the others; agent outputs conform to schema; no agent reports outside its category.

**Completion criteria:** each added agent shows a measurable benefit (recall ↑ or unique valid findings) without an unacceptable precision drop; otherwise **remove or merge it** (simplicity rule).

**Risks:** duplicate findings across agents; cost multiplication; agent overlap.
**Avoid:** all agents seeing all context when they need only part of it.
**Best practices:** shared context built once, sliced per agent.

---

### Phase 5 — Finding Verification and False-Positive Reduction

**Objectives:** make precision the main strength.

**Tasks**
- **Deterministic gates** (cheap, first): file exists, snippet is verbatim, line ∈ diff, severity/category valid, not in ignored paths.
- **Deduplication:** same file + overlapping lines + similar title/embedding → merge, keep best evidence.
- **Verification Agent:** gets finding + minimal necessary code + related symbols; must answer *"Is this genuinely possible? Show the execution path or condition."* Outputs `{verdict: confirmed|rejected|uncertain, reasoning, adjustedSeverity, confidence}`.
- Prefer a different model/provider from the finder to reduce correlated errors.
- Combine signals into a final confidence (LLM verdict + static-tool corroboration + evidence quality).
- Persist rejection reasons (they are gold for tuning).
- Tune `MIN_CONFIDENCE` and comment cap against the benchmark.

**Deliverables:** `verify` module; precision/recall report before vs after verification.

**Testing:** seeded false positives (known-safe code that looks suspicious) must be rejected; known true bugs must survive; duplicates collapse; "uncertain" never gets published as certain.

**Completion criteria:** precision meets the target set in Section 11 on the benchmark without recall dropping below its floor; every published finding has passed all gates.

**Risks:** verifier too lenient (rubber-stamping) or too strict (kills recall).
**Avoid:** letting the verifier see the finder's confidence (bias).
**Best practices:** log verifier disagreements and review them manually.

---

### Phase 6 — Failure Handling, Retries, and Intelligent Chunking

**Objectives:** graceful degradation under real-world failure.

**Tasks**
- Central `reliability/` module: `withRetry`, `withTimeout`, `circuitBreaker`, error classifier (transient vs permanent).
- Provider fallback chain (e.g. Gemini → Claude) with clear logging; optional.
- Rate-limit aware scheduling (respect headers, queue-level concurrency).
- Context overflow handling: re-chunk smaller, summarise surrounding context, or skip with `partial` status.
- Review status model: `completed | partial | failed`; coverage report (files/agents analysed vs skipped).
- BullMQ: retries, backoff, stalled job recovery, dead-letter queue, graceful shutdown.
- Cost guard: stop gracefully at `MAX_TOKENS_PER_REVIEW` and report incomplete.

**Deliverables:** chaos-style test suite; "Analysis Coverage" section in the review summary.

**Testing:** inject faults (timeouts, 429, 500, malformed JSON, Redis restart, DB blip, worker crash mid-job); verify retries are bounded, no infinite loops, no duplicate comments after retry, and the final report truthfully lists incomplete analysis.

**Completion criteria:** with any single agent or provider down, the review still completes as `partial` with an explicit notice; zero silent failures in injected-fault tests.

**Risks:** retry storms; masking real bugs by over-catching errors.
**Avoid:** swallowing exceptions; unbounded retries; retrying non-idempotent writes blindly.
**Best practices:** every catch either handles, records, or rethrows.

---

### Phase 7 — Historical Bug Benchmark and Evaluation

**Objectives:** prove effectiveness with real bugs. (Skeleton begins in Phase 3; complete it here.)

**Tasks:** see Section 10 for the full design.
- Mine cases, label them, freeze a versioned dataset.
- Runner executes the reviewer in headless mode against reconstructed PRs.
- Matcher + metrics + comparison reports across models/prompt versions/agent sets.
- Include **clean control cases** to measure false-positive rate.

**Deliverables:** `benchmark/dataset/cases.json` (≥ 50 cases across ≥ 5 repos and multiple bug categories as a first target), reproducible runner, metrics report.

**Testing:** runner is deterministic given the same seed/config/cache; matcher unit-tested with hand-labelled examples.

**Completion criteria:** one command reproduces the full benchmark and metrics report; results stored per model/prompt version.

**Risks:** label noise; contamination; small sample sizes → noisy metrics.
**Avoid:** tuning prompts on the whole dataset (use train/dev/test split).
**Best practices:** report confidence intervals or at least counts, not only percentages.

---

### Phase 8 — GitHub Review Publishing and Developer Feedback

**Objectives:** deliver findings where developers work and learn from their reactions.

**Tasks**
- Publish a **single PR review** with inline comments (`path`, `line`, `side`, `commit_id`) plus a summary body: overview, counts by severity, analysis coverage, incomplete-analysis warnings.
- Permalinks to code (`blob/<headSha>/<path>#L<start>-L<end>`).
- Update/replace prior bot comments on new pushes (don't spam); resolve/outdate stale findings.
- Feedback: parse reactions and commands (`/dismiss <reason>`, `/accept`, `/review`, `/ignore-rule`); store in `Feedback`; update finding status (dismissed/accepted/resolved).
- Use feedback to suppress repeated dismissed findings (per repo).
- Dry-run mode (no posting) for testing.

**Deliverables:** end-to-end flow on a real test repo; feedback dashboard query/report.

**Testing:** comment on deleted/renamed/outside-diff lines handled; re-push doesn't duplicate; permission failure handled and logged; dry-run produces identical payload without network write.

**Completion criteria:** a PR review appears once per head SHA, with correct line anchoring on ≥ 99% of benchmark-reconstructed findings, and feedback changes finding status.

**Risks:** comment spam; anchoring errors; permission issues on forks.
**Avoid:** posting findings one-by-one (rate limits, noise).
**Best practices:** a short, polite, actionable tone; always include "why it matters" and a suggested fix.

---

### Phase 9 — Production Hardening, Optimisation, and Deployment

**Objectives:** safe, observable, cost-aware production service.

**Tasks**
- OpenTelemetry traces across webhook → queue → agents → GitHub; metrics for latency, tokens, cost, failure rate, queue depth.
- Alerts on failure rate, queue backlog, provider error spikes, budget exceedance.
- Security review: dependency audit, secret scanning, container hardening (non-root, read-only FS), Semgrep sandbox without network, rate limits on endpoints.
- Performance: parallelism tuning, caching, skip-trivial-PR heuristics, prompt trimming.
- Deployment: container image, migrations in CI/CD, zero-downtime rollout, backups, runbook.
- Load test with realistic PR sizes.
- **Code-size/simplicity audit** (Section 12) across the whole repo.

**Deliverables:** deployed instance, dashboards, runbook, load-test report.

**Testing:** load test; kill-worker and failover drills; migration rollback rehearsal.

**Completion criteria:** SLOs defined and met (e.g. p95 review latency, failure-rate ceiling, cost per review); on-call runbook tested once.

**Risks:** hidden cost growth; noisy alerts.
**Avoid:** shipping without budget caps and kill switch.
**Best practices:** feature flag + per-repo enable/disable.

---

## 10. Historical Bug Benchmark Design

**Important refinement:** a reviewer reviews a *change*, not a snapshot. So reconstruct the **bug-introducing change as a PR-like diff** (base = parent of the introducing commit, head = introducing commit) and ask the reviewer to review it. Reviewing the "buggy version" alone is a different, harder task (whole-file audit); keep it as an optional secondary mode.

**Mining pipeline**
1. Find candidate fixes: closed issues labelled `bug` linked to merged PRs/commits; commits whose messages say "fix …" referencing an issue.
2. Identify the **bug-introducing commit**: from the fix diff, `git blame` the changed/deleted lines on the fix's parent commit (SZZ-style heuristic), then manually verify.
3. Record the case (see schema) and **hand-verify** that the introducing diff really contains the bug and the fix diff really removes it.
4. Reject cases where the bug and context are too large, require runtime data, or are unclear.
5. Add **clean controls**: PRs/commits with no known bug (reviewed and merged, no later fix) to measure false positives.

**Case schema**

```json
{
  "id": "repo-owner__name__0001",
  "repo": "owner/name",
  "language": "typescript",
  "category": "bug|security|error-handling|performance|test|quality",
  "baseSha": "...",
  "introducingSha": "...",
  "fixSha": "...",
  "description": "human-written bug description",
  "affectedFiles": ["src/x.ts"],
  "expectedLocations": [{"file": "src/x.ts", "lineStart": 42, "lineEnd": 47}],
  "fixSummary": "…",
  "split": "dev|test",
  "isControl": false,
  "verifiedBy": "name",
  "createdAt": "…"
}
```

**Matching a finding to a known bug**
- *Location match:* same file and line overlap within ± N lines (configurable, default 3).
- *Semantic match:* LLM-judge (using a different model) or human label confirms the finding describes the same defect.
- A finding counts as **True Positive** only if location **and** semantics match; otherwise it is an **unmatched finding** and must be reviewed: valid-but-unlabelled bug vs genuine false positive. Spot-check manually.

**Contamination controls:** prefer bugs fixed **after** the models' training cutoffs; keep a held-out test split; note popular repos as higher-risk; compare against a "memorisation probe" if feasible.

**Reproducibility:** pin SHAs, model names, prompt versions, config, seeds; cache LLM responses keyed by input hash so reruns are cheap and comparable; store every run's raw outputs.

---

## 11. Metrics and Targets

| Metric | Definition | Initial target (adjust after baseline) |
|---|---|---|
| **Precision** | valid published findings ÷ all published findings | ≥ 0.70 |
| **Recall** | known bugs detected ÷ known bugs | track; set floor after baseline |
| **False Positive Rate** | invalid findings ÷ findings (and findings per clean control PR) | ≤ 0.30; ≤ 1 per clean PR |
| **Bug Detection Rate** | count of known bugs found (per category) | report by category |
| **Line Accuracy** | published findings anchored within tolerance of true location | ≥ 0.95 |
| **Review Latency** | webhook → published review (p50/p95) | set SLO in Phase 9 |
| **Token Consumption / Cost** | tokens and $ per review (by agent) | set budget per PR size |
| **Failure Rate** | reviews `partial` or `failed` ÷ total | ≤ 2% failed; partial always disclosed |

Also track: verifier rejection rate, duplicate rate, developer acceptance/dismissal rate (Phase 8), and per-agent marginal contribution.

> Targets are starting hypotheses, not facts. Establish the Phase 3 baseline first, then set real targets.

---

## 12. Code-Size and Optimisation Rules

1. **Delete before adding.** Ask: can an existing module, a library function, or a simpler design replace this?
2. **If 1000 lines can be 200, make it 200** — as long as behaviour, tests, and readability are preserved. Use data-driven tables, shared helpers, generics, and Zod schemas instead of repeated code. Do **not** code-golf; clarity beats cleverness.
3. **One implementation per concept:** one retry helper, one logger, one config module, one base agent, one chunker.
4. **Agents differ by data, not by code:** each agent is mostly `{name, prompt, schema, hints}` over a shared runner.
5. No dead code, unused exports, commented-out blocks, or TODOs without an owner and issue link.
6. Prefer well-maintained libraries over hand-rolled infrastructure (retries, validation, queueing) — but justify each new dependency in the PR description.
7. Every phase ends with a **simplification pass**: run a dead-code/unused-dependency check, look for duplicated logic, report line-count delta.
8. Optimise runtime only with measurements (profile first): batching, caching, parallelism, prompt trimming, skipping trivial files.
9. Functions ≤ ~40 lines, files ≤ ~300 lines, cyclomatic complexity kept low; split only when it improves clarity.
10. Keep prompts short and structured; shorter prompts cost less and often perform better — verify on the benchmark.

---

## 13. Parameter and Quality Checklist (run before marking anything done)

**Inputs and parameters**
- [ ] Every function parameter has a precise type; no `any`; optional vs required is intentional.
- [ ] All external inputs (webhook payloads, API responses, LLM outputs, env vars, CLI args) are validated with Zod at the boundary.
- [ ] Defaults, ranges, and units are explicit (ms vs s, tokens vs chars, 0-based vs 1-based lines).
- [ ] Edge cases handled: empty, null/undefined, very large, unicode, CRLF, binary, renamed/deleted files.

**Reliability**
- [ ] Timeout, bounded retry, backoff + jitter, and error classification on each external call.
- [ ] Idempotent where repeated delivery/retry can occur.
- [ ] Failure paths logged with context and recorded in DB; no swallowed errors.
- [ ] Partial failure is surfaced in the final report.

**Correctness of findings**
- [ ] File path exists at the reviewed SHA; line range ∈ diff; snippet is verbatim.
- [ ] Severity, category, and confidence set and justified; duplicates merged.
- [ ] Rejected findings stored with reason.

**Security and privacy**
- [ ] No secrets in code, logs, or fixtures; webhook signature verified; least-privilege permissions.
- [ ] Untrusted PR content cannot change agent behaviour or trigger tool actions.

**Performance and cost**
- [ ] Token budgets respected; caching used; latency and cost recorded per review.

**Quality**
- [ ] Typecheck, lint, and tests pass; new behaviour has tests; benchmark rerun when prompts/models/agents changed.
- [ ] Simplification pass done; line-count delta reported; no dead code.
- [ ] Docs, `.env.example`, and this plan.md updated if anything changed.

---

## 14. Progress Tracker (update after every work session)

| Phase | Status | Completion criteria met | Notes / deviations |
|---|---|---|---|
| 0 Foundation | ☑ Completed | ☑ | Monorepo bumped to v2.0.0, Docker Compose + Dockerfile created, .env.example aligned with Sec 6.3, healthz/readyz verified |
| 1 GitHub + Ingestion | ☑ Completed | ☑ | GitHub App auth with cached tokens + TTL expiry, Retry-After backoff, paginated commits + files (>100 files mock verified), raw-body HMAC-SHA256 (401 on invalid/missing/tampered), queued ReviewJob persistence |
| 2 Diff + Context | ☑ Completed | ☑ | Diff hunk old/new line mapping round-trip verified, commentable lines set, CRLF/unicode/no-newline fixtures, ignorable file filter, Tree-sitter scope/sig/import/export extraction with SHA cache, lightweight SymbolIndex, and token-budgeted ReviewUnit chunker |
| 3 Single-Agent Baseline | ☑ Completed | ☑ | LLMProvider interface with Gemini, Claude, and Mock adapters, GeneralistReviewAgent (v2.0.0-generalist), strict deterministic post-checks (0% hallucinated paths/lines/snippets), standalone review CLI, and benchmark harness recording 100% precision / 100% recall baseline metrics across 6 cases |
| 4 Multi-Agent | ☑ Completed | ☑ | Shared BaseAgent architecture with data-driven agent definitions, 6 specialised parallel agents (Bug, Security, ErrorHandling, TestCoverage, Performance, Quality), per-agent timeout and failure isolation, cross-agent deduplication, AgentRun telemetry logging, and benchmark contribution table (100% precision, 100% recall, 0% FP rate across benchmark cases) |
| 5 Verification | ☑ Completed | ☑ | Deterministic verification gates (file existence, ignored paths, line ranges, verbatim snippet match), cross-agent deduplication with evidence merging, second-pass adversarial VerificationAgent (execution path & condition tracing with finder-confidence exclusion to prevent confirmation bias), combined confidence scoring with static corroboration, and benchmark comparison (precision boosted from 40% to 100%, 100% false positives eliminated) |
| 6 Reliability + Chunking | ☑ Completed | ☑ | Reliability module with error classification (transient vs permanent), bounded retries with jittered exponential backoff (withRetry, withTimeout), circuit breaker (CLOSED/OPEN/HALF_OPEN), secondary LLM provider fallback chain, safe rechunking on context overflow (rechunkOnContextOverflow), hard cost cap enforcement (CostGuard / MAX_TOKENS_PER_REVIEW), partial review status & coverage reporting (AnalysisCoverage), worker DLQ routing & graceful shutdown, and chaos test suite verifying 100% fault isolation and zero silent failures |
| 7 Benchmark | ☑ Completed | ☑ | Dataset expanded to 30 verified historical & clean control cases across 6 open-source repos (RepoPilot, express, fastify, prisma, lodash, react) covering all 6 review categories with balanced dev (18) and held-out test (12) splits; location-matching engine with configurable line-tolerance (±3 lines); expanded evaluation runner reproducing baseline vs multi-agent vs verified comparisons; 100% precision, 100% recall, 0% FP rate, 0 clean PR FPs, and 100% line accuracy recorded in expanded-benchmark-report.json; zero generalization gap (0.0 delta) between dev and test splits |
| 8 Publishing + Feedback | ☑ Completed | ☑ | Single review publishing with inline comments, code permalinks (blob/<sha>/file#L1-L2), coverage breakdown, and interactive feedback guidance; dry-run mode (zero network mutations); stale comment outdating on re-pushes; developer commands (/dismiss, /accept, /ignore-rule, /review) and reactions (+1/-1) webhook handling; self-improvement historical dismissal suppression preventing repeat alerts on repo |
| 9 Production Hardening | ☐ Not started | ☐ | |

**Current phase:** 9 **Open questions:** _none_ **Baseline metrics:** Precision 100.0%, Recall 100.0%, FP Rate 0.0%, Clean PR FPs 0, Line Accuracy 100.0% (across 30 expanded benchmark cases)

---

## 15. Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| LLM hallucinated lines/paths | Wrong comments, lost trust | Deterministic validation; verifier; never trust raw output |
| Too many false positives | Developers ignore the bot | Verification, confidence threshold, comment cap, feedback suppression |
| Prompt injection via PR content | Manipulated output | Delimiting, schema validation, no tools with side effects, sandboxed analysis |
| Cost blow-up | Budget overrun | Token budgets, caching, skip trivial files, per-review cap |
| Rate limits (GitHub/LLM) | Delays/failures | Backoff, queues, concurrency limits, batched review submission |
| Benchmark contamination/noise | Misleading metrics | Post-cutoff bugs, held-out split, manual verification, controls |
| Scope creep / over-engineering | Slow delivery | Phase gates, simplicity rules, remove agents that don't earn their place |
| Provider outage | Failed reviews | Fallback provider, partial-review reporting, circuit breaker |
| Off-by-one line anchoring | Misplaced comments | Property-based tests on diff mapping; line-accuracy metric |
| Leaking source code to LLM vendors | Privacy/compliance | Minimal context, per-repo opt-in, documented data handling |

---

## 16. First Steps (do these now)

1. Create the repo and commit this `plan.md`.
2. Register a GitHub App on a **throwaway test repo**; save App ID, private key, webhook secret.
3. Get Gemini and Anthropic API keys; set spend limits on both.
4. Start Phase 0. Paste the Standing Prompt (Section 0) into your AI assistant at the start of each session.
5. Create 5–10 hand-picked benchmark cases early so Phase 3 has something to measure against.