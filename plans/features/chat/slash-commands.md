# Slash Commands

**Status:** review
**Priority:** medium

## What it does

Allow the user to type `/` in the chat input to trigger a command palette with agent actions. Faster than asking in natural language.

## Commands (initial set)

- `/create-ticket` — open a mini-form to create a new ticket in the current feature
- `/update-status <ticket> <status>` — move a ticket to a new status
- `/sync` — trigger a manual GitHub sync for the current project
- `/tickets` — list all tickets for the current feature in the chat

## Checklist

- [x] Detect `/` at the start of input → show command dropdown
- [x] Filter commands as user types
- [x] On select: fill input with command template or execute directly
- [x] Implement `/create-ticket`, `/sync`, `/tickets`, `/update-status`
- [x] Add keyboard navigation (arrow keys + Enter) to the dropdown

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatInput.tsx`
- `src/hooks/useSendChat.ts`

