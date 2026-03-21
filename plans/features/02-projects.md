# Feature 2: Projects

**Status:** todo
**Phase:** 1

## What it does

The user can create, view, edit, and delete projects. **Each project has exactly one GitHub repo** — one project, one repo. A project represents a product or application being built.

## How projects get loaded

The ideal flow is: OpenClaw has a config file (in a dedicated repo or a known path) that lists all projects and their repos. Speedy Gonzales reads this config and shows the projects automatically — zero manual setup in the web app.

**Fallback for MVP:** Manual project creation from the UI. User types a name, description, and pastes repo URLs. This works without OpenClaw being configured.

Both paths converge: projects end up in the Convex DB either way.

## Project data

- **Name** — displayed in dashboard and header
- **Description** — short summary shown on cards
- **Repo URL** — the single GitHub repo (e.g., `github.com/user/repo`)
- **Plans path** — where plans live in the repo (default: `plans/`)
- **Branch** — branch to track (default: `main`)
- **Progress** — calculated automatically: average of all feature progress percentages

## Schema

### projects table

Since each project = one repo, we merge them into a single table:

| Field | Type | Description |
|-------|------|-------------|
| userId | Id<"users"> | Owner |
| name | string | Project name |
| description | string (optional) | Short description |
| repoUrl | string | Full GitHub URL |
| repoOwner | string | GitHub owner (extracted from URL) |
| repoName | string | GitHub repo name (extracted from URL) |
| plansPath | string | Path to plans folder (default: "plans/") |
| branch | string | Branch to track (default: "main") |
| webhookId | string (optional) | GitHub webhook ID (set in Phase 2) |
| webhookSecret | string (optional) | HMAC secret (set in Phase 2) |
| lastSyncAt | number (optional) | Last successful sync timestamp |
| createdAt | number | Timestamp |
| updatedAt | number | Timestamp |

Index: `by_user` → `[userId]`
Index: `by_repo_owner_name` → `[repoOwner, repoName]` (for webhook lookup)

## Backend functions

- `createProject(name, description, repoUrl, plansPath?, branch?)` → creates project with its repo
- `getProjects()` → returns all projects for current user
- `getProject(projectId)` → returns single project
- `updateProject(projectId, name?, description?)` → updates project fields
- `deleteProject(projectId)` → deletes project and all its synced data (epics, tickets)

## Frontend

- Dashboard page: grid of project cards (name, description, progress bar)
- "Create project" dialog: name + description + repo URL inputs

## Depends on

- Feature 1 (Auth) — needs authenticated user

## Blocks

- Feature 4 (GitHub Sync) — needs repos linked to sync
- Feature 3 (Dashboard) — needs projects to display
