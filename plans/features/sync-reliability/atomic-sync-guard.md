# Make Sync Guard Atomic

**Status:** in-progress
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

The current sync guard reads `project.syncStatus`, checks if it's "syncing", then sets it in a separate mutation. Two concurrent webhook calls can both pass the guard. Fix: use a single mutation that atomically checks and sets.

## Checklist

- [ ] Create an internal mutation `claimSyncLock` that reads `syncStatus`, returns false if already "syncing", otherwise sets it to "syncing" and returns true
- [ ] Replace the current read-check-set pattern in `syncRepoInternal` with a call to `claimSyncLock`
- [ ] Ensure `syncStatus` is reset to "idle" in both success and error paths (finally block)
- [ ] Add a timeout: if `syncStatus` is "syncing" for >5 minutes, allow re-claiming (stale lock protection)

## Files

- `convex/githubSync.ts`
