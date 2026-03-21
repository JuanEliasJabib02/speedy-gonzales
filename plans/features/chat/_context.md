# OpenClaw Chatx

**Status:** in-progress
**Priority:** high

## Overview

The right panel in the Feature View. A chat where you talk to your OpenClaw agent (Charizard) about the current feature. The agent can read plans, create tickets, modify plans, and push changes — all from the conversation.

This is NOT a generic AI chat. The backend is OpenClaw — your agent with full context, memory, and execution access.

## Architecture decisions

- **Per-feature chat** — each epic has its own isolated conversation
- **OpenAI-compatible API** — direct fetch to OpenClaw via Cloudflare Tunnel
- **SSE streaming** — real-time token-by-token responses
- **Convex persistence** — messages stored in `chat_messages` table, reactive via `useQuery`
- **Session persistence** — `user: "juan"` in request body so Charizard maintains memory
- **Next.js API route** — `/api/chat` proxies to OpenClaw (handles auth server-side)
- **Context injection** — system message includes project, epic, tickets, and plan content

## What's built

- [x] ChatPanel wired to `useSendChat` hook (queries project/epic/tickets/messages)
- [x] ChatInput as pure UI component (value/onChange/onSend props)
- [x] Auto-scroll on new messages and streaming updates
- [x] Next.js API route at `/api/chat` forwards to OpenClaw with full context
- [x] Messages persisted in Convex (chatMessages table)
- [x] Convex schema for chatMessages (epicId, role, content, metadata, createdAt)
- [x] SSE streaming with typing indicator (pulsing dots + blinking cursor)
- [x] Context injection: project name, repo, branch, epic, tickets in system message
- [x] Conversation history: last 20 messages sent with each request
- [x] Commit card parsing (parseCommitRefs) + GitHub API enrichment
- [x] Connection via Cloudflare Tunnel (configurable via env vars)
- [x] Docs: setup guide, chat memory page

## Still needs

- [ ] Enrich system message with plan SPEC format
- [ ] Chat context summary card on entry
- [ ] Render clickable links in chat messages
- [ ] Agent repo access (git push from OpenClaw)
- [ ] Add Review filter tab to ticket sidebar + inline status change UI

## Env vars (Next.js `.env.local`)

```
OPENCLAW_BASE_URL=https://<tunnel>.trycloudflare.com/v1
OPENCLAW_API_KEY=<gateway-token>
OPENCLAW_MODEL=openclaw:main
```

## Depends on

- Feature 6 (Feature View) — chat lives in the right panel
- Feature 4 (GitHub Sync) — context data comes from synced plans
