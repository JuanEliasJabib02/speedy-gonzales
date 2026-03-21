---
description: Apply when triggering a GitHub sync, editing plan files, or working with the sync engine to prevent overwriting newer local changes.
globs:
  - convex/githubSync.ts
  - plans/**/*.md
---

# Sync Safety

## The problem

The sync engine reads plan files from GitHub and writes to Convex. If you edit plans locally but don't push, then trigger a sync, the sync reads the OLD version from GitHub and overwrites Convex with stale data.

## Rules

### 1. Always push plans before syncing
If you edited any `plans/**/*.md` file in this session, you MUST commit and push before triggering or suggesting a sync:

```bash
# GOOD — push first, then sync
git add plans/
git commit -m "📝 docs: update plan statuses"
git push
# Now safe to sync

# BAD — sync without pushing
# Local plans are newer than GitHub → sync will overwrite with old data
```

### 2. Warn the user before manual sync
If the user asks to sync or test sync, always ask: "Have you pushed your latest plan changes? The sync reads from GitHub, not your local files."

### 3. After editing plans, remind to push
When you finish editing plan files, remind the user: "These changes are local only. Push to GitHub so the sync picks them up."
