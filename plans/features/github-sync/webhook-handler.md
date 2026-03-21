# Webhook Handler Endpoint

**Status:** todo

## What it does

Convex HTTP endpoint that receives GitHub webhook POST requests and triggers a repo sync if plan files changed.

## Checklist

- [ ] Create HTTP endpoint at `/github-webhook`
- [ ] Verify HMAC-SHA256 signature using webhookSecret
- [ ] Extract repo owner/name from payload
- [ ] Look up project in DB by [repoOwner, repoName] index
- [ ] Check if changed files are inside plansPath
- [ ] Schedule internal action: `syncRepo(projectId)` if plans changed
- [ ] Return 200 for all valid requests (even if no sync needed)
