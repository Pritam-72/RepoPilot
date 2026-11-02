# GitHub App Setup Guide

## 1. Create the App
Go to https://github.com/settings/apps/new and fill in:
- **App name**: agentic-code-reviewer-dev
- **Homepage URL**: http://localhost:3000
- **Webhook URL**: https://<your-ngrok-url>/api/v1/webhooks/github
- **Webhook secret**: generate with `openssl rand -hex 32`

## 2. Permissions (minimum)
| Permission | Level |
|-----------|-------|
| Contents | Read |
| Metadata | Read |
| Pull requests | Read & Write |
| Checks | Write |

## 3. Subscribe to Events
- `pull_request` (opened, reopened, synchronize)
- `installation`

## 4. Generate Private Key
Download the `.pem` file. Convert to single-line for env:
```bash
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' private-key.pem
```

## 5. Install on Test Repository
Install the app on a dedicated test repository with known bugs.
