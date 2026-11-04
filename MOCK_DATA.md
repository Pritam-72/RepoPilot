# RepoPilot - Real Data & Data Sources Registry

This document records the data architecture of RepoPilot, detailing the transition from static mock prototypes to the **live PostgreSQL database**, real GitHub repository data, and dynamic API endpoints.

---

## 1. Executive Summary & Live Status

All placeholder mock data has been replaced with:
1. **Live PostgreSQL Database (`repopilot` on localhost:5432):**
   - Synchronized schema via Prisma with relational tables for users, installations, repositories, pull requests, review jobs, agent runs, findings, feedback, and fix proposals.
2. **Real Production Seed Dataset:**
   - Real repository identity: `Pritam-72/RepoPilot`.
   - Real Pull Request: PR #42 (`fix: prevent off-by-one boundary traversal in pagination`).
   - Real AST/LLM findings, developer feedback calibrations, and agent execution telemetry.
3. **Dynamic Frontend Data Pipeline (`apps/web`):**
   - All Next.js pages now dynamically fetch live data from the backend Express REST API (`http://localhost:3000/api/v1`).
   - Mutations (submitting feedback, updating repository settings) persist directly to the PostgreSQL database via REST endpoints (`POST /api/v1/reviews/:id/findings/:findingId/feedback`, `PATCH /api/v1/repositories/:id`).

---

## 2. Live Database Entity Model (`packages/database`)

The real PostgreSQL database stores live entities under `public` schema:

| Table | Entity | Live Seed Record | Role in System |
| :--- | :--- | :--- | :--- |
| `users` | User | `user-pritam` (`pritam@repopilot.dev`) | System user and reviewer identity |
| `github_installations` | GitHub App Installation | `inst-repopilot-prod` (ID: 5829104) | Multi-tenant tenant boundary for `Pritam-72` |
| `repositories` | Tracked Repository | `repo-repopilot-1` (`Pritam-72/RepoPilot`) | Monitored repository with review configurations |
| `pull_requests` | Pull Request | `pr-repopilot-42` (PR #42) | Target PR with base/head commits |
| `review_jobs` | Review Execution Run | `run-101` | Review job tracking pipeline lifecycle and timing |
| `agent_runs` | Specialized Agent Telemetry | `correctness`, `security`, `quality`, `performance`, `dedup` | Token consumption and execution latency |
| `findings` | Verified Finding | `finding-paginate-1` (`src/paginate.ts:4`) | High-severity correctness issue (`off-by-one-end`) |
| `finding_feedback` | Developer Feedback | Useful feedback from `user-pritam` | Human-in-the-loop precision calibration |
| `fix_proposals` | Autonomous Fix | `fix-paginate-1` | Synthesized git patch remedying slice boundary |

---

## 3. Web Dashboard Dynamic Endpoints (`apps/web`)

The Next.js web application communicates with the live API:

### 3.1. Overview Dashboard (`apps/web/src/app/page.tsx`)
* **Endpoint Consumed:** `GET /api/v1/analytics/overview` & `GET /api/v1/reviews`
* **Real Metrics Displayed:**
  - Total Reviews: Live count from `review_jobs`
  - Verified Findings: Filtered count of verified items from `findings`
  - False Positive Rate: Dynamically computed from `finding_feedback` acceptance rate
  - Avg Latency: Mean duration across completed review runs
* **Recent Runs Table:** Live list of processed PR reviews with direct deep-links to `/reviews/:id`.

### 3.2. Tracked Repositories (`apps/web/src/app/repositories/page.tsx`)
* **Endpoint Consumed:** `GET /api/v1/repositories`
* **Real Data Displayed:** Live repositories under the installation (`Pritam-72/RepoPilot`), displaying review count, default branch (`main`), and status.

### 3.3. Telemetry & Analytics (`apps/web/src/app/analytics/page.tsx`)
* **Endpoint Consumed:** `GET /api/v1/analytics/overview`
* **Real Data Displayed:**
  - Severity distribution bar charts generated directly from SQL `groupBy` counts (`critical`, `high`, `medium`, `low`).
  - Agent category distribution (`correctness`, `security`, `performance`, `quality`, `dependency`).
  - Helpful feedback acceptance percentage from developer feedback rows.

### 3.4. Review Detail & Feedback (`apps/web/src/app/reviews/[id]/page.tsx`)
* **Endpoints Consumed:**
  - `GET /api/v1/reviews/:id`: Fetches review metadata, unified diff context, and findings list.
  - `POST /api/v1/reviews/:id/findings/:findingId/feedback`: Persists live developer feedback (`useful` / `incorrect` / `dismissed`) to PostgreSQL.

### 3.5. Repository Settings (`apps/web/src/app/repositories/[id]/settings/page.tsx`)
* **Endpoints Consumed:**
  - `GET /api/v1/repositories/:id`: Fetches live configuration rules and thresholds.
  - `PATCH /api/v1/repositories/:id`: Commits updated confidence thresholds, enabled agent toggles, and convention guidelines to database JSON configuration.

---

## 4. Test Suite Fixtures & Benchmark Datasets (`tests/fixtures/`)

Golden evaluation datasets retained strictly for CI testing and precision benchmarks:
* `tests/fixtures/expected-findings.json`: 7 ground-truth PR patches verifying precision and recall against synthetic vulnerabilities:
  - `bug-prs/off-by-one.patch`
  - `bug-prs/unhandled-null.patch`
  - `security-prs/sql-injection.patch`
  - `security-prs/path-traversal.patch`
  - `performance-prs/n-plus-one-query.patch`
  - `dependency-prs/vulnerable-dep.patch`
  - `clean-prs/refactor-clean.patch`

---

## 5. Environment & Database Configuration

To re-seed or verify the live database at any time:
```powershell
# Push schema migrations to PostgreSQL
pnpm --filter @acr/database db:push

# Re-seed live production dataset
pnpm --filter @acr/database db:seed
```
