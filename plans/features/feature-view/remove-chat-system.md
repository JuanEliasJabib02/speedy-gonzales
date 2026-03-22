# Remove Chat System

**Status:** completed
**Priority:** high

## What it does

Delete the entire chat system from Speedy. The chat is redundant — all agent interaction happens via Telegram. Remove all chat components, hooks, API routes, and Convex schema. Keep memory files (used from Telegram) and CommitDiffPanel (reused by commit timeline).

## Delete

- [ ] `src/app/api/chat/route.ts` — API route
- [ ] All chat components: ChatPanel, ChatInput, ChatMessage, ChatThinkingBubble, etc.
- [ ] `useSendChat` hook and any chat-related hooks
- [ ] Chat-related helpers (actions filter, commit enrichment in route.ts)
- [ ] `chatMessages` table from Convex schema
- [ ] Chat Convex functions (saveAssistantMessage, createStreamingMessage, finalizeStreamingMessage, etc.)
- [ ] Slash commands system
- [ ] Token counter component
- [ ] Export conversation feature
- [ ] Queue status indicator
- [ ] Paste image upload (chat-only feature)
- [ ] Ticket mentions with # (chat-only feature)
- [ ] Context bridge (chat ↔ code viewer injection)
- [ ] Context summary card, roadmap modal, overview modal (chat entry points)
- [ ] Draft persistence (localStorage for chat input)
- [ ] Stream reconnect / orphan cleanup logic

## Also delete (code viewer — no longer needed)

- [ ] FileTree component
- [ ] FileViewer component
- [ ] CodeView component
- [ ] syntax-highlighting component (CommitDiffPanel doesn't use it)

## Keep

- [ ] `memory/speedy-*.md` files — agent memory, used from Telegram
- [ ] CommitDiffPanel — reused by commit timeline
- [ ] GitHub API helpers — reused by commit timeline

## Checklist

- [ ] Delete all chat files listed above
- [ ] Remove chatMessages from Convex schema
- [ ] Remove chat Convex functions
- [ ] Remove OPENCLAW env vars from Vercel (no longer needed)
- [ ] Clean up imports and references
- [ ] Verify build passes after removal
