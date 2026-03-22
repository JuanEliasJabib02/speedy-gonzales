# Context Window Optimization

**Status:** review
**Priority:** high

## Overview

Optimize token usage in each chat request to avoid hitting context limits and reduce cost.

## What's built (from commit a41dfcd)

- History window reduced: 20 → 12 messages
- Per-message truncation: messages capped at ~600 chars with `[...truncated]` suffix
- Static instructions condensed in system message
- Active file injection capped at 3000 chars
- Completed tickets filtered to title+status only (non-completed tickets get full content)

## Remaining / to validate

- [ ] Verify `route.ts` has token budget comment for future devs
- [ ] Measure actual token reduction vs previous baseline
- [ ] Confirm completed ticket filtering is working correctly in production

## Files touched

- `app/api/chat/route.ts` — system message construction + history slice
- `hooks/useSendChat.ts` — history assembly before sending
