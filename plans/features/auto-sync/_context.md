# Auto-Sync

**Status:** completed
**Priority:** critical

## Overview

The core engine of Speedy Gonzales. Reads `plans/features/` from linked GitHub repos, parses the `.md` files, and stores the data in Convex. Keeps everything in sync via webhooks — when someone pushes to the repo, the app detects changes in plan files and updates automatically within seconds.

## How it works

1. User creates a project with a GitHub repo URL
2. On create → PAT-based sync fetches plans/ → parses → stores in DB
3. User configures webhook on GitHub repo → push fires → sync plans/ → update DB
4. UI updates in real-time via Convex reactive queries (no polling)

## Architecture decisions

- **PAT for MVP** — GitHub Personal Access Token as Convex env var (`GITHUB_PAT`). OAuth is a separate feature.
- **Provider-agnostic** — abstract `GitProvider` interface so Bitbucket/GitLab can be added by implementing one file
- **Convex actions** for all GitHub API calls (no Next.js API routes needed)
- **Webhook endpoint** in `convex/http.ts` at `/github-webhook`
- **Race condition guard** — if a sync is already running, new triggers are skipped
- **Danger zone dialog** — manual "Sync now" warns the user about overwriting unpushed changes

## What's built

- [x] Plan parser (`convex/model/parsePlan.ts`)
- [x] Repo URL parser (`convex/model/parseRepoUrl.ts`)
- [x] File grouper (`convex/model/groupFiles.ts`)
- [x] Git provider interface + GitHub implementation
- [x] Sync engine (syncRepoInternal, upsertPlans, updateSyncStatus)
- [x] Webhook handler endpoint (`POST /github-webhook`)
- [x] Webhook registration (registerWebhook internalAction)
- [x] "Sync now" button with danger zone confirmation dialog
- [x] Live sync timer (shows seconds since last sync with GitHub icon)
- [x] Race condition fix — skip sync if already syncing
- [x] Ticket move fix — always update epicId even when content unchanged
- [x] Epic count fix — always update ticketCount/sortOrder on every sync
- [x] Dashboard + Kanban + Feature View wired to reactive Convex queries

## Key files

- `convex/model/parsePlan.ts`, `parseRepoUrl.ts`, `groupFiles.ts`
- `convex/model/gitProvider.ts`, `providers/github.ts`, `providers/index.ts`
- `convex/githubSync.ts` (sync engine + upsert + status)
- `convex/http.ts` (webhook handler)
- `src/.../ProjectHeader.tsx` (sync button, timer, danger zone dialog)
