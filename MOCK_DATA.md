# RepoPilot - Mock Data Registry

This document catalogs all mock data, test fixtures, deterministic fallback datasets, and UI sample states implemented across the RepoPilot monorepo.

---

## 1. Executive Summary

Mock data in RepoPilot serves three primary purposes:
1. **Frontend Standalone UX:** Allows the Next.js Web Dashboard (`apps/web`) to render full interactive dashboards, charts, repositories, and review inspections without requiring a pre-seeded production database or live GitHub connectivity.
2. **Deterministic Offline Fallbacks:** Provides graceful degradation when external cloud APIs (e.g., Google Gemini LLM API, Docker daemon, or GitHub Octokit) are unconfigured or unavailable.
3. **Rigorous Automated Testing & Evaluation:** Delivers golden datasets, security vulnerability patches, and static analysis outputs to verify precision, recall, and false-positive rates during CI and benchmark runs.

---

## 2. Web Dashboard Mock Datasets (`apps/web`)

### 2.1. Dashboard Overview Metrics (`apps/web/src/app/page.tsx`)
Rendered on the main landing dashboard `http://localhost:3001/` under `sampleMetrics`:

| Metric Name | Value | Trend / Badge | Context |
| :--- | :---: | :--- | :--- |
| **Total Reviews** | `142` | `+12% this week` | Aggregate volume across tracked repos |
| **Verified Findings** | `89` | `92% precision rate` | Findings that passed multi-agent verification |
| **False Positive Rate** | `7.8%` | `Within <15% target` | Precision goal compliance |
| **Avg Review Latency** | `24.3s` | `-3.2s optimization` | Time from webhook trigger to posted review |

### 2.2. Recent Review Runs (`apps/web/src/app/page.tsx`)
Sample historical review activities under `sampleRecentRuns`:

| Run ID | Repository | PR # | Title | Status | Findings | Duration |
| :--- | :--- | :---: | :--- | :---: | :---: | :---: |
| `run-101` | `Pritam-72/RepoPilot` | #42 | `fix: prevent off-by-one boundary traversal in pagination` | `completed` | 1 | 14.2s |
| `run-102` | `acme-corp/ecommerce-api` | #88 | `feat: add user account balance reconciliation endpoints` | `completed` | 2 (1 critical) | 22.1s |
| `run-103` | `infra-team/auth-service` | #15 | `refactor: simplify token validation logic` | `completed` | 0 | 9.8s |

### 2.3. Tracked Repositories Catalog (`apps/web/src/app/repositories/page.tsx`)
Displayed on `http://localhost:3001/repositories` under `sampleRepositories`:

| Repository ID | Full Name | Default Branch | Review Count | Last Review Status | Last Active |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `repo-1` | `Pritam-72/RepoPilot` | `main` | 42 | `completed` | 10 minutes ago |
| `repo-2` | `acme-corp/ecommerce-api` | `master` | 128 | `completed` | 1 hour ago |
| `repo-3` | `infra-team/auth-service` | `main` | 65 | `analyzing` | In progress |
| `repo-4` | `analytics/data-pipeline` | `main` | 19 | `completed` | Yesterday |

### 2.4. Telemetry & Quality Analytics (`apps/web/src/app/analytics/page.tsx`)
Rendered on `http://localhost:3001/analytics` under `DEFAULT_ANALYTICS`:

* **Review Pipeline Volume:**
  - Total Reviews: `128` (Completed: `125`, Failed: `3`, Success Rate: `97.7%`)
  - Mean Duration: `3.8s`
* **Findings Classification (Total: 312, Verified: 298, Verification Rate: 95.5%):**
  - **By Severity:** Critical: `18` \| High: `64` \| Medium: `142` \| Low: `76` \| Informational: `12`
  - **By Category:** Correctness: `110` \| Security: `82` \| Performance: `48` \| Quality: `42` \| Dependency: `30`
* **User Feedback & Sentiment:**
  - Useful: `94` \| Incorrect (False Positive): `4` \| Dismissed: `8` \| Acceptance Rate: `88.7%`

### 2.5. Review Inspection & Diff Viewer (`apps/web/src/app/reviews/[id]/page.tsx`)
Detailed single-PR inspection view under `sampleReviewData`:

* **Target PR:** `Pritam-72/RepoPilot` - PR #42 (`a1b2c3d4e5f67890` &rarr; `0987654321fedcba`)
* **Mock Diff Content:**
  ```diff
  diff --git a/src/paginate.ts b/src/paginate.ts
  index e69de29..b493214 100644
  --- a/src/paginate.ts
  +++ b/src/paginate.ts
  @@ -1,5 +1,5 @@
   export function getPage(items: string[], page: number, pageSize: number): string[] {
     const start = (page - 1) * pageSize;
  -  const end = start + pageSize;
  +  const end = start + pageSize + 1;
     return items.slice(start, end);
   }
  ```
* **Attached Finding:**
  - **ID:** `f-1`
  - **Category / Severity:** `correctness` / `high` (Confidence: `0.95`, Status: `verified`)
  - **Rule ID:** `off-by-one-end`
  - **Description:** *"Adding 1 to the end index causes getPage to return pageSize + 1 elements, violating pagination contracts and leaking into adjacent pages."*
  - **Evidence:** `const end = start + pageSize + 1;`
  - **Recommendation:** `const end = start + pageSize;`

### 2.6. Repository Settings Conventions (`apps/web/src/app/repositories/[id]/settings/page.tsx`)
Default repository rules and team agreements:
1. *"Always return early to minimize indentation"*
2. *"Never commit API keys or development credentials"*
3. *"Require parameterized queries for raw SQL access"*

---

## 3. Evaluation Benchmark Fixtures (`tests/fixtures/`)

Standardized ground-truth patches used by `tests/evaluation/run-benchmark.ts` to compute Precision, Recall, and F1 Score against `expected-findings.json`:

| Fixture Path | Vulnerability / Bug Class | Expected Category | Expected Severity | Target File & Line | Expected Rule ID |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `bug-prs/off-by-one.patch` | Off-by-one boundary calculation | `correctness` | `high` | `src/paginate.ts:4` | `off-by-one-end` |
| `bug-prs/unhandled-null.patch` | Unchecked nullable object dereference | `correctness` | `medium` | `src/user.ts:2` | N/A |
| `security-prs/sql-injection.patch` | String concatenation in SQL query | `security` | `critical` | `src/db.ts:2` | `sql-injection` |
| `security-prs/path-traversal.patch` | Unsanitized file path construction | `security` | `high` | `src/files.ts:3` | `path-traversal` |
| `performance-prs/n-plus-one-query.patch` | Loop-nested individual database queries | `performance` | `high` | `src/users.ts:4` | `n-plus-one-query` |
| `dependency-prs/vulnerable-dep.patch` | Outdated pinned vulnerable package | `dependency` | `critical` | `package.json:5` | `vulnerable-dependency-pin` |
| `clean-prs/refactor-clean.patch` | Clean, non-defective code refactor | *None* | *None* | `src/helpers.ts` | *(Ground-truth 0 findings)* |

---

## 4. Deterministic Offline & In-Memory Fallbacks

### 4.1. Test Generation Agent Fallback (`packages/agents/src/test-gen-agent.ts`)
When no Google Gemini API key is configured or network calls return HTTP 403, the system falls back to generating deterministic regression test suites:
* **Vitest / JavaScript Fallback:**
  ```typescript
  import { describe, it, expect } from "vitest";

  describe("${finding.category} regression test", () => {
    it("verifies expected boundary behavior at line ${finding.line}", () => {
      // Target: ${finding.description}
      expect(true).toBe(true);
    });
  });
  ```
* **Pytest / Python Fallback:**
  ```python
  import pytest

  def test_${finding.category}_regression():
      # Regression test for line ${finding.line} (${finding.description})
      assert True
  ```

### 4.2. In-Memory Proposal Storage (`apps/api/src/routes/test-proposals.ts`)
* `testProposalStore`: A Node `Map<string, TestProposal>` that caches test proposals generated during local runs without requiring persistent DB mutations.

### 4.3. Process Isolation Sandbox (`packages/static-analysis/src/sandbox.ts`)
* In environments lacking a running Docker daemon (e.g., standard Windows workstation), the sandbox falls back to localized directory isolation (`local process isolation mode`) with strict timeout protections.

---

## 5. Test Doubles & Tool Adapter Mocks

### 5.1. Semgrep Static Analysis Mock (`packages/static-analysis/src/__tests__/semgrep.test.ts`)
Simulated Semgrep AST scanning response:
```json
{
  "results": [
    {
      "check_id": "javascript.lang.security.audit.sqli.node-sqli",
      "path": "src/db.ts",
      "start": { "line": 2, "col": 10 },
      "end": { "line": 2, "col": 65 },
      "extra": {
        "message": "Detected string concatenation in SQL query which may lead to SQL injection",
        "severity": "ERROR",
        "metadata": {
          "cwe": ["CWE-89"],
          "category": "security",
          "confidence": "HIGH"
        },
        "lines": "return db.query(`SELECT * FROM users WHERE name = '${username}'`);"
      }
    },
    {
      "check_id": "generic.maintainability.todo",
      "path": "src/utils.ts",
      "start": { "line": 50, "col": 1 },
      "end": { "line": 50, "col": 20 },
      "extra": {
        "message": "Found TODO comment",
        "severity": "INFO",
        "metadata": { "category": "maintainability" },
        "lines": "// TODO: refactor this later"
      }
    }
  ]
}
```

### 5.2. GitHub Octokit API Mocks (`packages/github/src/__tests__/`)
* **Pull Request Details:** Simulates GitHub PR API `pulls.get` responses with base SHA `0987654321fedcba` and head SHA `a1b2c3d4e5f67890`.
* **Inline Comment Publisher:** Simulates GitHub PR review submissions via `pulls.createReview` and verifies that duplicate comments are not re-posted.
* **Secret Redaction Fixtures:** Test strings containing fake GitHub PAT tokens (`ghp_...`), AWS keys (`AKIA...`), and OpenAI API keys (`sk-...`) to ensure automatic redaction before repository context is passed to LLM agents.

---

## 6. How to Switch Between Mock and Live Data

* **Live Database:** Run `pnpm --filter @acr/database db:push` against a real PostgreSQL connection string (`DATABASE_URL`).
* **Live GitHub Integration:** Set `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, and `GITHUB_WEBHOOK_SECRET` in `.env`.
* **Live LLM Execution:** Set `GEMINI_API_KEY` (or custom provider credentials) in `.env`.
