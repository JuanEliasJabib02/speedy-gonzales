# Create Ticket from UI

**Status:** completed
**Priority:** high

## What it does

Add a "+ New Ticket" button in the feature sidebar that opens a mini-form to create a ticket without touching git manually. The agent (Charizard via OpenClaw) creates the markdown file and pushes to the repo — Convex auto-syncs the new ticket.

## UX

- Small `+` icon button or `+ New Ticket` text button in the sidebar header (next to search or below the Overview/Roadmap row)
- Opens a simple Dialog/Sheet:
  - **Title** (required text input)
  - **Priority** (select: low / medium / high / critical)
  - **Description** (optional textarea — becomes the body of the ticket)
  - Submit button: "Create Ticket"
- On submit: sends a message to the chat asking Charizard to create the ticket file in git
- OR: calls a Convex action that calls the OpenClaw API to create the file directly

## Approach (recommended)

Use the existing `/api/chat` route to send a structured message to Charizard:

```
Create a new ticket for the current feature:
Title: {title}
Priority: {priority}
Description: {description}

Create the file at plans/features/{epic-slug}/{ticket-slug}.md following the SPEC format, commit it, and push.
```

Charizard handles the file creation + push. The webhook triggers auto-sync. The ticket appears in the sidebar automatically.

## Checklist

- [x] Add `+` button to `TicketSidebar` header area
- [x] Create `NewTicketModal.tsx` with shadcn/ui Dialog
- [x] Form: title (required), priority (select), description (optional textarea)
- [x] On submit: sends structured prompt to chat via `sendDirect`
- [x] Show a loading/pending state while agent creates the ticket
- [x] After creation: the webhook fires and the ticket appears in the list automatically

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/NewTicketModal.tsx` (new)
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/TicketSidebar.tsx`
