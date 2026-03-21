# Feature 4: GitHub Sync

**Status:** todo
**Phase:** 2

## What it does

Reads `plans/` from linked GitHub repos, parses the `.md` files, and stores the data in Convex. Keeps everything in sync via webhooks — when someone pushes to the repo, the app detects it and updates automatically.

This is the **core engine** of Speedy Gonzales. Without it, there's nothing to show.

## How it works

```
Push to repo
    │
    ▼
GitHub sends webhook POST to Convex HTTP endpoint
    │
    ▼
Verify signature → check if changed files are in plans/
    │
    ▼
Sync action: fetch plans/ tree via GitHub API
    │
    ▼
For each PLAN.md: parse frontmatter → compute hash → upsert in DB
    │
    ▼
Recalculate progress → UI updates in real-time
```

## GitHub authentication

The user connects their GitHub account via OAuth. We store the access token and use it for all API calls.

**Scopes needed:** `repo` (read contents), `admin:repo_hook` (create webhooks), `read:user` (username)

**OAuth flow:**
1. User clicks "Connect GitHub" in settings
2. Redirect to GitHub OAuth
3. Callback stores token in users table
4. Now we can read repos, create webhooks, commit changes

## Webhook registration

When a repo is linked to a project:
1. Generate a random `webhookSecret` (for HMAC verification)
2. POST to GitHub API: create webhook on the repo
3. Store `webhookId` and `webhookSecret` in the `repos` table

Webhook config:
- URL: `https://<convex-deployment>.convex.site/github-webhook`
- Events: `push` only
- Content type: `application/json`

## Webhook handler

```
POST /github-webhook
  │
  ├─ 1. Verify HMAC-SHA256 signature using webhookSecret
  ├─ 2. Extract repo owner/name from payload
  ├─ 3. Look up repo in DB by [owner, name] index
  ├─ 4. Check if any changed files are inside plansPath
  │     └─ If none → return 200, skip (optimization)
  └─ 5. Schedule internal action: syncRepo(repoId)
```

## Sync action

```
syncRepo(repoId):
  │
  ├─ 1. Get repo details (owner, name, branch, plansPath, user's GitHub token)
  ├─ 2. Fetch directory tree via GitHub Trees API (recursive)
  ├─ 3. Filter to directories that contain PLAN.md
  ├─ 4. For each PLAN.md:
  │     ├─ Fetch file content via Contents API
  │     ├─ Parse frontmatter (title, status, priority)
  │     ├─ Parse checklist progress from body
  │     └─ Compute SHA-256 hash of content
  ├─ 5. Determine structure:
  │     ├─ Root-level plan dirs → epics
  │     └─ Nested plan dirs → tickets (child of parent epic)
  └─ 6. Call internal mutation: upsertPlans(repoId, plans[])
```

## Upsert logic

```
upsertPlans(repoId, plans[]):
  │
  ├─ For each plan:
  │   ├─ Find existing by [repoId, path] index
  │   ├─ If exists and hash same → skip (no change)
  │   ├─ If exists and hash different → update all fields
  │   └─ If new → insert
  ├─ For paths in DB but NOT in new data → soft-delete (removed from repo)
  ├─ Recalculate each epic's progress from its tickets
  └─ Recalculate project progress from its epics
```

## Frontmatter parser

Runs inside Convex (no external deps). Simple regex-based:

```typescript
function parseFrontmatter(raw: string): { metadata: PlanMetadata; body: string }
function parseChecklistProgress(body: string): number
```

Located at: `convex/model/parsePlan.ts`

## Schema

### epics table

| Field | Type | Description |
|-------|------|-------------|
| projectId | Id<"projects"> | Parent project (project = repo) |
| title | string | From frontmatter |
| path | string | e.g., "plans/auth" |
| content | string | Raw markdown |
| contentHash | string | SHA-256 for change detection |
| status | string | From frontmatter |
| priority | string | From frontmatter |
| progress | number | Calculated from child tickets |
| createdAt | number | Timestamp |
| updatedAt | number | Timestamp |

Indexes: `by_project_path` → `[projectId, path]`, `by_project` → `[projectId]`

### tickets table

| Field | Type | Description |
|-------|------|-------------|
| projectId | Id<"projects"> | Parent project (project = repo) |
| epicId | Id<"epics"> | Parent feature |
| title | string | From frontmatter |
| path | string | e.g., "plans/auth/login" |
| content | string | Raw markdown |
| contentHash | string | SHA-256 |
| status | string | From frontmatter |
| priority | string | From frontmatter |
| checklistProgress | number | Calculated from checkboxes |
| kanbanOrder | number (optional) | For ordering in UI |
| createdAt | number | Timestamp |
| updatedAt | number | Timestamp |

Indexes: `by_project_path` → `[projectId, path]`, `by_epic` → `[epicId]`, `by_project_status` → `[projectId, status]`

## Manual sync fallback

A "Sync now" button in the project view triggers the sync action manually. Useful when:
- Webhook delivery failed
- First-time setup before webhook is registered
- Debugging

## Rate limits

GitHub API allows 5000 requests/hour with OAuth token. Optimization: only sync files that changed (check push payload's `commits[].modified/added/removed` lists).

## Depends on

- Feature 2 (Projects) — needs repos linked

## Blocks

- Feature 5 (Kanban) — needs epics to display as cards
- Feature 6 (Feature View) — needs tickets to display in sidebar
