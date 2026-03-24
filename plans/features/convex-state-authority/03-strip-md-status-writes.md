# Stop Writing Status to .md Files

**Status:** todo
**Priority:** medium
**Agent:** Charizard 🔥

## What it does

Update the webhook sync parser to stop reading status from `.md` files. Status comes ONLY from Convex (via the `/update-ticket-status` endpoint). The `.md` parser still reads: title, priority, checklist items, content, files, patterns — everything EXCEPT status.

## Checklist

- [ ] Update `convex/sync/parser.ts` (or wherever `.md` parsing happens) — when syncing from GitHub webhook, do NOT overwrite ticket/epic status from `.md` content. If a ticket already exists in Convex, preserve its current status. Only set status from `.md` for NEW tickets (first sync = `todo`)
- [ ] Update `convex/sync/parser.ts` — for epics, never read status from `_context.md`. Epic status is always auto-calculated from tickets (ticket 01)
- [ ] Update `convex/sync/parser.ts` — still read and sync: title, priority, content, contentHash, checklistTotal, checklistCompleted (from `[x]` counts), path, sortOrder
- [ ] Verify: pushing a `.md` with `**Status:** completed` does NOT change the Convex status if it's already `in-progress`

## Files

- `convex/sync/parser.ts` (or equivalent sync file) — modify to skip status field on existing tickets/epics

## Patterns to follow

- Reference: find the sync/parser by searching `grep -r "contentHash\|parseMarkdown\|parsePlan" convex/` — that's where `.md` files get parsed into Convex records
