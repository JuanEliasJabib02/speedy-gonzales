# Agent Context Injection

**Status:** todo

## What it does

Builds and sends the full project context with each chat message so the agent has everything it needs to understand and execute.

## Checklist

- [ ] Gather project data (name, repo, branch)
- [ ] Gather epic data (title, status, all tickets)
- [ ] Gather current plan content (selected ticket's PLAN.md)
- [ ] Gather chat history (last N messages for context window)
- [ ] Format context as structured payload
- [ ] Attach to each API call to OpenClaw

## Context structure

The agent should know:
- Which project (repo URL, branch)
- Which feature (epic title, status)
- Which ticket is being viewed
- The full plan content
- Recent conversation history
