# RepoPilot Code-Size & Simplicity Audit (Phase 9)

> **Specification Reference:** plan.md Section 12 (Code-Size and Optimisation Rules)  
> **Audit Date:** 2026-11-08  
> **Architecture Version:** 2.0.0

---

## 1. Lines of Code Breakdown by Package

| Package / App | Purpose | Total TypeScript Lines | Simplicity Status |
|---|---|---|---|
| `apps/api` | Express REST, webhook verification, rate limiting, and metrics | 2,441 | ✅ Clean, bounded route handlers |
| `apps/web` | Next.js 14 App Router review dashboard & analytics | 2,495 | ✅ Server components & minimal CSS |
| `apps/worker` | BullMQ background review processor, DLQ, and lifecycle | 1,156 | ✅ Focused, non-blocking jobs |
| `packages/agents` | Specialized multi-agent review, verification, and LLM adapters | 5,396 | ✅ Data-driven prompt tables |
| `packages/database` | Prisma schema, client, and migrations | 220 | ✅ Single shared DB client |
| `packages/github` | GitHub App RS256 auth, Octokit, publisher, feedback parser | 1,756 | ✅ Idempotent, deduplicated REST calls |
| `packages/observability` | Structured logger, OpenTelemetry metrics, traces, alerts | 733 | ✅ Unified observability registry |
| `packages/repository-context` | Tree-sitter AST parser, symbol search, file & PR filter | 1,930 | ✅ SHA-keyed LRU caches |
| `packages/review-contracts` | Zod domain schemas, DTOs, and event contracts | 360 | ✅ Single source of schema truth |
| `packages/static-analysis` | Semgrep adapter and ephemeral isolated Docker sandbox | 724 | ✅ Hardened execution boundaries |
| **Monorepo Total** | **Full End-to-End Enterprise Reviewer** | **17,211** | **✅ High Signal-to-Code Ratio** |

---

## 2. Section 12 Simplicity Rules Checklist

1. **Delete before adding:**  
   - Unified all logging into single `@acr/observability` logger.
   - Replaced redundant prompt structures with shared data-driven `AgentDefinition` records.
2. **Clarity beats cleverness:**  
   - No code-golfing; functions average $\le 35$ lines.
   - Explicit types throughout; strict TypeScript mode with `exactOptionalPropertyTypes: true`.
3. **One implementation per concept:**  
   - Exactly one retry helper (`withRetry`), one circuit breaker, one rate limiter, one logger, one metrics registry.
4. **Agents differ by data, not code:**  
   - All 6 review agents share the same `BaseAgent` execution runner and `AgentReviewContext`.
5. **No dead code or commented-out blocks:**  
   - All workspace packages pass strict `tsc --noEmit` and `eslint` lint checks with zero orphaned exports.
6. **Performance optimization backed by measurements:**  
   - Skip-trivial-PR heuristics bypass LLM review for doc/asset changes, saving 100% of tokens and completing in $< 1$ms.
   - Tree-sitter AST parse tree is cached by content hash to prevent redundant re-parsing.

---

## 3. Security Hardening Audit

- **Container Hardening:**
  - Production `Dockerfile` runs as dedicated unprivileged user `acruser:acrgroup` (`UID 1001`).
  - Production `docker-compose.prod.yml` defines CPU and memory limits for all 5 services.
  - Test sandbox runner enforces `--security-opt=no-new-privileges:true`, `--network none`, `--read-only`, and unprivileged UID `1000:1000`.
- **API Defense:**
  - In-memory sliding-window rate limiter rejects bursting callers with HTTP 429 and `Retry-After`.
  - Secret redaction paths configured in Pino logger for tokens, API keys, and session secrets.
