# Product Requirements Document (PRD)

## Agentic Code Reviewer

**Version:** 1.0\
**Date:** November 2, 2026\
**Status:** Proposed

------------------------------------------------------------------------

## 1. Product Overview

### 1.1 Product name

Agentic Code Reviewer

### 1.2 Product summary

Agentic Code Reviewer is a GitHub-integrated AI code-review platform
that analyzes pull requests using a coordinated set of specialized
agents. It identifies likely bugs, security vulnerabilities, performance
concerns, maintainability issues, and test gaps; validates findings
against source evidence; and publishes actionable review comments to
GitHub.

The product is designed to progress from evidence-backed review to
optional, human-approved code repair. It does not autonomously merge
pull requests or push unapproved changes to protected branches.

### 1.3 Problem statement

Manual code review is time-consuming and inconsistent. Reviewers must
understand changed code, trace dependencies, identify security and
correctness risks, and verify test coverage. Basic LLM reviewers can
miss repository context, produce unsupported findings, duplicate
comments, or suggest fixes that do not work.

The product addresses these problems by combining repository-aware
retrieval, deterministic static-analysis tools, specialized AI agents,
evidence verification, and controlled GitHub integration.

### 1.4 Product vision

Provide developers with a reliable AI review assistant that explains
what is wrong, shows where and why it matters, verifies its findings,
and helps developers safely resolve issues.

------------------------------------------------------------------------

## 2. Goals and Non-Goals

### 2.1 Goals

-   Automatically start reviews when configured GitHub pull-request
    events occur.
-   Analyze changed files and retrieve relevant repository context.
-   Delegate appropriate review tasks to specialized agents.
-   Detect correctness, security, performance, maintainability, and
    testing issues.
-   Validate findings for source evidence, location, relevance, and
    duplication.
-   Prioritize findings by severity and confidence.
-   Publish concise inline comments and a pull-request summary.
-   Retain review history and developer feedback.
-   Provide an optional, approval-based fix workflow.
-   Make review runs observable, retryable, and auditable.

### 2.2 Non-goals for the MVP

-   Replacing human code review or guaranteeing defect-free code.
-   Training a foundation model.
-   Supporting every programming language at launch.
-   Automatically merging pull requests.
-   Automatically pushing changes to a protected branch.
-   Running arbitrary repository code without sandbox controls.
-   Building a full IDE or general-purpose coding assistant.
-   Providing a complete software-composition-analysis platform.

------------------------------------------------------------------------

## 3. Target Users and Personas

### 3.1 Individual developer

Wants fast feedback on pull requests and clear explanations of potential
defects.

### 3.2 Team lead / reviewer

Wants consistent review standards, prioritized risks, and fewer
repetitive review tasks.

### 3.3 Repository administrator

Wants control over repository installation, permissions, review
triggers, and policy settings.

### 3.4 Engineering organization

Wants visibility into review quality, recurring issue categories, and
adoption across repositories.

------------------------------------------------------------------------

## 4. Product Scope

### 4.1 MVP scope

1.  GitHub App installation and repository authorization.
2.  Pull-request webhook intake.
3.  Changed-file and diff retrieval.
4.  Repository context retrieval for changed code.
5.  Orchestrator and three initial agents:
    -   Bug and logic review agent.
    -   Security review agent.
    -   Code quality and test-gap review agent.
6.  Static-analysis integration for supported languages.
7.  Evidence verification and duplicate suppression.
8.  Structured review summary and inline comments.
9.  Review status, logs, and findings persistence.
10. Basic dashboard showing repositories, pull requests, and review
    results.

### 4.2 Post-MVP scope

-   Dedicated performance, dependency, and test-generation agents.
-   Repository-specific review policies and conventions.
-   Persistent semantic repository index.
-   Feedback-informed ranking and suppression.
-   Fix Agent that creates patches in an isolated environment.
-   Regression test generation and execution.
-   Organization-level analytics and configuration.
-   Additional language and static-analysis support.

------------------------------------------------------------------------

## 5. User Journeys

### 5.1 Install and connect a repository

1.  User signs in to the platform.
2.  User connects a GitHub account through GitHub App installation.
3.  User selects repositories and grants the requested permissions.
4.  Platform records the installation and repository configuration.
5.  User can enable or disable automatic reviews per repository.

### 5.2 Review a pull request

1.  Developer opens or updates a pull request.
2.  GitHub sends a signed webhook.
3.  Platform validates the event and queues a review job.
4.  Worker retrieves PR metadata, diff, changed files, and relevant
    source context.
5.  Orchestrator selects applicable agents.
6.  Agents analyze changes and return schema-validated findings.
7.  Verification stage checks evidence, line locations, duplicates, and
    confidence.
8.  Aggregator prioritizes accepted findings.
9.  Platform publishes a review summary and supported inline comments.
10. Dashboard displays status and findings.

### 5.3 Review an updated pull request

1.  New commit triggers a synchronize event.
2.  Platform creates a new review run associated with the updated head
    SHA.
3.  Findings are recalculated against the latest diff.
4.  Previous findings are retained as history and can be marked
    resolved, unchanged, or superseded where supported.
5.  Only current, valid findings are published for the new run.

### 5.4 Request a suggested fix (post-MVP)

1.  User selects a verified finding.
2.  Fix Agent retrieves the relevant context and proposes a patch.
3.  Patch is applied in an isolated, resource-limited sandbox.
4.  Tests and static checks run in the sandbox.
5.  Platform presents the diff and validation results.
6.  User explicitly approves creating a branch or suggested commit.
7.  Platform records the action and its audit trail.

------------------------------------------------------------------------

## 6. Functional Requirements

  -----------------------------------------------------------------------
  ID                      Requirement             Priority
  ----------------------- ----------------------- -----------------------
  FR-01                   Authenticate users and  MVP
                          maintain user sessions. 

  FR-02                   Connect repositories    MVP
                          through a GitHub App.   

  FR-03                   Validate webhook        MVP
                          signatures and reject   
                          invalid requests.       

  FR-04                   Handle pull_request     MVP
                          opened, reopened, and   
                          synchronize events.     

  FR-05                   Deduplicate webhook     MVP
                          deliveries and review   
                          jobs.                   

  FR-06                   Retrieve PR metadata,   MVP
                          changed files, diff,    
                          and head SHA.           

  FR-07                   Build bounded context   MVP
                          around changed code     
                          using source and        
                          repository search.      

  FR-08                   Select review agents    MVP
                          based on file types,    
                          change types, and       
                          repository policy.      

  FR-09                   Require agents to       MVP
                          return structured,      
                          schema-validated        
                          findings.               

  FR-10                   Integrate deterministic MVP
                          static-analysis tools   
                          for supported           
                          languages.              

  FR-11                   Verify evidence,        MVP
                          changed-line locations, 
                          duplicate findings, and 
                          confidence.             

  FR-12                   Assign severity and     MVP
                          category to accepted    
                          findings.               

  FR-13                   Publish a pull-request  MVP
                          summary and valid       
                          inline comments.        

  FR-14                   Persist review runs,    MVP
                          agent outputs,          
                          findings, and           
                          publication status.     

  FR-15                   Display review status   MVP
                          and findings in a       
                          dashboard.              

  FR-16                   Allow users to mark     MVP
                          findings useful,        
                          incorrect, or           
                          dismissed.              

  FR-17                   Re-review a pull        MVP
                          request when its head   
                          commit changes.         

  FR-18                   Generate a proposed     Post-MVP
                          patch for a selected    
                          finding.                

  FR-19                   Run generated patches   Post-MVP
                          and tests in an         
                          isolated sandbox.       

  FR-20                   Require explicit        Post-MVP
                          approval before         
                          publishing a fix branch 
                          or commit.              

  FR-21                   Provide                 Post-MVP
                          repository-specific     
                          rules and review        
                          policies.               

  FR-22                   Provide organization    Post-MVP
                          analytics and           
                          configurable quality    
                          metrics.                
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 7. Agent Requirements

### 7.1 Orchestrator Agent

Responsibilities: - Interpret PR metadata and change summaries. -
Classify changed files and identify relevant risks. - Create a bounded
review plan. - Select agents and provide relevant context. - Track agent
completion, retries, and failures. - Avoid invoking irrelevant agents.

The orchestrator must not publish findings directly without the
verification and aggregation stages.

### 7.2 Bug and Logic Review Agent

Responsibilities: - Identify incorrect conditions, invalid assumptions,
edge cases, and error-handling defects. - Trace relevant function
callers and data flow where context is available. - Explain the
execution path supporting a finding. - Avoid reporting style-only
concerns as bugs.

### 7.3 Security Review Agent

Responsibilities: - Identify potential injection, authorization,
authentication, secrets exposure, unsafe deserialization, path
traversal, and insecure configuration issues. - Correlate LLM analysis
with static-analysis evidence where available. - Explain
attacker-controlled inputs and security impact. - Avoid asserting
exploitability without sufficient evidence.

### 7.4 Code Quality and Test-Gap Agent

Responsibilities: - Identify maintainability problems and risky
complexity in changed code. - Identify missing or inadequate tests for
changed behavior. - Consider existing project conventions and test
patterns. - Avoid subjective or low-value style comments.

### 7.5 Verification Agent

Responsibilities: - Confirm that cited code and evidence exist. - Check
file paths and diff line locations. - Determine whether the issue is
already handled elsewhere. - Merge duplicate findings. - Reject
unsupported, speculative, or low-confidence findings. - Preserve the
reason for acceptance or rejection.

### 7.6 Future agents

-   Performance agent.
-   Dependency and supply-chain agent.
-   Test-generation agent.
-   Fix agent.

------------------------------------------------------------------------

## 8. Finding Data Contract

Every finding must use a consistent schema.

``` json
{
  "title": "Possible SQL injection",
  "category": "security",
  "severity": "high",
  "confidence": 0.94,
  "file": "src/users.ts",
  "line": 42,
  "endLine": 42,
  "description": "User-controlled input reaches a query without parameterization.",
  "evidence": "Relevant source expression or tool finding",
  "impact": "An attacker may alter the intended database query.",
  "recommendation": "Use parameterized query APIs.",
  "verificationStatus": "verified"
}
```

Allowed categories: - correctness - security - performance -
maintainability - testing - dependency

Severity values: - critical - high - medium - low - informational

Confidence must be a number between 0 and 1. File and line references
must be validated against the repository revision being reviewed.

------------------------------------------------------------------------

## 9. User Interface Requirements

### 9.1 Dashboard

-   Connected GitHub repositories.
-   Recent pull requests and review runs.
-   Review status: queued, running, completed, failed.
-   Finding counts by severity.
-   Recent activity.

### 9.2 Pull-request review detail

-   PR title, number, author, branch, and commit SHA.
-   Review summary.
-   Findings grouped by severity and category.
-   File path and line references.
-   Evidence, impact, and recommendation.
-   Agent attribution and confidence.
-   Verification status.
-   Feedback controls.

### 9.3 Settings

-   Repository review enablement.
-   Agent selection and review policy.
-   Language/tool configuration.
-   Severity thresholds.
-   Comment publication settings.

### 9.4 Fix review (post-MVP)

-   Proposed patch diff.
-   Test and static-check results.
-   Approve or reject controls.
-   Audit history.

------------------------------------------------------------------------

## 10. Non-Functional Requirements

### 10.1 Security

-   Use least-privilege GitHub App permissions.
-   Encrypt secrets and sensitive tokens at rest.
-   Verify webhook signatures.
-   Never expose installation tokens or model API keys to the browser.
-   Treat repository content and PR instructions as untrusted data.
-   Do not allow repository content to override system or agent
    policies.
-   Isolate untrusted code execution with strict resource and network
    controls.
-   Audit privileged operations.

### 10.2 Reliability

-   Use durable background jobs.
-   Make webhook processing idempotent.
-   Retry transient failures with bounded exponential backoff.
-   Record failed agent runs and allow safe retries.
-   Avoid duplicate GitHub comments when a job is retried.

### 10.3 Performance

Initial targets, to be validated during load testing: - Acknowledge
valid webhooks quickly and enqueue work asynchronously. - Target a
review completion time of under 5 minutes for ordinary small PRs. -
Support parallel execution of independent review agents. - Apply
configurable limits to file count, diff size, context size, and model
calls.

### 10.4 Scalability

-   Separate API and background workers.
-   Scale workers horizontally.
-   Use queues for review workloads.
-   Cache repository metadata where safe.
-   Partition or archive review history as usage grows.

### 10.5 Observability

-   Structured logs with correlation IDs.
-   Metrics for queue latency, review duration, token usage, tool
    failures, and finding acceptance.
-   Traces across webhook, retrieval, agents, verification, and GitHub
    publication.
-   Redact secrets and sensitive source snippets from logs.

------------------------------------------------------------------------

## 11. Permissions and Trust Boundaries

-   GitHub App permissions should be limited to the minimum required for
    reading repository contents and pull requests, receiving events, and
    writing review comments or checks.
-   Request additional write permissions only when a feature requires
    them.
-   Never execute untrusted repository code on the API server.
-   Run tests and generated patches in disposable, isolated
    environments.
-   Disable network access by default in code-execution sandboxes.
-   Apply CPU, memory, disk, process, and execution-time limits.
-   Require user approval for patch publication.
-   Treat AI-generated findings and patches as untrusted until
    validated.

------------------------------------------------------------------------

## 12. Success Metrics

Initial product metrics: - Percentage of review runs completed
successfully. - Median and p95 review completion time. - Percentage of
findings accepted as useful by developers. - False-positive rate based
on developer feedback and adjudicated samples. - Duplicate finding
rate. - Percentage of findings with valid source and diff locations. -
Cost per reviewed pull request. - Percentage of suggested fixes passing
relevant tests (post-MVP). - Developer adoption and repeat usage.

Metrics must be evaluated on a representative benchmark set, not only on
live user feedback.

------------------------------------------------------------------------

## 13. Risks and Mitigations

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  False-positive findings             Evidence verification, confidence
                                      thresholds, feedback

  Missed cross-file defects           Bounded repository context and
                                      call-site retrieval

  Prompt injection in source code     Treat repository content as
                                      untrusted data; isolate tool
                                      permissions

  Excessive LLM cost                  Dynamic agent selection, caching,
                                      diff limits, model routing

  Slow reviews                        Parallel agents, queues, bounded
                                      context

  Unsafe generated patches            Disposable sandbox, tests, approval
                                      gate

  Duplicate comments                  Idempotency keys and review-run
                                      tracking

  GitHub API limits                   Backoff, caching, pagination,
                                      rate-limit handling
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 14. Release Plan

### Release 1 --- MVP

-   GitHub App and webhook integration.
-   PR diff retrieval.
-   Three-agent review workflow.
-   Static-analysis integration.
-   Verification and aggregation.
-   GitHub review publication.
-   Basic dashboard and review history.

### Release 2 --- Repository intelligence

-   Semantic repository indexing.
-   Improved cross-file context.
-   Repository-specific policies.
-   Feedback and suppression workflows.
-   Additional language support.

### Release 3 --- Assisted remediation

-   Fix Agent.
-   Patch generation.
-   Isolated test execution.
-   Human-approved fix branch creation.
-   Regression test generation.

### Release 4 --- Team and organization features

-   Organization dashboard.
-   Advanced policy management.
-   Usage and cost analytics.
-   Audit and administration features.

------------------------------------------------------------------------

## 15. Acceptance Criteria for MVP

The MVP is ready for pilot use when: 1. A GitHub App can be installed on
selected repositories. 2. Valid PR events create exactly one logical
review job per event/revision. 3. The system retrieves the correct PR
head SHA, changed files, and diff. 4. The orchestrator selects agents
based on the change. 5. Agents return schema-valid findings or explicit
empty results. 6. Findings are checked for evidence and valid file/line
locations. 7. Unsupported and duplicate findings are not published. 8. A
review summary and supported inline comments are published to GitHub. 9.
Review status and results are visible in the dashboard. 10. Failures are
observable and safely retryable. 11. Repository code is not executed
outside the configured sandbox. 12. No autonomous merge or unapproved
branch write is possible.

------------------------------------------------------------------------

## 16. Open Product Decisions

Resolve these before implementation: - Which languages are supported in
the first pilot? - Should the MVP publish comments automatically or
require a preview/approval? - Which LLM provider is the default, and
what is the fallback? - What are the maximum PR diff and file-size
limits? - How long should source context, agent outputs, and review
history be retained? - Is the first release for individual developers or
organization teams? - Which GitHub permissions are strictly necessary
for the selected MVP features?
