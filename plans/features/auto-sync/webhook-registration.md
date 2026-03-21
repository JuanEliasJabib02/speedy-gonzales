# Webhook Registration

**Status:** todo

## What it does

When a repo is linked to a project, automatically register a GitHub webhook to receive push events.

## Checklist

- [x] Generate random `webhookSecret` for HMAC verification
- [x] POST to GitHub API to create webhook on the repo
- [x] Store `webhookId` and `webhookSecret` in projects table
- [x] Configure webhook: URL, push events only, JSON content type
- [x] Handle errors (repo not found, insufficient permissions) — logs error, non-blocking

## Implementation

- `convex/githubSync.ts` → `registerWebhook` internalAction
- `convex/githubSync.ts` → `storeWebhookInfo` internalMutation
- Webhook URL: `${CONVEX_SITE_URL}/github-webhook`
- Scheduled on project creation (non-critical — PAT might lack `admin:repo_hook` scope)
