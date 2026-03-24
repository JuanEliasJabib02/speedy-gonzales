# Update create-feature Skill — Write to Convex

**Status:** todo
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Update the `create-feature` skill in Charizard's workspace so it writes plans directly to Convex instead of creating `.md` files in git. The skill still follows all 3 gates (discuss, research, quality check) but the output goes to Convex HTTP endpoints instead of files.

## Checklist

- [ ] Update `~/.openclaw/workspace/skills/create-feature/SKILL.md` — replace all file creation steps with Convex API calls:
  - Instead of `mkdir + write _context.md` → `POST /create-epic` with title + content
  - Instead of `write ticket.md` → `POST /create-ticket` with title + content + sortOrder
- [ ] Remove git commit/push steps for plan files — plans no longer go through git
- [ ] Keep Gate 1 (discuss), Gate 2 (quality check), Gate 3 (UI contracts) — these still happen, just the OUTPUT changes
- [ ] Keep codebase research phase — Charizard still reads the repo to write good plans
- [ ] Update the skill to use `web_fetch` or `exec curl` for the Convex endpoints
- [ ] The `content` field sent to Convex should be the full ticket markdown (checklist, files, patterns, UI contract) as a raw string — same format as before, just stored in Convex instead of a file

## Files

- `~/.openclaw/workspace/skills/create-feature/SKILL.md` — rewrite output steps
- `~/.openclaw/workspace/skills/create-ticket/SKILL.md` — rewrite to use Convex endpoint

## Patterns to follow

- Reference: current `create-feature/SKILL.md` — keep all gates, change only the output mechanism
- Reference: `/update-ticket-status` curl pattern — same auth header, same JSON body format
