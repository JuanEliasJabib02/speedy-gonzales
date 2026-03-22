# Context Window Optimization

**Status:** todo
**Priority:** high

## Overview

Optimize token usage in each chat request to avoid hitting context limits and reduce cost. Currently every request sends ~1000 tokens of static instructions + up to 20 full messages with no length cap.

## Problems

- Static instructions (Plan File Format, ticket creation guide, Structured Actions examples) repeated on every request (~800-1000 tokens wasted)
- History: `messages.slice(-20)` with no per-message length cap — long code/response messages bloat context fast
- Ticket content sent for all tickets including `completed` ones (irrelevant)
- Active file (code view) injected with no size limit

## Tasks

- [ ] Truncate history messages to max ~600 chars each, append `[...truncated]` if exceeded
- [ ] Reduce history window from 20 to 12 messages
- [ ] Condense static instructions block to ~1/3 current size (model already knows markdown/JSON)
- [ ] Only include full content for tickets in `todo`, `in-progress`, `review` — completed tickets: title + status only
- [ ] Cap active file injection to 3000 chars max
- [ ] Add token budget comment in `route.ts` so future devs understand the budget

## Files to touch

- `app/api/chat/route.ts` — system message construction + history slice
- `hooks/useSendChat.ts` — where history is assembled before sending
