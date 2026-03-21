# syncRepo Action

**Status:** todo

## What it does

Fetches the plans/ directory from GitHub, parses each .md file, and upserts the data into Convex.

## Checklist

- [ ] Get project details (owner, name, branch, plansPath, GitHub token)
- [ ] Fetch directory tree via GitHub Trees API (recursive)
- [ ] Filter to directories/files inside plansPath
- [ ] For each .md file: fetch content via Contents API
- [ ] Parse frontmatter (title, status, priority)
- [ ] Parse checklist progress from body
- [ ] Compute SHA-256 hash for change detection
- [ ] Determine structure: root dirs = epics, nested dirs = tickets
- [ ] Call internal mutation: `upsertPlans(projectId, plans[])`
- [ ] Update `lastSyncAt` on the project

## Rate limits

GitHub API allows 5000 requests/hour with OAuth token. Optimize by only syncing changed files.
