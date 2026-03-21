# Webhook Registration

**Status:** todo

## What it does

When a repo is linked to a project, automatically register a GitHub webhook to receive push events.

## Checklist

- [ ] Generate random `webhookSecret` for HMAC verification
- [ ] POST to GitHub API to create webhook on the repo
- [ ] Store `webhookId` and `webhookSecret` in projects table
- [ ] Configure webhook: URL, push events only, JSON content type
- [ ] Handle errors (repo not found, insufficient permissions)

## Webhook config

- URL: `https://<convex-deployment>.convex.site/github-webhook`
- Events: `push` only
- Content type: `application/json`
