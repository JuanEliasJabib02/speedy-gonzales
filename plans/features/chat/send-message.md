# sendMessage Mutation

**Status:** review

## What it does

Convex mutation that stores a user message. The frontend then calls the Next.js API route to get the agent response.

## Checklist

- [x] Create `sendMessage` mutation in `convex/chat.ts`
- [x] Store user message in chatMessages table with role "user"
- [x] Create `saveAssistantMessage` mutation (public, called from API route)
- [x] Create `getMessages` query with `by_epic` index

## Flow

1. User types message → `useMutation(api.chat.sendMessage)` persists it
2. Frontend calls `POST /api/chat` with epicId + message
3. API route calls OpenClaw, gets response
4. API route calls `api.chat.saveAssistantMessage` to persist
5. Convex reactive query updates ChatPanel automatically

