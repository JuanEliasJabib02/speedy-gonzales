# GitHub Sync

**Status:** todo
**Priority:** critical

## Overview

Reads `plans/features/` from linked GitHub repos, parses the `.md` files, and stores the data in Convex. Keeps everything in sync via webhooks — when someone pushes to the repo, the app detects it and updates automatically.

This is the **core engine** of Speedy Gonzales. Without it, there's nothing to show.

## How it works

1. User creates a project with a GitHub repo URL
2. On create → PAT-based sync fetches plans/ → parses → stores in DB
3. Webhook registered on repo → push fires → sync plans/ → update DB
4. UI updates in real-time via Convex reactive queries

## Architecture decisions

- **PAT for MVP** — GitHub Personal Access Token as Convex env var (`GITHUB_PAT`). OAuth later.
- **Provider-agnostic** — abstract `GitProvider` interface so Bitbucket/GitLab can be added by implementing one file
- **Convex actions** for all GitHub API calls (no Next.js API routes needed)
- **Webhook endpoint** in `convex/http.ts` at `/github-webhook`
- **Reactive queries** replace the 3s polling — `useQuery` auto-updates when data changes

## What's built

- [x] Schema: projects, epics, tickets tables with indexes
- [x] Plan parser migrated to `convex/model/parsePlan.ts`
- [x] Repo URL parser: `convex/model/parseRepoUrl.ts`
- [x] File grouper: `convex/model/groupFiles.ts`
- [x] Git provider interface + GitHub implementation
- [x] Projects CRUD (getProjects, getProject, createProject, deleteProject)
- [x] Sync engine (syncRepoInternal, upsertPlans, updateSyncStatus)
- [x] Webhook handler endpoint (`POST /github-webhook`)
- [x] Webhook registration (registerWebhook internalAction)
- [x] "Sync now" button wired to `useAction(api.githubSync.syncProject)`
- [x] Dashboard wired to Convex queries
- [x] Kanban wired to Convex queries
- [x] Feature View uses reactive Convex queries (no more polling)

## Still needs

- [ ] Set `GITHUB_PAT` env var in Convex dashboard
- [ ] Test full sync flow end-to-end
- [ ] Error toasts on sync failure
- [ ] GitHub OAuth flow (future — replaces PAT)

## Key files

- `convex/schema/projects.ts`, `epics.ts`, `tickets.ts`
- `convex/model/parsePlan.ts`, `parseRepoUrl.ts`, `groupFiles.ts`
- `convex/model/gitProvider.ts`, `providers/github.ts`, `providers/index.ts`
- `convex/projects.ts`, `githubSync.ts`, `epics.ts`, `tickets.ts`
- `convex/http.ts` (webhook handler)

## Depends on

- Feature 2 (Projects) — integrated into this feature

## Blocks

- Feature 5 (Kanban) — needs epics to display ✅ wired
- Feature 6 (Feature View) — needs tickets to display ✅ wired
