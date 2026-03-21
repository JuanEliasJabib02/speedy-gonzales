# Slash Commands

**Status:** todo
**Priority:** medium

## What it does

Allow the user to type `/` in the chat input to trigger a command palette with agent actions. Faster than asking in natural language.

## Commands (initial set)

- `/create-ticket` — open a mini-form to create a new ticket in the current feature
- `/update-status <ticket> <status>` — move a ticket to a new status
- `/sync` — trigger a manual GitHub sync for the current project
- `/tickets` — list all tickets for the current feature in the chat

## Checklist

- [ ] Detect `/` at the start of input → show command dropdown
- [ ] Filter commands as user types
- [ ] On select: fill input with command template or execute directly
- [ ] Implement `/create-ticket`, `/sync`, `/tickets` first
- [ ] Add keyboard navigation (arrow keys + Enter) to the dropdown

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatInput.tsx`
- `src/hooks/useSendChat.ts`
