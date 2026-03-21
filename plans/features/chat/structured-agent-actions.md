# Structured Agent Actions (JSON metadata)

**Status:** review
**Priority:** medium

## What it does

Replace the fragile text-pattern parser in ActionCard with a structured JSON format in message metadata. Makes action cards reliable regardless of how the agent phrases things.

## Current problem

ActionCard.tsx parses free text with regex looking for patterns like `✅ Ticket created:`. This is brittle — if the agent rephrases or uses different emoji, cards don't render.

## Desired behavior

The agent (OpenClaw) includes a structured JSON block in its response:

```
<actions>
[
  { "type": "ticket-created", "title": "feat/dark-mode", "detail": "todo" },
  { "type": "status-updated", "title": "wire-convex", "detail": "in-progress" }
]
</actions>
```

The API route strips the `<actions>...</actions>` block from the streamed content, parses the JSON, and saves it as `metadata.actions` in Convex. The frontend reads `metadata.actions` directly — no regex needed.

## Checklist

- [x] Define `<actions>...</actions>` XML block format in the system prompt
- [x] In `src/app/api/chat/route.ts`: strip `<actions>` block from streamed content before sending to client
- [x] Parse the JSON and save as `metadata.actions` in finalizeStreamingMessage
- [x] Update ActionCard to read from `message.metadata.actions` instead of parsing text
- [x] Keep text parser as fallback for old messages
- [x] Update system prompt in route.ts to instruct agent to use this format

## Files

- `src/app/api/chat/route.ts`
- `src/app/.../ActionCard.tsx`
- `src/app/.../ChatMessage.tsx`
