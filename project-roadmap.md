# Project Execution Roadmap

## Agentic Code Reviewer

**Version:** 1.0\
**Date:** November 2, 2026\
**Purpose:** A practical, phase-by-phase implementation plan that turns
the PRD and TRD into a deliverable project.

------------------------------------------------------------------------

## 1. Project North Star

Build a GitHub-integrated code reviewer that can:

1.  Detect a pull request and retrieve its exact changes.
2.  Understand enough repository context to review those changes.
3.  Delegate review work to specialized agents.
4.  combine LLM analysis with deterministic code-analysis tools.
5.  Verify findings and suppress unsupported or duplicate comments.
6.  Publish useful findings to the pull request.
7.  Show review progress and results in a dashboard.
8.  Later, propose and test fixes in an isolated environment with human
    approval.

**The project is successful when a developer can install the GitHub App
on a test repository, open a pull request containing a known issue, and
receive a correct, evidence-backed review comment without manual
intervention.**

Do not measure success by the number of agents. Measure it by review
correctness, useful findings, low false-positive rates, reliability, and
safe operation.

------------------------------------------------------------------------

## 2. Scope and Working Assumptions

### MVP scope

The first usable release should include: - GitHub App installation for
selected repositories. - Webhook verification and reliable event
processing. - PR metadata, changed files, diffs, and source retrieval. -
A bounded repository-context builder. - An orchestrator and three
agents: - Bug and logic review. - Security review. - Code quality and
test-gap review. - At least one deterministic static-analysis
integration. - Finding verification, deduplication, and
prioritization. - GitHub review summary and valid inline comments. -
Review history and a basic dashboard. - Logs, failure handling, and a
repeatable evaluation set.

### Defer until after MVP

-   Autonomous branch creation and commits.
-   Automatic PR approval or merging.
-   Large-scale repository indexing.
-   Kubernetes and microservice decomposition.
-   Fine-tuning or training a model.
-   Many specialized agents with overlapping responsibilities.
-   Organization-wide analytics and complex billing.
-   Support for every programming language.

### Suggested initial language scope

Start with **TypeScript/JavaScript and Python**, provided the selected
static-analysis tools and test fixtures cover both. If time is limited,
choose one language first and add the second after the complete review
flow works.

### Suggested team assumption

This plan is suitable for one developer or a small team. Timings are
indicative; complete each phase by its exit criteria rather than rushing
to meet a calendar date.

------------------------------------------------------------------------

## 3. Phase Overview

  -----------------------------------------------------------------------
  Phase             Goal              Main deliverable  Exit condition
  ----------------- ----------------- ----------------- -----------------
  0                 Define and        Scope,            Scope and risks
                    prepare           architecture,     agreed
                                      test repository   

  1                 Build the         Running API, DB,  Services work
                    foundation        queue, CI         locally

  2                 Connect GitHub    Verified webhook  PR event creates
                                      and PR retrieval  a review job

  3                 Build a reliable  One agent reviews Useful finding
                    single-agent      a PR              reaches a test
                    reviewer                            output

  4                 Add repository    Context builder   Findings cite
                    context and tools and static        real code
                                      analysis          evidence

  5                 Add multi-agent   Three agents and  Agents run and
                    orchestration     orchestrator      aggregate
                                                        reliably

  6                 Verify and        Verified findings End-to-end PR
                    publish reviews   on GitHub         review works

  7                 Build dashboard   Review UI,        Pilot acceptance
                    and harden MVP    observability,    criteria pass
                                      evaluation        

  8                 Add safe          Fix proposals and Approved patch
                    remediation       isolated          passes checks
                                      validation        

  9                 Improve and scale Better retrieval, Measured quality
                    policies,         and capacity
                    analytics         gains

  10                Production CI/CD  CI workflow,      Automated gates
                    and documentation docs, blueprints  and guides complete

  11                Organization      Analytics API,    Live metrics and
                    Analytics & UI    Quality Dashboard settings UI
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 4. Detailed Phase Plan

## Phase 0 --- Product Definition and Development Setup

**Goal:** Remove ambiguity before writing substantial code.

### Tasks

-   [x] Read PRD.md and TRD.md.
-   [x] Decide the first supported language.
-   [x] Select the initial LLM provider and one fallback strategy, if
    needed.
-   [x] Create a GitHub App in a development account.
-   [x] Create a dedicated test repository with sample pull requests.
-   [x] Define the minimum GitHub permissions.
-   [x] Decide whether MVP comments are automatically published or first
    shown in a preview.
-   [x] Define maximum file count, diff size, context size, and
    model-call budgets.
-   [x] Create a small benchmark containing known bugs, security issues,
    and clean changes.
-   [x] Create architecture diagrams and initial issue tracker.

### Check before moving on

-   Can you explain the full webhook-to-review flow?
-   Is every MVP feature tied to a user outcome?
-   Do you have test PRs with known expected findings?
-   Are GitHub permissions no broader than necessary?
-   Is the first language and model provider decided?

### Avoid

-   Starting with a large agent team.
-   Supporting many languages immediately.
-   Building a polished dashboard before a working review flow.
-   Adding vector search without a demonstrated retrieval need.
-   Treating an LLM response as proof that a finding is correct.

### Encourage

-   Small, testable milestones.
-   Written acceptance criteria.
-   A benchmark from the first week.
-   Decisions recorded in the repository.
-   Early testing against real GitHub pull requests.

### Definition of done

A short implementation plan, test repository, sample PR fixtures, chosen
stack, GitHub App setup plan, and measurable MVP acceptance criteria
exist.

------------------------------------------------------------------------

## Phase 1 --- Repository and Backend Foundation

**Goal:** Create a maintainable application foundation that can run
locally and in CI.

### Tasks

-   [x] Initialize a TypeScript project or monorepo.
-   [x] Configure strict TypeScript settings.
-   [x] Create API, worker, shared-contract, and database modules.
-   [x] Add Express.js and health-check endpoints.
-   [x] Add PostgreSQL and Prisma.
-   [x] Add Redis and BullMQ.
-   [x] Add Zod request and response schemas.
-   [x] Add environment validation at startup.
-   [x] Add structured logging and correlation IDs.
-   [x] Add Vitest and initial unit tests.
-   [x] Create Docker Compose for local dependencies.
-   [x] Add formatting, linting, type-checking, and test commands to CI.
-   [x] Add `.env.example` and ensure real secrets are ignored by Git.

### Check before moving on

-   Does the API start from a clean checkout?
-   Do database migrations run successfully?
-   Can a worker consume a test job?
-   Do invalid environment variables fail clearly at startup?
-   Do lint, type-check, and test commands run in CI?
-   Are API and worker processes separated?

### Avoid

-   Putting all logic in one `index.ts`.
-   Putting long-running LLM requests inside HTTP request handlers.
-   Committing `.env`, tokens, private keys, or database credentials.
-   Using `any` for core review contracts.
-   Introducing microservices before there is a scaling need.

### Encourage

-   Small modules with clear boundaries.
-   Shared Zod schemas and TypeScript types.
-   Reproducible local setup.
-   Database migrations committed to source control.
-   Unit tests for business logic.

### Definition of done

A new developer can clone the project, configure local environment
variables, start the API, worker, PostgreSQL, and Redis, run migrations,
and pass CI.

------------------------------------------------------------------------

## Phase 2 --- GitHub App and Pull Request Ingestion

**Goal:** Reliably detect pull requests and retrieve the exact revision
to review.

### Tasks

-   [x] Create and configure the GitHub App.
-   [x] Configure only required webhook events.
-   [x] Implement webhook endpoint using the raw request body for
    signature verification.
-   [x] Validate `X-Hub-Signature-256`.
-   [x] Validate installation and repository identity.
-   [x] Persist webhook delivery IDs.
-   [x] Handle opened, reopened, and synchronize PR actions.
-   [x] Enqueue a job after durable event acceptance.
-   [x] Implement installation-scoped Octokit authentication.
-   [x] Fetch PR metadata, base SHA, head SHA, changed files, and patch
    data.
-   [x] Fetch source contents at the exact head SHA.
-   [x] Handle pagination, deleted files, renames, binary files, and
    missing patches.
-   [x] Add retry and GitHub rate-limit handling.
-   [x] Store review-job and pull-request records.

### Check before moving on

-   Does an invalid webhook signature get rejected?
-   Does a duplicate delivery avoid creating a duplicate job?
-   Does every job retain the exact head SHA?
-   Are changed files and diff metadata correct?
-   Are API pagination and rate limits handled?
-   Does a new commit create a new review revision?
-   Does the webhook return quickly without waiting for AI analysis?

### Avoid

-   Trusting repository or installation IDs supplied by the browser.
-   Fetching source from a moving branch name instead of the reviewed
    SHA.
-   Processing webhook events synchronously.
-   Logging private keys or installation tokens.
-   Assuming every changed file contains a text patch.
-   Requesting broad GitHub write permissions without need.

### Encourage

-   Idempotent event processing.
-   Small webhook handlers.
-   Explicit event and action allowlists.
-   Test fixtures for webhook payloads.
-   Clear records of delivery ID, repository, PR, and head SHA.

### Definition of done

Opening a PR in the test repository creates one logical review job and
stores the correct metadata, changed files, diff, and immutable head
SHA.

------------------------------------------------------------------------

## Phase 3 --- First Working Reviewer: One Agent

**Goal:** Prove that the system can produce one useful review finding
before adding more agents.

### Tasks

-   [x] Create a review input contract.
-   [x] Create a prompt and output schema for one bug/logic review
    agent.
-   [x] Pass only changed code and a small amount of relevant context.
-   [x] Ask the model to distinguish observed evidence from inference.
-   [x] Require a structured response with an empty-findings option.
-   [x] Validate all output using Zod.
-   [x] Store model name, prompt version, duration, token usage, and
    output.
-   [x] Add provider timeout, bounded retries, and error handling.
-   [x] Test against known-bug and clean PR fixtures.
-   [x] Save model responses for reproducible evaluation.

### Check before moving on

-   Does the agent identify a deliberately introduced bug?
-   Does it return no finding for clean code when appropriate?
-   Are file paths and line references grounded in the input?
-   Does invalid JSON or schema output fail safely?
-   Are provider failures visible and retryable?
-   Can you reproduce a review using the same commit and prompt version?

### Avoid

-   Asking one prompt to review an entire large repository.
-   Treating confidence scores as calibrated probabilities.
-   Publishing raw model output directly to GitHub.
-   Retrying indefinitely.
-   Hiding model failures as successful empty reviews.
-   Optimizing for impressive-looking comments rather than correctness.

### Encourage

-   A narrow task for the first agent.
-   Structured outputs.
-   Prompt versioning.
-   Fixed evaluation examples.
-   Manual review of every benchmark result.

### Definition of done

A pull-request fixture can be submitted to the first agent, and the
system produces a validated, persisted result that identifies known
issues without inventing source locations.

------------------------------------------------------------------------

## Phase 4 --- Repository Context and Deterministic Analysis

**Goal:** Give the reviewer enough surrounding code to reason beyond
changed lines.

### Tasks

-   [x] Parse diff hunks and changed line ranges.
-   [x] Detect language and file type.
-   [x] Retrieve complete relevant functions or classes where practical.
-   [x] Use Tree-sitter for supported-language structural parsing.
-   [x] Retrieve imports, definitions, callers, related interfaces, and
    nearby tests.
-   [x] Add bounded lexical search for symbols and references.
-   [x] Add one static-analysis adapter, preferably Semgrep or the
    relevant language linter.
-   [x] Normalize tool results into a shared schema.
-   [x] Preserve provenance: repository, commit SHA, path, and line
    range.
-   [x] Add context-size and file-count limits.
-   [x] Exclude generated files, binaries, vendor folders, and
    configured sensitive files.

### Check before moving on

-   Can the context builder find a caller or related definition in a
    test fixture?
-   Does every context item identify its source commit and line range?
-   Are deleted, renamed, and generated files handled?
-   Are static-analysis results mapped to the correct source revision?
-   Are context budgets enforced?
-   Can the system explain which context was supplied to an agent?

### Avoid

-   Sending the entire repository to the LLM.
-   Adding embeddings before lexical and AST retrieval have been
    evaluated.
-   Assuming a parser understands every language construct perfectly.
-   Treating every static-analysis warning as a confirmed defect.
-   Including secrets or unrelated source in prompts.

### Encourage

-   Retrieval based on symbols and relationships.
-   Deterministic tools for deterministic checks.
-   Source provenance and bounded context.
-   Measuring retrieval usefulness on benchmark PRs.
-   Adding pgvector only when semantic retrieval improves measured
    results.

### Definition of done

The reviewer can retrieve relevant surrounding code and static-analysis
evidence for changed code, while respecting context and
source-provenance limits.

------------------------------------------------------------------------

## Phase 5 --- Multi-Agent Orchestration

**Goal:** Split review responsibilities without duplicating work or
making the workflow unpredictable.

### Tasks

-   [x] Implement the orchestrator using Mastra.
-   [x] Define explicit review state and transitions.
-   [x] Add bug/logic, security, and quality/test-gap agents.
-   [x] Define separate prompts, tools, and output contracts.
-   [x] Route agents according to file types and change characteristics.
-   [x] Run independent agents in parallel with concurrency limits.
-   [x] Add per-agent timeouts and bounded retries.
-   [x] Persist each agent run separately.
-   [x] Aggregate results into a common finding format.
-   [x] Record which agents were selected or skipped and why.
-   [x] Add tests for partial agent failure and empty findings.

### Check before moving on

-   Does each agent have a distinct responsibility?
-   Are irrelevant agents skipped?
-   Can one agent fail without losing successful results from others?
-   Are all outputs schema-validated?
-   Are agent calls bounded by time, concurrency, and token budgets?
-   Can a review be traced from plan to individual agent results?

### Avoid

-   Creating agents that all perform the same generic review.
-   Letting agents call one another without workflow limits.
-   Giving every agent unrestricted tools.
-   Assuming parallel execution always improves performance.
-   Allowing an agent to publish its own comments.
-   Using an unconstrained multi-agent conversation as the only source
    of workflow state.

### Encourage

-   Explicit state machines or graph workflows.
-   Narrow agent roles.
-   Parallelism only for independent tasks.
-   Shared finding contracts.
-   Per-agent quality and cost measurements.

### Definition of done

The orchestrator selects and runs the three agents, handles partial
failures, and produces one normalized set of findings with traceable
agent outputs.

------------------------------------------------------------------------

## Phase 6 --- Verification, Prioritization, and GitHub Publication

**Goal:** Publish only useful, supported findings in the correct
locations.

### Tasks

-   [x] Implement finding verification.
-   [x] Confirm cited paths and lines against the reviewed commit.
-   [x] Confirm inline locations are valid for the PR diff.
-   [x] Check evidence snippets against retrieved source.
-   [x] Detect duplicate or overlapping findings.
-   [x] Compare LLM findings with static-analysis evidence.
-   [x] Apply severity and confidence thresholds.
-   [x] Record rejection reasons for unsupported findings.
-   [x] Generate a concise review summary.
-   [x] Publish inline comments where GitHub accepts the position.
-   [x] Put findings without valid inline positions in the summary.
-   [x] Store GitHub review and comment IDs.
-   [x] Make publication idempotent.
-   [x] Handle GitHub API errors and rate limits.

### Check before moving on

-   Does every published finding have evidence?
-   Are file and line references valid?
-   Are duplicate comments suppressed?
-   Are unsupported findings rejected?
-   Does the summary distinguish critical issues from suggestions?
-   Does a retry avoid publishing the same comment again?
-   Are findings tied to the correct head SHA?
-   Are non-inline findings still visible in the summary?

### Avoid

-   Publishing every raw agent output.
-   Treating agreement between two LLMs as sufficient verification.
-   Posting comments on arbitrary lines outside the diff.
-   Creating noisy comments for subjective style preferences.
-   Replacing or deleting developer discussion without a clear policy.
-   Claiming a vulnerability is exploitable without supporting evidence.

### Encourage

-   High precision over high comment volume.
-   Short comments with impact and actionable remediation.
-   Transparent rejection reasons.
-   Stable finding fingerprints.
-   Human feedback on useful and incorrect findings.

### Definition of done

A known-issue PR receives a concise GitHub review with valid,
evidence-backed comments, while clean or unsupported cases do not
produce noisy findings.

------------------------------------------------------------------------

## Phase 7 --- Dashboard, Observability, and MVP Hardening

**Goal:** Make the working reviewer usable, debuggable, and safe for a
small pilot.

### Tasks

-   [x] Build repository connection and listing UI.
-   [x] Build pull-request and review-history views.
-   [x] Show review status and progress.
-   [x] Group findings by severity and category.
-   [x] Display evidence, recommendations, and source locations.
-   [x] Add useful/incorrect/dismissed feedback controls.
-   [x] Add repository review settings.
-   [x] Add structured logs and correlation IDs.
-   [x] Add metrics for queue latency, review duration, failures, and
    token cost.
-   [x] Add retry and failed-job visibility.
-   [x] Add authorization tests for repository data.
-   [x] Run an end-to-end test suite.
-   [x] Run the benchmark and document results.
-   [x] Pilot with a small number of non-critical repositories.

### Check before moving on

-   Can users see why a review failed?
-   Are review records isolated by user and installation?
-   Are source snippets and credentials absent from unsafe logs?
-   Can a developer inspect a finding and its evidence?
-   Can the team measure false positives and review cost?
-   Do end-to-end tests cover webhook through GitHub publication?
-   Are backup, retention, and deletion policies defined?

### Avoid

-   Treating a visually complete dashboard as proof of product quality.
-   Exposing source code to unauthorized users.
-   Storing unbounded logs or full prompts containing sensitive code.
-   Launching broadly before benchmark evaluation.
-   Ignoring provider and GitHub rate limits.

### Encourage

-   A small, opt-in pilot.
-   Clear status and failure messages.
-   Feedback capture.
-   Evaluation on clean and buggy PRs.
-   Regular review of cost, latency, and false positives.

### MVP release gate

Do not call the MVP complete until the acceptance criteria in PRD.md and
TRD.md pass and the system has been tested on a representative
benchmark.

------------------------------------------------------------------------

## Phase 8 --- Safe Fix Agent and Patch Validation

**Goal:** Move from identifying issues to proposing fixes without
compromising repositories or infrastructure.

### Prerequisites

Do not begin this phase until the review and verification pipeline is
reliable and sandbox isolation has been reviewed.

### Tasks

-   [x] Define which verified finding categories can request a fix.
-   [x] Retrieve exact source revision and relevant context.
-   [x] Generate a minimal patch rather than rewriting whole files.
-   [x] Validate patch paths and boundaries.
-   [x] Apply the patch in a disposable isolated environment.
-   [x] Run approved tests and static-analysis commands.
-   [x] Capture logs, exit codes, resource usage, and test results.
-   [x] Check whether the original finding is addressed.
-   [x] Show the patch diff and validation evidence to the user.
-   [x] Require explicit approval before creating a branch or commit.
-   [x] Record who approved the action and what revision was changed.

### Check before moving on

-   Is code execution isolated from the API, database, and host
    credentials?
-   Is network access disabled by default?
-   Are CPU, memory, process, disk, and time limits enforced?
-   Are test commands allowlisted or otherwise safely controlled?
-   Does a failed test prevent a fix from being presented as validated?
-   Is approval required before any repository write?
-   Can the sandbox be destroyed after success, failure, and timeout?

### Avoid

-   Running PR code on the application host.
-   Mounting the Docker socket into untrusted containers.
-   Giving generated code access to production secrets.
-   Allowing unrestricted outbound network access.
-   Automatically merging or pushing to protected branches.
-   Claiming tests prove all defects are resolved.

### Encourage

-   Minimal patches.
-   Disposable environments.
-   Human approval.
-   Targeted regression tests.
-   Complete audit trails.

### Definition of done

A verified finding can produce a patch, the patch can be tested in
isolation, and the developer can inspect and explicitly approve the
proposed repository change.

------------------------------------------------------------------------

## Phase 9 --- Quality Improvement and Scaling

**Goal:** Improve accuracy, retrieval, cost, and throughput based on
measured usage.

### Tasks

-   [x] Expand the benchmark with real, adjudicated examples.
-   [x] Measure precision, recall, localization accuracy, and
    false-positive rate.
-   [x] Analyze dismissed findings by category and agent.
-   [x] Improve prompts and retrieval using measured failures.
-   [x] Add semantic retrieval and pgvector if justified.
-   [x] Add performance and dependency agents where valuable.
-   [x] Add repository-specific rules and conventions.
-   [x] Add model routing and provider fallback.
-   [x] Add per-tenant budgets and concurrency limits.
-   [x] Add retention, export, and deletion workflows.
-   [x] Load-test queue and GitHub API behavior.
-   [x] Review sandbox security before increasing execution volume.

### Check before moving on

-   Is quality improving on a stable benchmark?
-   Are false positives decreasing without unacceptable recall loss?
-   Is cost per review understood?
-   Are model and tool versions recorded?
-   Can workers scale independently?
-   Are tenant boundaries and rate limits enforced?
-   Are added agents producing distinct value?

### Avoid

-   Adding agents only to increase the agent count.
-   Optimizing a single benchmark at the expense of real-world
    performance.
-   Treating user dismissals as perfect labels without review.
-   Scaling infrastructure before identifying the bottleneck.
-   Building complex memory systems without a measurable benefit.

### Encourage

-   Evaluation-driven development.
-   Small experiments and rollback capability.
-   Model and prompt versioning.
-   Cost and latency budgets.
-   Human adjudication of difficult cases.

### Definition of done

New capabilities show measurable improvements in quality, coverage, or
operational efficiency and do not weaken existing safety controls.

------------------------------------------------------------------------

## Phase 10 --- Production CI/CD & Public Release Readiness

**Goal:** Establish reproducible CI/CD pipelines, repository documentation, environment blueprints, and public release artifacts.

### Tasks

-   [x] Configure GitHub Actions CI workflow for typecheck, testing, and benchmark gate validation (`.github/workflows/ci.yml`).
-   [x] Create centralized `.env.example` blueprint for deployment.
-   [x] Create comprehensive root `README.md` with system architecture diagrams, quickstart, and benchmark results.
-   [x] Publish `CHANGELOG.md` with milestone progression.
-   [x] Publish `KNOWN_ISSUES.md` with operational limits and security boundaries.

### Definition of done

The repository has continuous integration validation on pull requests, complete setup documentation, and clean operational guides.

------------------------------------------------------------------------

## Phase 11 --- Organization Analytics & Quality Settings (FR-22)

**Goal:** Provide organization-level visibility into review latency, findings distribution, feedback trends, and interactive repository configuration.

### Tasks

-   [x] Implement aggregate analytics endpoint (`GET /api/v1/analytics/overview`) in `apps/api`.
-   [x] Add organization analytics dashboard view (`/analytics`) in `apps/web`.
-   [x] Add interactive repository review settings page (`/repositories/[id]/settings`) in `apps/web`.
-   [x] Add unit tests for analytics API and web dashboard views.

### Definition of done

Organization leads can track review throughput, mean latency, finding severity breakdown, and manage per-repository agent policies through the web UI.

------------------------------------------------------------------------

# 5. What to Check at Every Pull Request

Use this checklist for every implementation PR.

## Code quality

-   [ ] TypeScript types are explicit at module boundaries.
-   [ ] Inputs are validated.
-   [ ] Errors are handled intentionally.
-   [ ] No secrets or sensitive values are committed.
-   [ ] No unrelated refactoring is included.
-   [ ] Logging does not leak source code or credentials.

## Tests

-   [ ] Unit tests cover new business logic.
-   [ ] Integration tests cover changed service boundaries.
-   [ ] Failure cases are tested.
-   [ ] Tests are deterministic and do not rely on live LLM calls unless
    explicitly intended.
-   [ ] CI passes.

## AI and agent behavior

-   [ ] Agent role is narrow and documented.
-   [ ] Input context is bounded and source-attributed.
-   [ ] Output follows a validated schema.
-   [ ] Empty findings are supported.
-   [ ] Tool permissions are minimal.
-   [ ] Timeouts, retries, and budgets exist.
-   [ ] Prompt-injection risks are considered.

## Data and workflow

-   [ ] Database migrations are included where needed.
-   [ ] Job processing is idempotent.
-   [ ] Review state transitions are valid.
-   [ ] The reviewed commit SHA is preserved.
-   [ ] Retry behavior cannot duplicate side effects.

## Security

-   [ ] Authorization is checked server-side.
-   [ ] Repository content is treated as untrusted.
-   [ ] Shell commands do not interpolate untrusted strings.
-   [ ] External calls have timeouts.
-   [ ] Untrusted code is not executed outside the sandbox.

------------------------------------------------------------------------

# 6. What to Avoid Throughout the Project

1.  **Premature multi-agent complexity:** Make one agent work end-to-end
    first.
2.  **Prompt-only security:** Use deterministic scanners and explicit
    trust boundaries.
3.  **Unbounded context:** Retrieve relevant code, not the entire
    repository.
4.  **Unverified comments:** Never publish raw model output.
5.  **Uncontrolled autonomy:** No automatic merge, protected-branch
    write, or unapproved fix.
6.  **Premature vector database:** Prove retrieval needs before adding
    embeddings.
7.  **Premature microservices:** Start with a modular monolith and
    separate worker process.
8.  **Unbounded retries:** Every retry needs a limit, timeout, and
    observable failure state.
9.  **No evaluation:** A demo that looks correct is not evidence of
    review quality.
10. **Unsafe sandboxing:** Docker alone is not a complete security
    boundary.
11. **Secret leakage:** Never expose GitHub credentials, model keys, or
    sensitive source in logs.
12. **Feature accumulation:** Every feature must solve a defined user
    problem.

------------------------------------------------------------------------

# 7. What to Encourage

-   Evidence before conclusions.
-   Precision before comment volume.
-   Small vertical slices that work end-to-end.
-   Deterministic analysis alongside LLM reasoning.
-   Explicit schemas and state transitions.
-   Reproducible benchmark tests.
-   Narrow agent responsibilities.
-   Human approval for repository-changing actions.
-   Security reviews before enabling code execution.
-   Clear documentation and architecture decision records.
-   Metrics for cost, latency, accuracy, and reliability.
-   Feedback loops that are evaluated before being used to change
    behavior.

------------------------------------------------------------------------

# 8. Project Board and Definition of Done

Create these milestones in GitHub Projects:

  -----------------------------------------------------------------------
  Milestone                           Completion evidence
  ----------------------------------- -----------------------------------
  M0 --- Planning                     Scope, fixtures, and design
                                      decisions approved

  M1 --- Foundation                   API, DB, queue, Docker Compose, and
                                      CI work

  M2 --- GitHub ingestion             Signed PR webhook creates correct
                                      review job

  M3 --- Single agent                 Validated review output on test PRs

  M4 --- Context and tools            Relevant source and scanner results
                                      retrieved

  M5 --- Multi-agent                  Three agents run and aggregate
                                      reliably

  M6 --- Verification and publishing  Evidence-backed comments appear on
                                      GitHub

  M7 --- MVP hardening                Dashboard, evaluation,
                                      observability, and pilot pass

  M8 --- Fix agent                    Isolated patch validation and
                                      approval work

  M9 --- Scale and improve            Measured quality and capacity
                                      improvements
  -----------------------------------------------------------------------

### Definition of done for an issue

An issue is complete only when: - Its acceptance criteria are met. -
Relevant tests are added and passing. - Type-checking and linting
pass. - Documentation and configuration examples are updated. - Security
and failure behavior are considered. - The change is reviewed and
merged. - The milestone evidence is recorded.

------------------------------------------------------------------------

# 9. Suggested First 10 Development Tasks

Start in this order. Do not start all tasks in parallel.

1.  Create the repository and TypeScript workspace.
2.  Add Express health endpoint and environment validation.
3.  Add PostgreSQL, Prisma schema, and first migration.
4.  Add Redis and a BullMQ test worker.
5.  Create GitHub App and configure a test repository.
6.  Implement raw-body webhook signature verification.
7.  Persist webhook delivery and enqueue an idempotent job.
8.  Fetch PR metadata, changed files, diff, and exact head SHA.
9.  Create one LLM-backed bug-review agent with a Zod output schema.
10. Run the agent on one known-bug PR and save its output for
    evaluation.

**First vertical-slice target:** A test PR triggers a webhook, a worker
fetches the diff, one agent identifies a known issue, and the result is
stored. Only after this works should multi-agent orchestration begin.

------------------------------------------------------------------------

# 10. Final Project Rules

1.  PRD.md defines what the product must do.
2.  TRD.md defines how the system should be implemented.
3.  This roadmap defines the order in which to build it.
4.  Do not move to the next phase just because the code compiles;
    satisfy the exit criteria.
5.  Keep a `CHANGELOG.md` or milestone notes for meaningful decisions.
6.  Keep a `KNOWN_ISSUES.md` for unresolved defects and limitations.
7.  Keep benchmark examples versioned and rerun them after prompt,
    model, or retrieval changes.
8.  Never weaken security controls to make a demo work.
9.  Keep the MVP small enough to finish and demonstrate reliably.
10. Add advanced autonomy only after the review engine is trustworthy.

**Final delivery target:** A developer installs the GitHub App, opens a
pull request, receives a useful and verified review, inspects the
evidence in the dashboard, and can optionally request a safely tested
fix with explicit approval.
