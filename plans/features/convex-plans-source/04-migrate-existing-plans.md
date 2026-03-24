# Migrate Existing Plans to Convex & Remove plans/features/

**Status:** todo
**Priority:** medium
**Agent:** Charizard 🔥

## What it does

One-time migration: read all existing `.md` plans from `plans/features/` and write them to Convex via the new endpoints. Then delete the `plans/features/` directory from the repo. After this, git repos contain ONLY code.

## Checklist

- [ ] Write a migration script (bash or node) that:
  1. Lists all epics in `plans/features/*/`
  2. For each epic: reads `_context.md`, calls `POST /create-epic`
  3. For each ticket `.md`: reads content, calls `POST /create-ticket` linked to the epic
  4. Logs success/failure for each item
- [ ] Run the migration script on speedy-gonzales repo
- [ ] Verify in Speedy UI that all epics and tickets appear with correct content
- [ ] Delete `plans/features/` directory from the repo
- [ ] Update `plans/SPEC.md` — mark it as deprecated or delete it. Plans now live in Convex.
- [ ] Remove the webhook sync code in Convex that parses `.md` files — it's no longer needed for plans (keep it only if other non-plan files still sync)
- [ ] Git commit: "chore: remove plans/features/ — plans now live in Convex"

## Files

- `scripts/migrate-plans-to-convex.sh` — NEW: one-time migration script
- `plans/features/` — DELETE entire directory after migration
- `plans/SPEC.md` — DELETE or mark deprecated
- `convex/sync/` — remove or simplify plan-parsing logic

## Patterns to follow

- Reference: the `/create-epic` and `/create-ticket` endpoints from ticket 01 of this epic
- Use the same LOOP_API_KEY auth pattern for the migration script
