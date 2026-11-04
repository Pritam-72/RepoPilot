# Version 2 Implementation Plan: Agentic Code Reviewer

> **For Claude / Agent:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.
> **Source of Truth:** Aligned with [`plan.md`](file:///c:/Users/PREETIMOHAN/Desktop/Agentic%20Code%20Reviewer/plan.md).

**Goal:** Upgrade the Agentic Code Reviewer to Version 2.0.0 by aligning the data contracts (`Finding`), establishing dual Gemini/Anthropic `LLMProvider` adapters, integrating Mastra workflow orchestration, deploying the full roster of 6 specialized review agents (Bug, Security, ErrorHandling, TestCoverage, Performance, CodeQuality) plus independent Verification Agent, adding central reliability circuit breakers, and expanding the historical bug benchmark system.

**Architecture:** Ports-and-adapters architecture with an `LLMProvider` abstraction layer powering isolated review agents executed via a Mastra workflow pipeline. Grounded in deterministic diff mapping and Tree-sitter AST symbol indexing, candidate findings pass through deterministic pre-gates and an independent second-pass Verification Agent before being batched into GitHub PR reviews and persisted to PostgreSQL.

**Tech Stack:** TypeScript (strict), Node.js LTS, Mastra Workflow Engine, Google Gemini API, Anthropic Claude API, Tree-sitter AST, Semgrep, BullMQ, Redis, PostgreSQL (Prisma ORM), Vitest, Next.js 14 Dashboard.

---

## Phase Breakdown Overview (Version 2)

| Phase | Title | Focus & Key Deliverable |
| :---: | :--- | :--- |
| **Phase 0** | **Version 2 Foundation & Version Bumps** | Version bumps to `2.0.0`, strict environment validation, health endpoints |
| **Phase 1** | **Data Contract Alignment (Section 8.1)** | Core `Finding` Zod schema (`bug`, `security`, `error-handling`, `performance`, `test`, `quality`), `evidenceSnippet`, `sourceAgent` |
| **Phase 2** | **Dual `LLMProvider` Abstraction (Section 4 & 6)** | `LLMProvider` interface with Gemini and Anthropic Claude adapters, token accounting, timeouts |
| **Phase 3** | **Tree-sitter Context & Syntactic Chunker (Section 9 Phase 2)** | Semantic symbol index (callers/callees/imports), diff line mapping, no mid-function cuts |
| **Phase 4** | **Mastra Workflow & 6 Specialized Review Agents (Section 9 Phase 4)** | Bug, Security, ErrorHandling, TestCoverage, Performance, CodeQuality agents parallelized |
| **Phase 5** | **Verification Engine & False-Positive Reduction (Section 9 Phase 5)** | Deterministic gates (verbatim substring, diff lines), independent Verifier Agent with alternate model |
| **Phase 6** | **Central Reliability & Circuit Breaker (Section 9 Phase 6)** | `withRetry`, `withTimeout`, `circuitBreaker`, `MAX_TOKENS_PER_REVIEW` cost guard, partial reviews |
| **Phase 7** | **Historical Bug Benchmark Expansion (Section 10 & Phase 7)** | `benchmark/` harness, SZZ miner skeleton, `cases.json` golden dataset, LLM-judge matcher |
| **Phase 8** | **GitHub Review Publishing & Command Handling (Section 9 Phase 8)** | Batched PR review, permalinks, comment commands (`/dismiss`, `/accept`, `/review`, `/ignore-rule`) |
| **Phase 9** | **Production Hardening & Simplicity Pass (Section 12)** | OpenTelemetry tracing, alerts, container security, code-size audit, Section 14 tracker update |

---

## Phased Implementation Tasks

### Phase 0: Version 2 Foundation & Version Bumps

#### Task 0.1: Version Bump to 2.0.0 Across All Packages
- **Files to Modify:**
  - `package.json` (root): version `2.0.0`
  - `apps/api/package.json`: version `2.0.0`
  - `apps/web/package.json`: version `2.0.0`
  - `apps/worker/package.json`: version `2.0.0`
  - `packages/*/package.json`: version `2.0.0`
- **Step 1:** Update all `version` fields to `"2.0.0"`.
- **Step 2:** Run `pnpm install` and verify workspaces resolve cleanly.
- **Step 3:** Commit: `git commit -am "chore: bump monorepo packages to version 2.0.0"`

#### Task 0.2: Align `.env.example` with `plan.md` Section 6.3
- **Files to Modify:**
  - `.env.example`
  - `apps/api/src/config/env.ts`
- **Step 1:** Add `GOOGLE_GENERATIVE_AI_API_KEY`, `ANTHROPIC_API_KEY`, `LLM_DEFAULT_PROVIDER`, `LLM_REVIEW_MODEL`, `LLM_VERIFY_MODEL`, `MAX_TOKENS_PER_REVIEW`, `MAX_COMMENTS_PER_PR`.
- **Step 2:** Verify env validation throws clear errors on missing required keys.
- **Step 3:** Commit: `git commit -am "chore(config): align environment schema with plan.md Section 6.3"`

---

### Phase 1: Data Contract Alignment (`Finding` Schema)

#### Task 1.1: Align Core `Finding` Schema with `plan.md` Section 8.1
- **Files to Modify:**
  - `packages/review-contracts/src/finding.schema.ts`
  - `packages/review-contracts/src/index.ts`
  - `packages/review-contracts/src/__tests__/contracts.test.ts`
- **Step 1:** Define exact `plan.md` Section 8.1 schema:
  ```ts
  export const FindingCategorySchema = z.enum([
    "bug",
    "security",
    "error-handling",
    "performance",
    "test",
    "quality"
  ]);

  export const FindingSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(5).max(120),
    category: FindingCategorySchema,
    severity: z.enum(["critical", "high", "medium", "low"]),
    file: z.string().min(1),
    lineStart: z.number().int().positive(),
    lineEnd: z.number().int().positive(),
    explanation: z.string().min(20),
    evidenceSnippet: z.string().min(1),
    impact: z.string().default("Potential runtime defect or violation"),
    suggestion: z.string().default("Review and remediate highlighted lines"),
    confidence: z.number().min(0).max(1),
    sourceAgent: z.string().default("system"),
    verificationStatus: z.enum(["candidate", "verified", "rejected", "published", "dismissed"]).default("candidate"),
  }).refine((f) => f.lineEnd >= f.lineStart, {
    message: "lineEnd must be greater than or equal to lineStart",
  });
  ```
- **Step 2:** Maintain backward-compatibility getters (`line`, `endLine`, `evidence`, `recommendation`) so existing components function seamlessly.
- **Step 3:** Run `pnpm --filter @acr/review-contracts test` and verify 100% pass.
- **Step 4:** Commit: `git commit -am "feat(contracts): align Finding schema with plan.md Section 8.1"`

---

### Phase 2: Dual `LLMProvider` Abstraction (Gemini & Anthropic)

#### Task 2.1: Define `LLMProvider` Port & Adapter Interfaces
- **Files to Create:**
  - `packages/agents/src/llm/provider.interface.ts`
  - `packages/agents/src/llm/gemini-adapter.ts`
  - `packages/agents/src/llm/anthropic-adapter.ts`
  - `packages/agents/src/llm/index.ts`
  - `packages/agents/src/__tests__/llm-provider.test.ts`
- **Step 1: Write failing test in `llm-provider.test.ts`:**
  - Verify Gemini adapter implements `generateStructuredOutput` with token usage and timeout.
  - Verify Anthropic adapter implements `generateStructuredOutput` with token usage and timeout.
  - Verify factory routes based on `LLM_DEFAULT_PROVIDER`.
- **Step 2:** Implement `LLMProvider` interface:
  ```ts
  export interface LLMGenerateOptions {
    model?: string;
    temperature?: number;
    timeoutMs?: number;
    maxRetries?: number;
  }

  export interface LLMResponse<T> {
    data: T;
    inputTokens: number;
    outputTokens: number;
    durationMs: number;
    model: string;
  }

  export interface LLMProvider {
    generateStructuredOutput<T>(
      prompt: string,
      schema: z.ZodType<T>,
      systemPrompt?: string,
      options?: LLMGenerateOptions
    ): Promise<LLMResponse<T>>;
  }
  ```
- **Step 3:** Implement Gemini and Anthropic Claude adapters using official SDKs with bounded retries and exponential backoff.
- **Step 4:** Run tests and verify PASS.
- **Step 5:** Commit: `git commit -am "feat(agents): implement dual LLMProvider layer with Gemini and Anthropic adapters"`

---

### Phase 3: Tree-sitter Context & Syntactic Chunker

#### Task 3.1: Tree-sitter Symbol Indexing and Call Graph
- **Files to Create/Modify:**
  - `packages/repository-context/src/tree-sitter-analyzer.ts`
  - `packages/repository-context/src/chunker.ts`
  - `packages/repository-context/src/__tests__/tree-sitter.test.ts`
- **Step 1: Write failing test:**
  - Test function/class boundary detection on TypeScript/JavaScript code.
  - Test that chunker never splits mid-function unless function exceeds token budget.
  - Test extraction of caller/callee references and imports.
- **Step 2:** Implement Tree-sitter / AST symbol graph indexing and syntactic chunking with token reservation for prompt + output.
- **Step 3:** Run `pnpm --filter @acr/repository-context test` and verify PASS.
- **Step 4:** Commit: `git commit -am "feat(context): add AST symbol indexing and syntactic chunker without mid-function cuts"`

---

### Phase 4: Mastra Workflow & 6 Specialized Review Agents

#### Task 4.1: Implement the 6 Specialized Review Agents
- **Files to Create/Modify:**
  - `packages/agents/src/agents/bug-agent.ts` (Agent 1: Logic errors, bounds, null dereferences)
  - `packages/agents/src/agents/security-agent.ts` (Agent 2: OWASP Top 10, CWE-89, injection, secrets)
  - `packages/agents/src/agents/error-handling-agent.ts` (Agent 3: Unhandled rejections, swallowed errors)
  - `packages/agents/src/agents/test-coverage-agent.ts` (Agent 4: Untested branches, missing edge cases)
  - `packages/agents/src/agents/performance-agent.ts` (Agent 5: N+1 queries, memory leaks, algorithmic complexity)
  - `packages/agents/src/agents/code-quality-agent.ts` (Agent 6: Maintainability, cognitive complexity)
  - `packages/agents/src/agents/base-agent.ts`
  - `packages/agents/src/__tests__/six-agents.test.ts`
- **Step 1:** Implement `BaseAgent` with standard prompt templates, delimiters for untrusted code, and strict schema validation.
- **Step 2:** Implement each specialized agent with explicit "do not report" guidance and Semgrep hints.
- **Step 3:** Write comprehensive Vitest suite verifying per-agent isolation and categories.
- **Step 4:** Commit: `git commit -am "feat(agents): implement full roster of 6 specialized review agents per plan.md"`

#### Task 4.2: Mastra Workflow Review Pipeline
- **Files to Create/Modify:**
  - `packages/agents/src/pipeline/mastra-pipeline.ts`
  - `packages/agents/src/pipeline/index.ts`
  - `apps/worker/src/processors/review-job.processor.ts`
- **Step 1:** Integrate Mastra workflow engine to execute the 6 agents concurrently with individual timeouts.
- **Step 2:** Handle partial agent failures gracefully without terminating the entire review.
- **Step 3:** Commit: `git commit -am "feat(pipeline): wire 6-agent review pipeline with Mastra workflow engine"`

---

### Phase 5: Verification Engine & False-Positive Reduction

#### Task 5.1: Two-Pass Verification Agent & Deterministic Gates
- **Files to Create/Modify:**
  - `packages/agents/src/verification-engine.ts`
  - `packages/agents/src/__tests__/verification-engine.test.ts`
- **Step 1: Write failing test:**
  - Test deterministic gates: file exists at headSha, snippet is verbatim substring, line in diff.
  - Test Verification Agent verdict (`confirmed`, `rejected`, `uncertain`) with different model.
  - Test persistence of rejection reasons.
- **Step 2:** Implement verification gates:
  1. Verbatim snippet check in headSha file content.
  2. Changed line set validation.
  3. Deduplication of overlapping line findings across agents.
  4. Second-pass LLM Verification Agent answering *"Is this genuinely possible? Show execution path"*.
- **Step 3:** Run tests and verify PASS.
- **Step 4:** Commit: `git commit -am "feat(verify): implement two-pass verification engine with verbatim and diff gates"`

---

### Phase 6: Central Reliability Module & Circuit Breakers

#### Task 6.1: Reliability Infrastructure
- **Files to Create:**
  - `packages/observability/src/reliability/retry.ts`
  - `packages/observability/src/reliability/circuit-breaker.ts`
  - `packages/observability/src/reliability/token-guard.ts`
  - `packages/observability/src/reliability/index.ts`
  - `packages/observability/src/__tests__/reliability.test.ts`
- **Step 1:** Implement `withRetry` with exponential backoff and jitter for transient 429/5xx errors.
- **Step 2:** Implement `circuitBreaker` per provider with failure rate thresholds.
- **Step 3:** Implement `TokenBudgetGuard` enforcing `MAX_TOKENS_PER_REVIEW` and marking reviews `partial`.
- **Step 4:** Commit: `git commit -am "feat(reliability): add retry backoff, circuit breaker, and token budget guards"`

---

### Phase 7: Historical Bug Benchmark Expansion

#### Task 7.1: Expand Benchmark Dataset & SZZ Miner Skeleton
- **Files to Create/Modify:**
  - `benchmark/dataset/cases.json`
  - `benchmark/miner/git-blame-miner.ts`
  - `benchmark/runner/benchmark-runner.ts`
  - `benchmark/report/metrics-calculator.ts`
  - `tests/evaluation/run-benchmark.ts`
- **Step 1:** Define `BenchmarkCase` schema matching `plan.md` Section 10:
  `{ id, repo, language, category, baseSha, introducingSha, fixSha, description, affectedFiles, expectedLocations, isControl }`.
- **Step 2:** Populate initial 15+ verified ground-truth cases including clean controls.
- **Step 3:** Implement location (±3 lines) and semantic LLM-judge matcher.
- **Step 4:** Compute Precision, Recall, FPR, Bug Detection Rate, and Line Accuracy metrics.
- **Step 5:** Commit: `git commit -am "feat(benchmark): scaffold benchmark harness with clean controls and metrics calculator"`

---

### Phase 8: GitHub Review Publishing & Feedback Commands

#### Task 8.1: Batched Review Comments & PR Commands
- **Files to Modify:**
  - `packages/github/src/publisher.ts`
  - `apps/api/src/routes/webhooks.ts`
  - `packages/github/src/__tests__/publisher.test.ts`
- **Step 1:** Update publisher to submit a single batched GitHub review with summary table, severity counts, and code permalinks (`blob/<headSha>/<path>#L<start>-L<end>`).
- **Step 2:** Implement command listener in webhook handler for PR comments:
  - `/dismiss <reason>` &rarr; records feedback, updates finding status to `dismissed`.
  - `/accept` &rarr; marks finding `accepted`.
  - `/review` &rarr; triggers manual re-review job.
- **Step 3:** Test command parsing and PostgreSQL feedback mutation.
- **Step 4:** Commit: `git commit -am "feat(github): implement batched review publishing with permalinks and PR comment commands"`

---

### Phase 9: Production Hardening, Audit & Plan Alignment

#### Task 9.1: Code-Size & Simplicity Audit (Section 12)
- **Files to Modify:**
  - `plan.md` (Section 14 Progress Tracker)
  - `project-roadmap.md`
- **Step 1:** Run monorepo dead-code check, remove unused dependencies and redundant files.
- **Step 2:** Verify all functions <= 40 lines and cyclomatic complexity is low.
- **Step 3:** Update `plan.md` Section 14 Progress Tracker checking off completed Phase criteria.
- **Step 4:** Verify all 17/17 package test suites pass with 0 errors.
- **Step 5:** Commit and push to `origin/main` and `origin/master`.

---

## Verification & Execution Protocol

1. Before starting each phase: verify the current phase completion criteria in `plan.md`.
2. Strictly follow the Red-Green-Refactor TDD cycle.
3. Keep `pnpm test` passing at 100% at every single commit.
4. Report line count deltas on significant simplifications per Section 12.

