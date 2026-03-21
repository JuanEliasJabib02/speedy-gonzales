# Enrich System Message with Plan SPEC

**Status:** completed
**Priority:** high

## What it does

Add the plan SPEC format to the system message so the OpenClaw agent knows how to write valid plan files when modifying the repo. Without this, the agent might produce markdown that the sync parser can't read.

## Checklist

- [ ] Summarize SPEC.md into a concise block (directory structure, file formats, allowed values)
- [ ] Add to `buildSystemMessage()` in `src/app/api/chat/route.ts`
- [ ] Include: `_context.md` format, ticket `.md` format, status/priority values
- [ ] Include: kebab-case naming, checklist format (`- [x]` / `- [ ]`)
- [ ] Keep it under 500 tokens — just the rules, not the full SPEC
- [ ] Test: ask agent to create a ticket and verify the output matches SPEC

## Files

- `src/app/api/chat/route.ts`
- `plans/SPEC.md` (reference)

