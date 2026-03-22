# Agent Context Injection

**Status:** completed
**Priority:** medium

## What it does

Builds and sends the full project context with each chat message so the agent has everything it needs to understand and execute.

## Checklist

- [x] Gather project data (name, repo, branch)
- [x] Gather epic data (title, status, all tickets)
- [x] Gather current plan content (selected ticket's plan)
- [x] Gather chat history (last N messages for context window)
- [x] Format context as structured payload
- [x] Attach to each API call to OpenClaw

## Implementation

Context injection is implemented in `useSendChat.ts`:
- `useQuery(api.projects.getProject)` fetches project (name, repoOwner, repoName, branch)
- `useQuery(api.epics.getEpic)` fetches epic (title, status, priority, content)
- `useQuery(api.tickets.getByEpic)` fetches all tickets (title, status, content)
- `buildContext()` assembles the `ChatContext` payload (epic content capped at 2000 chars, ticket content at 500)
- `buildHistory()` sends last 20 messages as conversation history
- `streamResponse()` passes both `context` and `history` in the fetch body to `/api/chat`

The API route (`src/app/api/chat/route.ts`) uses `buildSystemMessage(context)` to inject project/epic/ticket data as a system prompt, and appends history + the user message.

