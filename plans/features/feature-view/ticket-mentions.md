# Ticket Mentions with #

**Status:** review
**Priority:** medium

## What it does

Type `#` in the chat input to autocomplete ticket names. The mentioned ticket's content is automatically included as extra context in the request to the agent.

## Checklist

- [ ] Detect `#` in input → show ticket autocomplete dropdown
- [ ] Filter tickets by name as user types after `#`
- [ ] On select: insert `#ticket-name` as a mention chip in the input
- [ ] When sending: fetch the full ticket content for each mentioned ticket
- [ ] Append mentioned ticket content to the system message or user message context
- [ ] Render `#ticket-name` as a styled chip/badge in the sent message

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatInput.tsx`
- `src/hooks/useSendChat.ts`

