# Token Counter / Cost Indicator

**Status:** todo
**Priority:** low

## What it does

Show a live token count and estimated cost for the current conversation, like Cursor's context usage indicator. Helps the user understand when the context window is getting full.

## Checklist

- [ ] Track token count returned from the API response (`usage.total_tokens`)
- [ ] Store token count in Convex alongside each message
- [ ] Display running total in the chat header (e.g. `4.2k / 200k tokens`)
- [ ] Optional: show estimated cost based on model pricing
- [ ] Color indicator: green → yellow → red as context fills up

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatPanel.tsx`
- `src/app/api/chat/route.ts` (capture usage from OpenAI response)
- `convex/schema.ts` (add `tokenCount` to chatMessages if needed)
