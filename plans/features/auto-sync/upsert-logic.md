# Upsert Logic (Epics + Tickets)

**Status:** todo
**Priority:** medium

## What it does

Internal mutation that takes parsed plan data and upserts it into the epics and tickets tables. Uses content hashing to skip unchanged files.

## Checklist

- [x] For each plan: find existing by `[projectId, path]` index
- [x] If exists and hash same → skip (no change)
- [x] If exists and hash different → update all fields
- [x] If new → insert
- [x] Soft-delete paths in DB but NOT in new data (removed from repo)
- [x] Track ticket count per epic
