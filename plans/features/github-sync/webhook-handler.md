# Webhook Handler Endpoint

**Status:** completed

## What it does

Convex HTTP endpoint that receives GitHub webhook POST requests and triggers a repo sync if plan files changed.

## Checklist

- [x] Create HTTP endpoint at `/github-webhook` in `convex/http.ts`
- [x] Verify HMAC-SHA256 signature using webhookSecret (via `crypto.subtle`)
- [x] Extract repo owner/name from payload
- [x] Look up project in DB by `by_repo` index
- [x] Check if changed files are inside plansPath
- [x] Schedule internal action: `syncRepoInternal(projectId)` if plans changed
- [x] Return 200 for all valid requests (even if no sync needed)
