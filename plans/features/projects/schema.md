# Projects Schema & Indexes

**Status:** todo

## What it does

Define the Convex schema for the projects table. Each project maps to one GitHub repo.

## Checklist

- [ ] Create `convex/schema/projects.ts`
- [ ] Define fields: userId, name, description, repoUrl, repoOwner, repoName, plansPath, branch, lastSyncAt, timestamps
- [ ] Add index `by_user` on [userId]
- [ ] Add index `by_repo_owner_name` on [repoOwner, repoName]
- [ ] Export and register in main schema

## Schema

| Field | Type | Description |
|-------|------|-------------|
| userId | Id<"users"> | Owner |
| name | string | Project name |
| description | string (optional) | Short description |
| repoUrl | string | Full GitHub URL |
| repoOwner | string | Extracted from URL |
| repoName | string | Extracted from URL |
| plansPath | string | Default: "plans/" |
| branch | string | Default: "main" |
| lastSyncAt | number (optional) | Last sync timestamp |
