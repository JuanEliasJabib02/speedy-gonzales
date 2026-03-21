---
description: Apply when writing Convex actions/mutations that can be triggered by users (buttons, webhooks, scheduled jobs) to prevent race conditions and data corruption.
globs:
  - convex/**/*.ts
---

# Concurrency Safety

## Why race conditions happen in Convex

Convex actions run in separate processes. If a user clicks a button twice, or a webhook fires while a manual sync is running, **two actions execute in parallel** — each reading stale state, making decisions based on outdated data, and overwriting each other's results.

Mutations are transactional (atomic), but actions are NOT. An action that calls multiple mutations can interleave with another action's mutations.

## Rules

### 1. Guard long-running actions with a status check
Before doing work, query the current status. If another instance is already running, return early:

```typescript
// GOOD — guard at the top of the action
const project = await ctx.runQuery(internal.projects.get, { projectId })
if (project.syncStatus === "syncing") return

await ctx.runMutation(internal.setStatus, { status: "syncing" })
// ... do work
```

```typescript
// BAD — no guard, two clicks = two parallel syncs
await ctx.runMutation(internal.setStatus, { status: "syncing" })
// ... race condition if another sync is already running
```

### 2. Always update relational fields, not just content
When upserting records that reference other records (e.g., ticket → epic), always check if the **relationship changed**, not just the content hash:

```typescript
// GOOD — checks all dimensions of change
const contentChanged = existing.contentHash !== newData.contentHash
const movedParent = existing.parentId !== newParentId
const orderChanged = existing.sortOrder !== newData.sortOrder

if (contentChanged || movedParent || orderChanged) {
  await ctx.db.patch(existing._id, { ...newData, parentId: newParentId })
}
```

```typescript
// BAD — only checks content, ignores moves and reordering
if (existing.contentHash !== newData.contentHash) {
  await ctx.db.patch(existing._id, { ...newData })
}
```

### 3. Update computed fields (counts, aggregates) even when content is unchanged
If a parent stores a count of its children (e.g., `ticketCount`), always recalculate it — children can be added/removed without the parent's content changing.

### 4. Disable the trigger on the frontend while the action runs
Use the status field to disable buttons and prevent double-triggers:

```typescript
const isSyncing = project.syncStatus === "syncing"
<Button disabled={isSyncing} onClick={handleSync}>
  {isSyncing ? <Spinner /> : "Sync now"}
</Button>
```

### 5. Checklist for new user-triggered actions
- [ ] Is there a status guard at the top of the action?
- [ ] Are relational fields (foreign keys) updated on every sync, not just on content change?
- [ ] Are computed/aggregate fields recalculated?
- [ ] Is the UI button disabled while the action runs?
- [ ] If the action fails, does it reset the status to "error" or "idle"?
