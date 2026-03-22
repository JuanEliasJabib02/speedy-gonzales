# Auto-Sync

**Status:** completed
**Priority:** critical

## Overview

The core engine of Speedy Gonzales. Reads `plans/features/` from linked GitHub repos, parses `.md` files, and stores everything in Convex. Keeps the app in sync via webhooks — when anyone pushes to the repo, the app detects changed plan files and updates within seconds. No polling, no manual imports. The repo is the source of truth; Speedy just reflects it.

This is the foundation every other feature builds on. Without Auto-Sync, there are no epics, no tickets, no kanban, no chat context. Everything else assumes it works.

## Architecture decisions

- **PAT for MVP** — GitHub Personal Access Token as Convex env var (`GITHUB_PAT`). GitHub OAuth is a separate feature.
- **Provider-agnostic** — abstract `GitProvider` interface so Bitbucket/GitLab can be added by implementing a single file
- **Convex actions** for all GitHub API calls — no Next.js API routes needed for sync
- **Webhook endpoint** in `convex/http.ts` at `/github-webhook` — receives push events from GitHub
- **Race condition guard** — if a sync is already running, new triggers are skipped (no duplicate syncs)
- **Upsert logic** — always updates epicId, ticketCount, and sortOrder even when content hasn't changed
- **Flat file format** — each ticket is a `.md` file under `plans/features/<epic-slug>/<ticket-slug>.md`
- **Status parsed from frontmatter** — `**Status:** todo|in-progress|review|completed|blocked` drives kanban
- **Priority parsed from frontmatter** — `**Priority:** low|medium|high|critical`
- **Checklists as progress signal** — `- [x]` vs `- [ ]` give completion percentage per ticket
- **`_context.md` as epic overview** — special file in each feature folder, not treated as a ticket

## What's built

### Sync engine
- [x] Plan parser (`convex/model/parsePlan.ts`) — extracts title, status, priority, content, checklists
- [x] Repo URL parser (`convex/model/parseRepoUrl.ts`) — normalizes GitHub URLs to owner/repo
- [x] File grouper (`convex/model/groupFiles.ts`) — groups changed files by epic slug
- [x] Git provider interface (`convex/model/gitProvider.ts`) — abstract contract for providers
- [x] GitHub provider implementation (`convex/model/providers/github.ts`)
- [x] Provider factory (`convex/model/providers/index.ts`)
- [x] Sync engine (`convex/githubSync.ts`) — `syncRepoInternal`, `upsertPlans`, `updateSyncStatus`
- [x] Upsert logic handles both create and update paths without data loss
- [x] Ticket move fix — epicId always updated when ticket moves between epics
- [x] Epic count fix — ticketCount and sortOrder updated on every sync, not just on content change

### Webhook
- [x] Webhook handler endpoint (`POST /github-webhook`) in `convex/http.ts`
- [x] Webhook registration action (`registerWebhook` internalAction) — called on project create
- [x] Filters push events to only sync when `plans/` files changed
- [x] Race condition fix — `isSyncing` flag in project record, skips duplicate triggers

### UI
- [x] "Sync now" button in ProjectHeader with danger zone confirmation dialog
- [x] Live sync timer — shows seconds since last sync with GitHub icon
- [x] Sync status indicator — idle / syncing / error states
- [x] Dashboard, Kanban, and Feature View all wired to reactive Convex queries

### Downstream consumers
- [x] Dashboard — epic list, ticket counts, completion percentages
- [x] Kanban — columns driven by parsed ticket status
- [x] Feature View — epic content from `_context.md`, ticket list from parsed files
- [x] Chat context injection — agent receives plan content and ticket list from synced data

## Still needs

- [ ] GitHub OAuth flow (replace PAT with per-user tokens)
- [ ] Bitbucket provider implementation (interface ready, provider missing)
- [ ] GitLab provider implementation
- [ ] Sync error display in UI (current errors are logged, not surfaced)
- [ ] Webhook signature verification (GitHub sends `X-Hub-Signature-256`, currently ignored)
- [ ] Support for renamed/deleted plan files (currently only handles creates and updates)
- [ ] Per-epic sync status (currently project-level only)
- [ ] Sync history log in UI (last N syncs with timestamps and changed files)

## Key files

```
convex/model/
  parsePlan.ts          ← md parser (status, priority, checklists)
  parseRepoUrl.ts       ← normalizes GitHub URLs
  groupFiles.ts         ← groups changed files by epic
  gitProvider.ts        ← abstract provider interface
  providers/
    github.ts           ← GitHub implementation
    index.ts            ← provider factory

convex/
  githubSync.ts         ← sync engine, upsert, status management
  http.ts               ← webhook handler endpoint

src/app/(app)/projects/[projectId]/
  ProjectHeader.tsx     ← sync button, live timer, danger zone dialog
```

## Env vars

```
GITHUB_PAT=ghp_...       # GitHub Personal Access Token (Convex env var)
```

## Depends on

- Projects feature — sync is always scoped to a project with a repo URL
- Convex schema — `epics`, `tickets`, `projects` tables with sync fields
