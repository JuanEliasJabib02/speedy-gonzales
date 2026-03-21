# OpenClaw Chat

**Status:** in-progress
**Priority:** medium

## Overview

The right panel in the Feature View. A chat where you talk to your OpenClaw agent (Charizard) about the current feature. The agent can read plans, create tickets, modify plans, and push changes — all from the conversation.

This is NOT a generic AI chat. The backend is OpenClaw — your agent with full context, memory, and execution access.

## Architecture decisions

- **Per-feature chat** — each epic has its own isolated conversation
- **Vercel AI SDK** — `createOpenAI` from `@ai-sdk/openai` pointing to OpenClaw server
- **SSE streaming** — `streamText()` with `stream: true` for real-time responses (future)
- **Convex persistence** — messages stored in `chat_messages` table, reactive via `useQuery`
- **Session persistence** — `user: "juan"` in request body so Charizard maintains memory
- **Next.js API route** — `/api/chat` proxies to OpenClaw (handles auth server-side)

## What's built

- [x] ChatPanel wired to `useQuery(api.chat.getMessages)`
- [x] ChatInput sends messages via `useMutation(api.chat.sendMessage)`
- [x] Auto-scroll on new messages
- [x] Next.js API route at `/api/chat` forwards to OpenClaw
- [x] Messages persisted in Convex (chatMessages table)
- [x] Convex schema for chatMessages (epicId, role, content, metadata, createdAt)
- [x] "connected" badge replaces "coming soon"

## Still needs

- [ ] Set `OPENCLAW_SERVER_URL` and `OPENCLAW_GATEWAY_TOKEN` env vars
- [ ] SSE streaming (currently uses non-streaming request)
- [ ] Typing indicator while agent responds
- [ ] Agent context injection (project/epic/plan data)
- [ ] Handle commit messages from agent responses

## Env vars (Next.js `.env.local`)

```
OPENCLAW_SERVER_URL=https://<openclaw-server>/v1
OPENCLAW_GATEWAY_TOKEN=<gateway-token>
```

## Depends on

- Feature 6 (Feature View) — chat lives in the right panel ✅
- Feature 4 (GitHub Sync) — context data comes from synced plans ✅
