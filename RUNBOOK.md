# RepoPilot Operational Runbook & Incident Response Guide

> **Service:** RepoPilot / Agentic Code Reviewer  
> **Architecture Version:** 2.0.0  
> **Target Environment:** Production (Containerized Kubernetes / Docker Compose)

---

## 1. Service Level Objectives (SLOs) & Commitments

| Metric | Target / Ceiling | Measurement Window | Alert Severity |
|---|---|---|---|
| **Review Precision** | $\ge 70\%$ (100% target) | Weekly benchmark & developer feedback | Critical if $< 70\%$ |
| **Review Recall** | $\ge 70\%$ | Weekly benchmark | Warning if $< 70\%$ |
| **Review Failure Rate** | $\le 2.0\%$ failed reviews | 5-minute rolling window | Critical |
| **P95 Review Latency** | $\le 120$ seconds | 15-minute rolling window | Warning |
| **Queue Backlog** | $\le 50$ pending jobs | 10-minute rolling window | Warning |
| **Clean PR False Positives** | $\le 1.0$ (0.0 target) | Continuous | Critical |
| **Cost Ceiling** | $\le \$0.25$ per review | Monthly average | Warning |

---

## 2. Health Check & Monitoring Endpoints

- **Liveness Probe:** `GET /healthz` (returns 200 OK if Express process is up)
- **Readiness Probe:** `GET /readyz` (returns 200 OK only if DB and Redis connections are established)
- **Prometheus Metrics:** `GET /metrics` (standard Prometheus format metrics)
- **Active SLO Alerts:** `GET /api/v1/alerts` (real-time evaluated alerts snapshot)

---

## 3. Incident Response Playbooks

### Drill 1: Upstream LLM Provider Outage or 429 Rate Limit Spike
- **Symptom:** `ProviderErrorSpike` alert fires; log reports `RESOURCE_EXHAUSTED` or `AI_APICallError 429`.
- **Automated Mitigation:**
  1. Secondary fallback provider chain automatically activates (`Gemini` $\rightarrow$ `Claude`).
  2. Jittered exponential backoff retries (`withRetry`) handle transient rate-limit windows.
  3. If all providers are exhausted, circuit breaker trips to `OPEN` state, completing jobs as `partial` with transparent coverage notice rather than dropping the PR.
- **Manual Operator Actions:**
  1. Check provider status dashboards: [Google AI Studio Status](https://status.cloud.google.com/) and [Anthropic Status](https://status.anthropic.com/).
  2. Increase per-minute quota limits in cloud console.
  3. If persistent, switch primary provider via environment variable:
     ```bash
     export PRIMARY_LLM_PROVIDER="anthropic" # or "gemini"
     docker compose -f docker-compose.prod.yml restart worker
     ```

---

### Drill 2: BullMQ Queue Backlog & Dead Letter Queue (DLQ) Recovery
- **Symptom:** `ReviewQueueBacklog` alert fires (depth > 50).
- **Automated Mitigation:**
  1. Failed jobs automatically retry up to 3 times with exponential backoff.
  2. Exhausted jobs are routed to Dead Letter Queue (`pull-request-reviews-dlq`) to prevent worker blocking.
- **Manual Operator Actions:**
  1. Check worker concurrency and scale worker instances:
     ```bash
     docker compose -f docker-compose.prod.yml up -d --scale worker=3
     ```
  2. Inspect failed DLQ payload reasons:
     ```bash
     pnpm --filter @acr/worker dlq:inspect
     ```
  3. Replay DLQ jobs once underlying cause is resolved:
     ```bash
     pnpm --filter @acr/worker dlq:replay
     ```

---

### Drill 3: Worker Crash & Failover Drill
- **Symptom:** Worker container abruptly terminates (`kill -9`).
- **Automated Mitigation:**
  1. Docker Compose `restart: unless-stopped` or Kubernetes ReplicaSet detects exit and launches fresh container within 5 seconds.
  2. BullMQ stalled-job detector (`stalledInterval: 30000`) detects unacknowledged job lock and re-assigns job to healthy worker without duplicate comment posting (guarded by finding deduplication fingerprints).
- **Operator Verification:**
  ```bash
  docker kill repopilot-worker-prod
  docker ps | grep repopilot-worker-prod # verify auto-restart
  ```

---

### Drill 4: Database Migration Rollback Procedure
- **Symptom:** Migration error during deployment rollout.
- **Procedure:**
  1. Immediately stop incoming webhook queue consumption:
     ```bash
     docker compose -f docker-compose.prod.yml pause worker
     ```
  2. Execute Prisma migration rollback / down migration:
     ```bash
     pnpm --filter @acr/database prisma migrate resolve --rolled-back "<migration_name>"
     ```
  3. Re-deploy previous stable container image:
     ```bash
     docker compose -f docker-compose.prod.yml up -d --no-deps api worker
     ```
  4. Resume worker queue processing:
     ```bash
     docker compose -f docker-compose.prod.yml unpause worker
     ```

---

## 4. Backup & Disaster Recovery

- **PostgreSQL Database Backups:**
  Automated daily WAL archiving and pg_dump snapshot:
  ```bash
  docker exec -t repopilot-postgres-prod pg_dump -U repopilot repopilot_prod | gzip > /backups/repopilot_$(date +%Y%m%d_%H%M%S).sql.gz
  ```
- **Restore Procedure:**
  ```bash
  gunzip < /backups/repopilot_20261108_120000.sql.gz | docker exec -i repopilot-postgres-prod psql -U repopilot -d repopilot_prod
  ```
