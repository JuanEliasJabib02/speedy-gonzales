# Wire NewTicketModal onSubmit

**Status:** review
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

NewTicketModal builds a prompt string and calls `onSubmit?.(prompt)`, but TicketSidebar never passes `onSubmit`. The "Create" button appears functional but does nothing. Wire it to actually create a ticket.

## Checklist

- [x] Decide on creation path: Convex action that creates a ticket `.md` in the repo via GitHub API, OR a simpler approach that creates it locally
- [x] Pass `onSubmit` callback from TicketSidebar to NewTicketModal
- [x] The callback should call a Convex mutation (e.g. `tickets.createFromPrompt`) that creates the ticket
- [x] Show loading state while creating
- [x] Close modal and refresh ticket list on success
- [x] Show error toast on failure

## Implementation notes

- Created `createTicketOnGitHub` public action in `convex/githubSync.ts` — creates the `.md` file via GitHub Contents API (PUT), then triggers a sync to pull the new ticket into Convex
- `FeatureLayout` creates the callback via `useAction(api.githubSync.createTicketOnGitHub)` and passes it through `TicketSidebar` → `NewTicketModal`
- `NewTicketModal.onSubmit` signature changed to `(args: { title, priority, description }) => Promise<void>` for proper async error handling
- Loading state: existing `isSubmitting` state in the modal
- Error feedback: inline `<p className="text-destructive">` in the modal (no toast library installed)
- On success: form resets and modal closes; ticket list refreshes automatically via Convex reactivity after sync

## Files

- `convex/githubSync.ts`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/NewTicketModal.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/TicketSidebar.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/FeatureLayout.tsx`

## Commits
- `7e96191169f39dbe9d7b6a874e2a77efa47adf72`
