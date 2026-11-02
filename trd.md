# Technical Requirements Document (TRD)

## Agentic Code Reviewer

**Version:** 1.0\
**Date:** November 2, 2026\
**Status:** Proposed\
**Related document:** PRD.md

------------------------------------------------------------------------

## 1. Technical Overview

### 1.1 Purpose

This document defines the proposed architecture, services, data model,
APIs, agent contracts, security controls, infrastructure, and
implementation requirements for Agentic Code Reviewer.

### 1.2 Architectural principles

-   TypeScript-first application and shared contracts.
-   Event-driven, asynchronous review processing.
-   Explicit orchestration and state transitions.
-   Parallel execution only for independent tasks.
-   Deterministic tools complement LLM reasoning.
-   Evidence-backed findings and strict output validation.
-   Least-privilege integrations.
-   Untrusted code is never executed in the API process.
-   Human approval is required for code publication or remediation
    actions.

### 1.3 Proposed stack

  -----------------------------------------------------------------------
  Layer                               Technology
  ----------------------------------- -----------------------------------
  Language                            TypeScript

  Runtime                             Node.js

  API                                 Express.js

  Agent framework                     Mastra

  Validation                          Zod

  LLM providers                       Gemini, Claude, or OpenAI through
                                      provider adapters

  GitHub integration                  GitHub Apps, Octokit

  Database                            PostgreSQL

  ORM                                 Prisma

  Vector search                       pgvector, optional for MVP

  Queue                               Redis + BullMQ

  Code parsing                        Tree-sitter

  Static analysis                     Semgrep, ESLint, Ruff

  Testing                             Vitest; language-specific test
                                      runners

  Sandbox                             Docker with hardened runtime
                                      controls

  Frontend                            Next.js, TypeScript

  UI                                  Tailwind CSS, shadcn/ui

  Code diff viewer                    Monaco Editor or a suitable diff
                                      component

  Charts                              Recharts

  Deployment                          Docker Compose initially; managed
                                      containers or VMs later

  Observability                       Structured logs, metrics, tracing
  -----------------------------------------------------------------------

Package names and framework APIs must be checked against current vendor
documentation and pinned to compatible versions during implementation.

------------------------------------------------------------------------

## 2. High-Level Architecture

``` mermaid
flowchart TD
    GH[GitHub Pull Request] --> WH[Webhook API]
    WH --> VAL[Signature Validation]
    VAL --> Q[Review Job Queue]
    Q --> W[Review Worker]
    W --> META[GitHub Metadata and Diff Service]
    META --> CTX[Repository Context Builder]
    CTX --> ORCH[Mastra Orchestrator]
    ORCH --> BUG[Bug Agent]
    ORCH --> SEC[Security Agent]
    ORCH --> QUAL[Quality and Test Agent]
    BUG --> AGG[Finding Aggregator]
    SEC --> AGG
    QUAL --> AGG
    AGG --> VER[Verification Service]
    VER --> PUB[GitHub Publisher]
    PUB --> GH
    W --> DB[(PostgreSQL)]
    VER --> DB
    W --> OBS[Logs and Metrics]
    UI[Next.js Dashboard] --> API[REST API]
    API --> DB
    API --> Q
```

### 2.1 Main components

1.  Web application and API.
2.  GitHub App integration.
3.  Webhook receiver.
4.  Background review workers.
5.  Review orchestrator.
6.  Specialized agents.
7.  Repository context builder.
8.  Static-analysis tool adapters.
9.  Finding verification and aggregation.
10. GitHub review publisher.
11. Persistence and job queue.
12. Optional sandbox and fix service.
13. Dashboard and observability.

------------------------------------------------------------------------

## 3. Service Responsibilities

### 3.1 API service

Responsibilities: - User authentication and session management. -
Repository configuration endpoints. - Review history and finding
endpoints. - Feedback submission. - Job creation and status retrieval. -
Authorization checks for every repository resource.

The API service must not run long model operations synchronously.

### 3.2 Webhook service

Responsibilities: - Receive GitHub webhook deliveries. - Verify
`X-Hub-Signature-256` using the raw request body and configured webhook
secret. - Validate event type and repository installation. - Record
delivery identifiers for idempotency. - Enqueue supported pull-request
events. - Return a successful acknowledgement quickly after durable
acceptance.

### 3.3 GitHub integration service

Responsibilities: - Create installation-scoped Octokit clients. - Fetch
PR metadata and head/base SHAs. - Fetch changed files and paginated diff
information. - Retrieve source content at the exact reviewed commit. -
Publish review summaries, inline comments, and check runs. - Handle API
rate limits and transient failures.

All source retrieval must be pinned to the PR head SHA to avoid mixing
repository revisions.

### 3.4 Review worker

Responsibilities: - Claim queued review jobs. - Load PR and repository
configuration. - Retrieve code and context. - Run the orchestration
workflow. - Persist agent outputs and findings. - Publish accepted
results. - Update job status and metrics.

### 3.5 Repository context builder

Responsibilities: - Normalize file paths and diff hunks. - Detect file
language and file type. - Retrieve changed source and bounded
surrounding code. - Parse supported languages with Tree-sitter. -
Retrieve related definitions, callers, imports, tests, and
configuration. - Enforce token, byte, file-count, and time budgets. -
Return source references with commit SHA and line ranges.

MVP retrieval can use GitHub source APIs, Git diff, AST parsing, and
targeted text search. Add embeddings and pgvector when repository-scale
semantic retrieval is justified.

### 3.6 Orchestrator

Responsibilities: - Build a review plan from PR metadata and context. -
Select applicable agents. - Run independent agents in parallel with
concurrency limits. - Pass each agent only the context required for its
task. - Validate outputs. - Handle bounded retries and timeouts. - Send
results to verification and aggregation.

The workflow should be represented as explicit state, not only as an
unconstrained agent conversation.

### 3.7 Static-analysis adapters

Provide a common adapter interface for tools such as Semgrep, ESLint,
Ruff, and Trivy.

Each adapter should return normalized results containing: - Tool name
and version. - Rule identifier. - Severity. - File path and source
location. - Message and evidence. - Execution status. - Tool-specific
metadata.

Static-analysis tools should run against a pinned source snapshot. Tools
that execute repository-controlled configuration or plugins must run in
an isolated environment.

### 3.8 Verification service

Responsibilities: - Validate file path and line against the reviewed
revision. - Check whether a location is part of the diff when inline
publication requires it. - Confirm evidence snippets against source. -
Correlate agent findings with deterministic tool results. - Deduplicate
semantically overlapping findings. - Apply confidence and publication
thresholds. - Record acceptance or rejection reasons.

Verification should not convert an unsupported claim into a verified
issue merely because another LLM agrees with it.

### 3.9 GitHub publisher

Responsibilities: - Build a concise review summary. - Map findings to
valid GitHub diff positions. - Publish inline comments only when GitHub
accepts the location. - Publish remaining findings in the summary when
no valid inline location exists. - Track GitHub review/comment
identifiers. - Avoid duplicate publication on retry.

### 3.10 Fix service (post-MVP)

Responsibilities: - Create a disposable worktree or source snapshot. -
Apply a generated patch in an isolated sandbox. - Run approved test and
analysis commands. - Capture patch, logs, exit codes, and resource
usage. - Return a patch for human review. - Create a branch or commit
only after explicit approval.

------------------------------------------------------------------------

## 4. Review Workflow and State Machine

### 4.1 Event flow

1.  Receive webhook.
2.  Verify signature.
3.  Validate event and installation.
4.  Persist delivery record.
5.  Enqueue review job.
6.  Fetch PR metadata and exact head SHA.
7.  Retrieve changed files and diff.
8.  Build repository context.
9.  Create review plan.
10. Execute selected agents and static-analysis tools.
11. Validate agent output schemas.
12. Verify and deduplicate findings.
13. Persist final findings.
14. Publish review to GitHub.
15. Mark job completed and expose results.

### 4.2 Job states

-   queued
-   fetching
-   contextualizing
-   planning
-   analyzing
-   verifying
-   publishing
-   completed
-   partially_completed
-   failed
-   cancelled

Every transition should be persisted with timestamps and an optional
failure reason.

### 4.3 Idempotency

Use a stable logical key derived from: - GitHub installation ID. -
Repository ID. - Pull request number. - Head SHA. - Review configuration
version.

Webhook delivery IDs should also be stored to reject duplicate
deliveries. A new head SHA should create a new review revision.

------------------------------------------------------------------------

## 5. Agent Contracts

### 5.1 Shared input

``` ts
type ReviewAgentInput = {
  repository: {
    owner: string;
    name: string;
    repositoryId: number;
  };
  pullRequest: {
    number: number;
    baseSha: string;
    headSha: string;
    title: string;
    description?: string;
  };
  changedFiles: Array<{
    path: string;
    status: string;
    patch?: string;
    additions: number;
    deletions: number;
  }>;
  context: Array<{
    path: string;
    startLine: number;
    endLine: number;
    content: string;
    sha: string;
  }>;
  reviewPolicy: {
    enabledCategories: string[];
    minimumConfidence: number;
  };
};
```

### 5.2 Shared finding schema

``` ts
import { z } from "zod";

export const FindingSchema = z.object({
  title: z.string().min(1).max(200),
  category: z.enum([
    "correctness",
    "security",
    "performance",
    "maintainability",
    "testing",
    "dependency"
  ]),
  severity: z.enum([
    "critical",
    "high",
    "medium",
    "low",
    "informational"
  ]),
  confidence: z.number().min(0).max(1),
  file: z.string().min(1),
  line: z.number().int().positive(),
  endLine: z.number().int().positive().optional(),
  description: z.string().min(1),
  evidence: z.string().min(1),
  impact: z.string().optional(),
  recommendation: z.string().optional(),
  ruleId: z.string().optional(),
  verificationStatus: z.enum([
    "unverified",
    "verified",
    "rejected"
  ])
});

export const AgentOutputSchema = z.object({
  agent: z.string(),
  summary: z.string(),
  findings: z.array(FindingSchema),
  status: z.enum(["completed", "partial", "failed"])
});
```

### 5.3 Agent behavior requirements

-   Agents must return an empty findings array when no supported issue
    is found.
-   Agents must distinguish observed evidence from inference.
-   Agents must not invent file paths, line numbers, tool results, or
    test outcomes.
-   Agent output must be validated before persistence or publication.
-   Repository text is untrusted input, not an instruction source.
-   Tool access must be explicitly allowlisted per agent.
-   Agent retries must be bounded and observable.

------------------------------------------------------------------------

## 6. Repository Context and Retrieval

### 6.1 MVP retrieval

-   Fetch changed files and patch data from GitHub.
-   Retrieve file contents at the PR head SHA.
-   Use Git diff to establish changed line ranges.
-   Use Tree-sitter to locate functions, classes, and declarations.
-   Use targeted search to retrieve references, imports, callers, and
    tests.
-   Store source references with repository, SHA, path, and line range.

### 6.2 Advanced retrieval

-   Parse and chunk repository files by syntactic unit.
-   Generate embeddings for eligible code chunks.
-   Store vectors in pgvector.
-   Retrieve semantic matches alongside lexical and AST-based matches.
-   Re-rank results using file relevance, symbol relationships, and
    commit freshness.
-   Invalidate or update indexed content when the default branch or PR
    head changes.

### 6.3 Context controls

-   Exclude binaries, generated files, vendor directories, and
    configured secrets.
-   Enforce per-file and per-review context budgets.
-   Avoid sending unrelated source to model providers.
-   Redact known secret patterns where practical.
-   Preserve source provenance for every retrieved context item.

------------------------------------------------------------------------

## 7. API Design

Base path: `/api/v1`

### 7.1 Authentication

  Method   Endpoint                  Purpose
  -------- ------------------------- ----------------------
  GET      `/auth/github`            Start GitHub sign-in
  GET      `/auth/github/callback`   Complete sign-in
  POST     `/auth/logout`            End session
  GET      `/auth/me`                Current user

### 7.2 GitHub integration

  Method   Endpoint                       Purpose
  -------- ------------------------------ -------------------------------
  POST     `/webhooks/github`             Receive GitHub events
  GET      `/github/installations`        List accessible installations
  GET      `/repositories`                List connected repositories
  PATCH    `/repositories/:id/settings`   Update review settings

### 7.3 Reviews

  ---------------------------------------------------------------------------------------------------
  Method                  Endpoint                                            Purpose
  ----------------------- --------------------------------------------------- -----------------------
  POST                    `/repositories/:id/pull-requests/:number/reviews`   Request manual review

  GET                     `/reviews/:id`                                      Get review status and
                                                                              summary

  GET                     `/reviews/:id/findings`                             List review findings

  GET                     `/repositories/:id/reviews`                         List repository reviews

  POST                    `/findings/:id/feedback`                            Submit finding feedback

  POST                    `/findings/:id/fix-proposals`                       Request a fix proposal
                                                                              (post-MVP)

  GET                     `/fix-proposals/:id`                                Get fix proposal and
                                                                              validation
  ---------------------------------------------------------------------------------------------------

### 7.4 API requirements

-   Validate all request and response payloads.
-   Enforce user-to-installation and user-to-repository authorization.
-   Apply rate limits to user-facing endpoints.
-   Use pagination for list endpoints.
-   Return stable error codes and correlation IDs.
-   Never expose installation tokens, secrets, or internal prompts.

------------------------------------------------------------------------

## 8. Database Design

Use PostgreSQL with Prisma. Use JSONB for provider-specific metadata and
structured agent output where appropriate; keep frequently queried
fields relational.

### 8.1 Core tables

#### users

-   id
-   email
-   display_name
-   created_at
-   updated_at

#### github_installations

-   id
-   github_installation_id (unique)
-   account_login
-   account_type
-   encrypted_credentials_reference
-   created_at

#### repositories

-   id
-   github_repository_id (unique)
-   installation_id
-   owner
-   name
-   default_branch
-   is_enabled
-   review_config (JSONB)
-   created_at
-   updated_at

#### pull_requests

-   id
-   repository_id
-   github_pr_number
-   title
-   author
-   base_sha
-   head_sha
-   state
-   updated_at

#### webhook_deliveries

-   id
-   github_delivery_id (unique)
-   event_type
-   repository_id
-   received_at
-   processing_status

#### review_jobs

-   id
-   repository_id
-   pull_request_id
-   head_sha
-   idempotency_key (unique)
-   status
-   config_version
-   started_at
-   completed_at
-   error_code
-   error_message

#### agent_runs

-   id
-   review_job_id
-   agent_type
-   status
-   model_provider
-   model_name
-   input_tokens
-   output_tokens
-   duration_ms
-   output_json (JSONB)
-   error_message
-   created_at

#### findings

-   id
-   review_job_id
-   agent_run_id
-   fingerprint
-   title
-   category
-   severity
-   confidence
-   file_path
-   line
-   end_line
-   description
-   evidence
-   recommendation
-   verification_status
-   publication_status
-   github_comment_id
-   created_at

#### finding_feedback

-   id
-   finding_id
-   user_id
-   feedback_type
-   comment
-   created_at

#### fix_proposals (post-MVP)

-   id
-   finding_id
-   patch
-   sandbox_status
-   test_results (JSONB)
-   approval_status
-   created_at

### 8.2 Database constraints and indexes

-   Unique GitHub installation and repository IDs.
-   Unique webhook delivery ID.
-   Unique review idempotency key.
-   Index review jobs by repository, PR, head SHA, status, and creation
    time.
-   Index findings by review job, severity, category, and fingerprint.
-   Enforce foreign keys and appropriate deletion policies.
-   Store timestamps in UTC.
-   Never store plaintext GitHub installation tokens or model API keys
    in ordinary application tables.

------------------------------------------------------------------------

## 9. GitHub App Requirements

### 9.1 Events

Subscribe only to required events: - `pull_request`: opened, reopened,
synchronize, and any additional explicitly supported actions. -
`installation`: created, deleted, and repository selection changes where
needed.

### 9.2 Permissions

Start with the minimum permissions needed: - Metadata: read. - Contents:
read. - Pull requests: read and write only if publishing review comments
through the selected API requires it. - Checks: write only if publishing
check runs. - Additional permissions must be justified by a feature.

Confirm the exact permission requirements against the GitHub API
endpoints used before deployment.

### 9.3 Publication behavior

-   Publish one review summary per completed review revision where
    practical.
-   Publish inline comments only for valid diff positions.
-   Group non-inline findings in the summary.
-   Record GitHub response IDs.
-   Use idempotent publication logic to prevent duplicate comments.
-   Do not approve or merge pull requests automatically.

------------------------------------------------------------------------

## 10. Queue and Worker Design

### 10.1 Queue

Use BullMQ backed by Redis.

Suggested queues: - `github-events` - `pull-request-reviews` -
`static-analysis` - `fix-validation` (post-MVP)

### 10.2 Worker controls

-   Configurable concurrency.
-   Bounded retry attempts.
-   Exponential backoff with jitter.
-   Job timeout and stalled-job recovery.
-   Dead-letter handling or a failed-job review process.
-   Per-repository and per-installation concurrency limits.
-   Queue metrics and operational dashboards.

### 10.3 Job payload

Queue payloads should contain stable IDs and references, not large
source snapshots or secrets.

Example:

``` ts
type ReviewJobPayload = {
  reviewJobId: string;
  repositoryId: string;
  installationId: string;
  pullRequestNumber: number;
  headSha: string;
  deliveryId: string;
};
```

Workers should reload authorized data from persistence and GitHub.

------------------------------------------------------------------------

## 11. Sandbox and Fix-Agent Security

This section is mandatory before enabling repository test execution or
generated patch validation.

### 11.1 Isolation

-   Use disposable containers or stronger isolation such as microVMs for
    higher-risk workloads.
-   Never mount the host Docker socket into an untrusted workload.
-   Run as a non-root user.
-   Use read-only base filesystems where possible.
-   Use ephemeral workspaces.
-   Disable outbound network access by default.
-   Allow only explicitly approved dependencies or controlled mirrors
    when network access is necessary.
-   Apply CPU, memory, PID, disk, and wall-clock limits.
-   Drop unnecessary Linux capabilities and apply seccomp/AppArmor or
    equivalent controls.
-   Destroy the environment after execution.

### 11.2 Patch validation

1.  Retrieve exact reviewed source revision.
2.  Create an isolated workspace.
3.  Apply patch and validate patch boundaries.
4.  Run approved test and lint commands.
5.  Capture exit codes and logs.
6.  Check whether the original finding is addressed.
7.  Return patch and test evidence for human approval.

Never treat a passing test suite as proof that a security issue is
fixed. Require targeted validation where possible.

------------------------------------------------------------------------

## 12. Security Requirements

-   Store secrets in a managed secret store or encrypted environment
    configuration.
-   Use HTTPS for all external endpoints.
-   Verify GitHub webhook signatures using raw request bytes.
-   Use installation-scoped short-lived GitHub tokens.
-   Encrypt sensitive data at rest and in transit.
-   Apply tenant and repository authorization checks to every data
    access.
-   Protect against SSRF, path traversal, command injection, and unsafe
    archive extraction.
-   Do not interpolate untrusted strings into shell commands.
-   Use fixed executable paths and argument arrays for tool invocation.
-   Treat prompts, comments, source files, README files, and test output
    as untrusted data.
-   Explicitly separate system policy from repository content.
-   Apply model and tool-call budgets.
-   Redact secrets from logs and model context.
-   Maintain audit events for installation, publication, and fix
    approval.

------------------------------------------------------------------------

## 13. Observability and Cost Management

### 13.1 Logs

Include: - request ID - webhook delivery ID - review job ID - repository
ID - PR number and head SHA - agent type - tool name - duration -
outcome and error category

Do not log tokens, credentials, or unrestricted source code.

### 13.2 Metrics

-   webhook acceptance and rejection count.
-   queue wait time.
-   review duration by stage.
-   agent success and failure rate.
-   LLM input/output token usage.
-   estimated cost per review.
-   static-analysis duration and failures.
-   accepted/rejected finding count.
-   duplicate and invalid-location finding count.
-   GitHub publication failures.

### 13.3 Cost controls

-   Select agents dynamically.
-   Use smaller models for classification and formatting tasks.
-   Reserve stronger models for complex reasoning and verification.
-   Limit context size and output tokens.
-   Cache safe, revision-specific retrieval results.
-   Avoid re-reviewing unchanged content when correctness permits.
-   Set per-repository and per-installation budgets.

------------------------------------------------------------------------

## 14. Testing Strategy

### 14.1 Unit tests

-   Webhook signature validation.
-   Diff parsing and line mapping.
-   Zod schema validation.
-   Finding fingerprinting and deduplication.
-   Permission and authorization logic.
-   Review state transitions.

### 14.2 Integration tests

-   GitHub API adapter with mocked responses.
-   PostgreSQL persistence.
-   Redis/BullMQ job lifecycle.
-   Static-analysis adapters.
-   GitHub comment publication and retry behavior.

### 14.3 Agent evaluation

Build a versioned benchmark of pull requests with: - Known defects. -
Known security vulnerabilities. - Valid no-issue changes. - Cross-file
issues. - Edge cases and adversarial repository instructions.

Measure precision, recall, false-positive rate, localization accuracy,
and cost. Have human reviewers adjudicate benchmark labels.

### 14.4 End-to-end tests

-   Install/connect a test GitHub repository.
-   Open a test PR.
-   Confirm webhook processing.
-   Confirm review completion.
-   Verify GitHub comments and dashboard status.
-   Push another commit and confirm a new revision is reviewed.
-   Simulate provider, queue, and GitHub API failures.

### 14.5 Sandbox tests

-   Attempt network access.
-   Attempt filesystem escape.
-   Attempt resource exhaustion.
-   Attempt process spawning.
-   Attempt access to host credentials.
-   Confirm container cleanup after success, failure, and timeout.

------------------------------------------------------------------------

## 15. Deployment Architecture

### 15.1 Local development

Use Docker Compose for: - API service. - Worker service. - PostgreSQL. -
Redis. - Frontend.

LLM providers and GitHub are accessed through development credentials
stored outside source control.

### 15.2 Initial production

Deploy separate API and worker processes on managed containers or VMs.
Use managed PostgreSQL and Redis where possible. Store secrets in a
secret manager. Terminate TLS at a managed ingress or reverse proxy.

### 15.3 Scaling

-   Scale API independently from workers.
-   Scale review workers based on queue depth and provider limits.
-   Add per-tenant concurrency controls.
-   Add pgvector only when semantic repository retrieval is implemented.
-   Consider stronger sandbox isolation before allowing arbitrary
    repository execution at scale.

------------------------------------------------------------------------

## 16. Suggested Repository Structure

``` text
agentic-code-reviewer/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── routes/
│   │       ├── middleware/
│   │       └── webhooks/
│   ├── worker/
│   │   └── src/
│   │       ├── jobs/
│   │       └── processors/
│   └── web/
│       └── src/
├── packages/
│   ├── agents/
│   │   └── src/
│   │       ├── orchestrator/
│   │       ├── bug-review/
│   │       ├── security-review/
│   │       ├── quality-review/
│   │       └── verification/
│   ├── github/
│   ├── repository-context/
│   ├── static-analysis/
│   ├── review-contracts/
│   ├── database/
│   └── observability/
├── prisma/
├── docker/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── evaluation/
│   └── e2e/
├── docker-compose.yml
├── package.json
└── README.md
```

This is a suggested modular monolith/monorepo structure. Do not split
every package into a network microservice until deployment or scaling
requirements justify it.

------------------------------------------------------------------------

## 17. Environment Configuration

Example `.env.example`:

``` dotenv
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://user:password@localhost:5432/code_reviewer
REDIS_URL=redis://localhost:6379

GITHUB_APP_ID=
GITHUB_PRIVATE_KEY=
GITHUB_WEBHOOK_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

LLM_PROVIDER=google
GOOGLE_GENERATIVE_AI_API_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

SESSION_SECRET=
ENCRYPTION_KEY=

LOG_LEVEL=info
MAX_REVIEW_FILES=50
MAX_DIFF_BYTES=1000000
MAX_AGENT_CONCURRENCY=4
REVIEW_JOB_TIMEOUT_MS=300000
```

This is illustrative. Use only the provider credentials selected for the
deployment. Validate required configuration at startup and never commit
real `.env` files.

------------------------------------------------------------------------

## 18. Implementation Order

### Milestone 1 --- Foundation

-   Initialize TypeScript monorepo.
-   Set up Express API.
-   Configure PostgreSQL and Prisma.
-   Configure Redis and BullMQ.
-   Add Zod contracts and logging.

### Milestone 2 --- GitHub integration

-   Create GitHub App.
-   Implement OAuth/sign-in if required.
-   Implement webhook verification.
-   Fetch PR metadata, diffs, and source at head SHA.
-   Add idempotent event processing.

### Milestone 3 --- Single-agent review

-   Build repository context service.
-   Integrate one LLM provider.
-   Implement one review agent.
-   Validate findings with Zod.
-   Publish a test review to a sandbox repository.

### Milestone 4 --- Multi-agent workflow

-   Add orchestrator.
-   Add bug, security, and quality/test agents.
-   Add parallel execution and bounded retries.
-   Persist agent runs.

### Milestone 5 --- Verification and publication

-   Add static-analysis adapters.
-   Implement evidence and diff-location verification.
-   Add deduplication and severity ranking.
-   Publish review summaries and inline comments.

### Milestone 6 --- Dashboard and pilot

-   Build repository and review dashboard.
-   Add feedback controls.
-   Add metrics and operational alerts.
-   Run benchmark and pilot evaluations.

### Milestone 7 --- Remediation

-   Build hardened sandbox.
-   Implement Fix Agent.
-   Generate and validate patches.
-   Require explicit approval for branch or commit creation.

------------------------------------------------------------------------

## 19. Technical Acceptance Criteria

The initial production pilot must demonstrate: 1. Webhook signatures are
verified correctly. 2. Duplicate deliveries do not create duplicate
logical reviews. 3. Every review is tied to an immutable PR head SHA. 4.
Agent inputs and outputs follow typed contracts. 5. Agent failures do
not silently appear as successful reviews. 6. Findings cite real source
evidence and valid locations. 7. GitHub comments are not duplicated by
retries. 8. Repository authorization is enforced in all API operations.
9. Untrusted code is not executed in the API or worker process. 10.
Review jobs are observable and recoverable. 11. Secrets and credentials
are not exposed in logs or browser responses. 12. The system never
merges a PR or publishes an unapproved fix.

------------------------------------------------------------------------

## 20. Technical Decisions to Confirm

Before implementation, confirm: - Initial language support:
TypeScript/JavaScript and Python are suggested. - Default LLM provider
and fallback policy. - GitHub App permissions and comment/check
publication strategy. - Whether the first release needs login and a
dashboard or can begin as a GitHub-only integration. - Review limits for
changed files, diff size, and context. - Data retention and source-code
privacy requirements. - Whether semantic indexing is needed for the
pilot or can wait. - Sandbox isolation technology before enabling test
execution. - Deployment provider and expected repository/PR volume.
