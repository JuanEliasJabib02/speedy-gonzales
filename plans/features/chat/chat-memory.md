# Chat Memory (Cross-Session Context)

**Status:** review
**Priority:** medium

## What it does

The agent remembers context from past conversations — not just the last 20 messages in the current session, but key decisions, preferences, and context from previous sessions on the same feature.

## Current behavior

Each chat session sends the last 20 messages as history. When the user comes back days later, that history is gone — the agent starts fresh (though it can see the plan files).

## Two approaches

### Option A — Convex-based summary (recommended for MVP)
After each session ends (or every N messages), generate a short summary of key decisions and save it as `metadata.summary` on the epic in Convex. Inject this summary at the start of the system prompt.

```
## Previous session context
- Decided to use Tailwind for styling (2026-03-15)
- Rejected Redux in favor of Convex reactive queries
- Auth will use magic link (no passwords)
```

### Option B — OpenClaw native memory
OpenClaw already has a `MEMORY.md` system. When Charizard chats via Speedy, it could read/write to a per-project memory file on the VPS. This requires no Convex changes but ties memory to the VPS filesystem.

## Checklist

### Option A (Convex summary)
- [ ] Add `sessionSummary` field to epics table in Convex schema
- [ ] After N messages or on session end, call an API route to generate summary
- [ ] Summary generation: POST to OpenClaw with recent messages → ask for bullet-point summary
- [ ] Store summary in Convex `epics.sessionSummary`
- [ ] Inject summary into system prompt in route.ts (before tickets context)
- [ ] UI: show "Memory" indicator in chat header when summary exists

### Option B (OpenClaw MEMORY.md)
- [x] Create per-project memory file: `~/.openclaw/workspace/memory/speedy-{projectId}.md`
- [x] Update system prompt to tell Charizard to read/update this file
- [x] No Convex changes needed

## Recommendation

Start with Option B — zero infrastructure, leverages existing OpenClaw memory system.
Upgrade to Option A later when you want memory visible/editable in the Speedy UI.

## Files

- `src/app/api/chat/route.ts` — inject memory into system prompt
- `convex/schema.ts` — (Option A only) add sessionSummary field
- `convex/epics.ts` — (Option A only) mutation to update summary
