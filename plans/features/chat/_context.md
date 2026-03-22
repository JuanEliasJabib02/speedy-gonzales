# OpenClaw Chatx

**Status:** in-progress
**Priority:** high

## Overview

The right panel in the Feature View. Not a generic AI chat — a **super-chat** wired directly to your OpenClaw agent (Charizard) with full awareness of the current feature: its epic, tickets, plan content, connected repo, and active file. Charizard can read plans, create tickets, modify plans, push changes, and report what it did — all from the conversation.

The backend is OpenClaw running on your VPS. The chat is the primary interface for interacting with the agent on a per-feature basis.

## Architecture decisions

- **Per-feature chat** — each epic has its own isolated conversation history stored in Convex
- **OpenAI-compatible API** — direct SSE fetch to OpenClaw via Cloudflare Tunnel (`POST /v1/chat/completions`)
- **SSE streaming** — real-time token-by-token rendering with pulsing dots → blinking cursor
- **Convex persistence** — messages stored in `chatMessages` table, reactive via `useQuery`
- **Session persistence** — `user: "juan"` in request body so Charizard maintains cross-session memory
- **Next.js API route** — `/api/chat` proxies to OpenClaw (keeps auth server-side)
- **Context injection** — system message includes project, repo, branch, epic, ticket list + status, plan content (truncated), and active file if open in code view
- **History windowing** — last 12 messages sent as conversation history (truncated to 600 chars each) to stay within context limits
- **Orphan cleanup** — on mount, streaming messages left by a previous page load are marked as interrupted
- **Draft persistence** — input value auto-saved to localStorage (debounced 300ms), restored on return, expires after 24h
- **Message queue** — while a response is streaming, new sends are queued; processed automatically after the current stream finishes
- **Abort/stop** — AbortController cancels the fetch mid-stream; partial content is saved and marked as interrupted in Convex

## What's built

### Core chat
- [x] ChatPanel wired to `useSendChat` hook (queries project/epic/tickets/messages)
- [x] ChatInput as controlled component (value/onChange/onSend/onStop props)
- [x] SSE streaming with pulsing typing indicator and blinking cursor
- [x] ChatGPT-style incremental rendering (tokens appear as they arrive)
- [x] Auto-scroll: stays at bottom while streaming, scroll-to-bottom button appears when scrolled up
- [x] Stop button — cancels in-flight stream via AbortController; saves partial response marked `isInterrupted`
- [x] Retry button — per-message retry on hover (re-runs the preceding user message)
- [x] Stream reconnect — orphaned streaming messages detected on page reload and marked interrupted

### Persistence & context
- [x] Messages persisted in Convex (`chatMessages` table: epicId, role, content, metadata, createdAt, isStreaming, isInterrupted, tokenCount)
- [x] Conversation history: last 12 messages sent with each request (windowed + truncated for context efficiency)
- [x] Context injection: project name, repo, branch, epic title/status/priority/content, ticket list with status, active file content
- [x] Context window optimization: history truncation, ticket content capped at 500 chars, epic content at 2000 chars
- [x] Chat input persistence: draft saved to localStorage, restored on next visit, expires 24h
- [x] Chat pagination: "load earlier messages" toggle (recent 50 vs all messages)

### Input UX
- [x] Multi-message queue: send while streaming, messages queue and process sequentially (Slack-style)
- [x] Queue status indicator: shows count of queued messages with spinner
- [x] Paste image upload: Ctrl+V screenshots upload to Convex file storage, inline preview with remove button (max 4)
- [x] Ticket mentions with `#`: type `#` to open a searchable dropdown filtered by ticket title and slug; inserts `#slug` into input; highlights mentions as pills in sent messages
- [x] Slash commands: type `/` to open command palette (`/create-ticket`, `/sync`, `/tickets`, `/update-status`)
- [x] Active file pill: when a file is open in code view, its path appears as a dismissible pill above the input; file content injected into context

### Message rendering
- [x] Full markdown renderer in agent messages (headings, lists, tables, blockquotes, code blocks with syntax highlighting, inline code)
- [x] Syntax highlighting in code blocks
- [x] Clickable links in agent messages (rendered as `<a>` with target blank)
- [x] GitHub link preview cards: auto-extracts GitHub URLs from agent messages and shows enriched preview cards
- [x] Commit cards: parses commit refs from agent messages, renders branded GitHub/Bitbucket cards with hash, message, files changed
- [x] View diff button on GitHub commit cards — opens CommitDiffPanel with full file diffs
- [x] Agent action cards: structured `<actions>[...]</actions>` JSON in agent response rendered as visual cards (ticket-created, status-updated, sync-triggered)
- [x] Interrupted response banner with amber warning and retry button
- [x] User messages render `#ticket-slug` as highlighted pills

### Header / tooling
- [x] View mode toggle (Plan / Code) in chat header
- [x] Connection status dot
- [x] Token counter: shows `Xk / 200k tokens` with color-coded dot (green/yellow/red); hidden until there are messages with tokenCount
- [x] Export conversation: downloads full chat as a `.md` file named `chat-{epic-slug}-{date}.md`
- [x] Theme toggle (dark/light)

### Entry & discovery
- [x] Context summary card: shown at the top of messages, displays epic title, status, and ticket progress (N pending / total)
- [x] Roadmap modal: view all features and their status at a glance
- [x] Overview modal: feature description and plan overview on demand
- [x] Command palette file search (Cmd+P): fuzzy search files in the repo, opens them in code view

### Agent actions (full loop)
- [x] Charizard can create tickets, update statuses, sync the project — directly from chat
- [x] Structured action cards rendered after each response when actions were taken
- [x] Agent repo push: Charizard has git access to the repo on the VPS; pushes plan changes, GitHub webhook triggers Convex sync, ticket appears live
- [x] Chat memory: cross-session context via OpenClaw memory files on the VPS

## Still needs

- [ ] Context architecture docs (developer reference)
- [ ] OpenClaw API Integration docs / env setup guide update
- [ ] Token counter: needs real token count from OpenClaw response (currently estimated from char count)

## Env vars (Next.js `.env.local`)

```
OPENCLAW_BASE_URL=https://<tunnel>.trycloudflare.com/v1
OPENCLAW_API_KEY=<gateway-token>
OPENCLAW_MODEL=openclaw:main
```

## Depends on

- Feature 6 (Feature View) — chat lives in the right panel
- Feature 4 (GitHub Sync) — context data comes from synced plans
