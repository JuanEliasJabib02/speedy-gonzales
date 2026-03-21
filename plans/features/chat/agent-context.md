# Agent Context Injection

**Status:** in-progress

## What it does

Builds and sends the full project context with each chat message so the agent has everything it needs to understand and execute.

## Checklist

- [ ] Gather project data (name, repo, branch)
- [ ] Gather epic data (title, status, all tickets)
- [ ] Gather current plan content (selected ticket's plan)
- [ ] Gather chat history (last N messages for context window)
- [ ] Format context as structured payload
- [ ] Attach to each API call to OpenClaw

## Current state

Currently only sends the user's message text. No project/epic context is attached yet. This will be needed for the agent to understand which feature the user is asking about.
