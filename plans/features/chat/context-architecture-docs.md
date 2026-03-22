# Context Architecture Docs

**Status:** todo
**Priority:** medium

## Overview

Document how the chat context works — what gets injected, token budgets, how history is managed, and why. This is critical for future contributors to understand the constraints and not accidentally bloat the context.

## What to document

- The full request structure (system message → history → user message)
- What each block in the system message contains and its approximate token cost
- Token budget targets per block
- How history is truncated (length cap, message count)
- Why completed tickets are excluded from full content
- How the active file (code view) is injected and capped
- Pagination strategy for chat history (load-last-30)

## Where to add docs

- `docs/chat-context.md` — new file with full architecture explanation
- Update `docs/setup.md` or existing chat docs with a reference to context architecture
- Add inline comments in `app/api/chat/route.ts` with token budget breakdown

## Tasks

- [ ] Write `docs/chat-context.md` covering all the above
- [ ] Add token budget comments in `route.ts`
- [ ] Link from main README or docs index
