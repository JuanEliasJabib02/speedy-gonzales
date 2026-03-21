# syncRepo Action

**Status:** todo

## What it does

Fetches the plans/features/ directory from GitHub, parses each .md file, and upserts the data into Convex.

## Checklist

- [x] Get project details (owner, name, branch, plansPath, GitHub token from env)
- [x] Fetch directory tree via GitHub Trees API (recursive)
- [x] Filter to `.md` files inside plansPath
- [x] Group files into epics using `groupFilesIntoEpics()`
- [x] Compare SHA hashes — only fetch content for changed files
- [x] Parse frontmatter with `parsePlan()` (title, status, priority, checklist)
- [x] Call `upsertPlans` internalMutation (atomic)
- [x] Update syncStatus ("syncing" → "idle" or "error")
- [x] Update `lastSyncAt` on success

## Implementation

- `convex/githubSync.ts` → `syncProject` (public action)
- `convex/githubSync.ts` → `syncRepoInternal` (internalAction, core engine)
- `convex/githubSync.ts` → `upsertPlans` (internalMutation)
- `convex/githubSync.ts` → `updateSyncStatus` (internalMutation)
