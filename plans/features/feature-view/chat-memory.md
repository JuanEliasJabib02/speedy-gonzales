# Chat Memory (Cross-Session Context)

**Status:** completed
**Priority:** medium

## What it does

The agent (Charizard) remembers context from past conversations across sessions — not just the current window, but key decisions, preferences, and context built up over time on the same project.

## How it works (implemented)

Uses **Option B — OpenClaw native memory**. Each time Charizard chats via Speedy, it reads and writes to a per-project memory file on the VPS:

```
~/.openclaw/workspace/memory/speedy-{projectId}.md
```

The system prompt in `route.ts` tells Charizard to consult and update this file. No Convex changes needed. Zero infrastructure overhead.

This is not a separate feature — it's a core capability of the super-chat. Memory persists across page reloads, browser sessions, and days between conversations.

## Checklist

- [x] Create per-project memory file: `~/.openclaw/workspace/memory/speedy-{projectId}.md`
- [x] Update system prompt to tell Charizard to read/update this file
- [x] No Convex changes needed

## Files

- `src/app/api/chat/route.ts` — injects memory context into system prompt
- `~/.openclaw/workspace/memory/speedy-speedy-gonzales.md` — active memory file for this project
