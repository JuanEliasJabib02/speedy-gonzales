# Convex CRUD Endpoints for Plans

**Status:** review
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Create HTTP endpoints in Convex for creating, reading, updating, and deleting epics and tickets. These replace git `.md` files as the way plans are managed. Agents call these endpoints directly.

## Checklist

- [x] Create `POST /create-epic` endpoint in `convex/http.ts` — accepts: `repoOwner`, `repoName`, `title`, `content` (raw markdown), `priority`, `status` (default "todo"). Creates the epic in Convex and returns the epic ID. Auth: LOOP_API_KEY.
- [x] Create `POST /create-ticket` endpoint in `convex/http.ts` — accepts: `repoOwner`, `repoName`, `epicPath` (to find parent epic), `title`, `content` (raw markdown with checklist, files, patterns), `priority`, `status` (default "todo"), `sortOrder`. Creates ticket linked to epic. Auth: LOOP_API_KEY.
- [x] Create `POST /update-epic` endpoint — accepts: `repoOwner`, `repoName`, `epicPath`, `content`, `title`, `priority`. Updates existing epic content. Auth: LOOP_API_KEY.
- [x] Create `POST /update-ticket-content` endpoint — accepts: `repoOwner`, `repoName`, `ticketPath`, `content`, `title`, `priority`. Updates ticket plan content (NOT status — that's the existing endpoint). Auth: LOOP_API_KEY.
- [x] Create `GET /get-ticket-plan` endpoint — accepts: `repoOwner`, `repoName`, `ticketPath`. Returns the full ticket content as raw markdown. NO auth needed (read-only, content is not sensitive). This is what gets injected into Perro's prompt.
- [x] Create `GET /get-epic-tickets` endpoint — accepts: `repoOwner`, `repoName`, `epicPath`. Returns all tickets in the epic with their content. NO auth for reads.
- [x] Parse `checklistTotal` and `checklistCompleted` from content markdown when creating/updating tickets — count `- [ ]` and `- [x]` patterns.
- [x] Generate `path` automatically: epic path = `plans/features/{slug}`, ticket path = `plans/features/{epic-slug}/{ticket-slug}.md`. This keeps compatibility with existing Convex schema.
- [x] Generate `contentHash` from content string (simple MD5 or similar) for change detection.

## Files

- `convex/http.ts` — add new HTTP routes
- `convex/epics.ts` — add internal mutations for create/update epic
- `convex/tickets.ts` — add internal mutations for create/update ticket content
- `convex/lib/planParser.ts` — NEW: helper to extract checklist counts from markdown content

## Patterns to follow

- Reference: `convex/http.ts` → `/update-ticket-status` handler — same auth pattern, same error handling
- Reference: `convex/schema/tickets.ts` → `path` field — generate paths in same format for compatibility
