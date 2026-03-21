# Upsert Logic (Epics + Tickets)

**Status:** todo

## What it does

Internal mutation that takes parsed plan data and upserts it into the epics and tickets tables. Uses content hashing to skip unchanged files.

## Checklist

- [ ] For each plan: find existing by [projectId, path] index
- [ ] If exists and hash same → skip (no change)
- [ ] If exists and hash different → update all fields
- [ ] If new → insert
- [ ] Soft-delete paths in DB but NOT in new data (removed from repo)
- [ ] Recalculate epic progress from child tickets
- [ ] Recalculate project progress from epics

## Schema

### epics table
- projectId, title, path, content, contentHash, status, priority, progress

### tickets table
- projectId, epicId, title, path, content, contentHash, status, priority, checklistProgress
