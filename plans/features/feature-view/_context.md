# Feature View

**Status:** in-progress
**Priority:** high

## Overview

The core screen of Speedy Gonzales — a three-panel workspace where you manage a feature end-to-end:

- **Left:** Ticket sidebar — browse and filter tickets like a wiki
- **Center:** Plan viewer — read the selected plan rendered as formatted HTML
- **Right:** Chat + Code — talk to your OpenClaw agent (Charizard) or browse the repo

You enter here by clicking a feature card from the kanban. The app sidebar is hidden on this route to maximize screen space.

## Architecture decisions

- **Per-feature chat** — each epic has its own isolated conversation history stored in Convex
- **OpenAI-compatible API** — direct SSE fetch to OpenClaw via Cloudflare Tunnel (`POST /v1/chat/completions`)
- **SSE streaming** — real-time token-by-token rendering with pulsing dots and blinking cursor
- **Convex persistence** — messages stored in `chatMessages` table, reactive via `useQuery`
- **Session persistence** — `user: "juan"` in request body so Charizard maintains cross-session memory
- **Next.js API route** — `/api/chat` proxies to OpenClaw (keeps auth server-side)
- **Context injection** — system message includes project, repo, branch, epic, ticket list + status, plan content (truncated), and active file if open in code view
- **History windowing** — last 12 messages sent as conversation history (truncated to 600 chars each) to stay within context limits
- **Orphan cleanup** — on mount, streaming messages left by a previous page load are marked as interrupted
- **Draft persistence** — input value auto-saved to localStorage (debounced 300ms), restored on return, expires after 24h
- **Message queue** — while a response is streaming, new sends are queued; processed automatically after the current stream finishes
- **Abort/stop** — AbortController cancels the fetch mid-stream; partial content is saved and marked as interrupted in Convex
- **Code viewer** — GitHub Trees/Blob API, syntax highlighting via `react-syntax-highlighter`, context bridge injects viewed file into chat

## What's built

### Layout
- [x] Three-panel FeatureLayout with flex, full viewport height
- [x] App sidebar hidden when on `/features/` routes (layout.tsx)
- [x] Resizable chat panel (320-700px) with drag handle (ResizeHandle component)

### Ticket sidebar (left panel)
- [x] TicketSidebar (280px): back arrow, FileText icon, epic title
- [x] Git branch indicator (GitBranch icon + monospace branch name)
- [x] Search bar to filter tickets by title
- [x] Ticket list with TicketItem components, status dots, active highlight

### Plan viewer (center panel)
- [x] PlanViewer: title, status/priority badges
- [x] ChecklistProgress bar: "completed/total tasks done" text + thin h-1.5 progress bar
- [x] Basic line-by-line markdown renderer (## headings, - [x] checklists, **bold**, - lists, paragraphs)
- [x] Live plan sync via useLivePlan hook (polls filesystem API every 3s in dev)

### Chat — core
- [x] ChatPanel wired to `useSendChat` hook (queries project/epic/tickets/messages)
- [x] ChatInput as controlled component (value/onChange/onSend/onStop props)
- [x] SSE streaming with pulsing typing indicator and blinking cursor
- [x] ChatGPT-style incremental rendering (tokens appear as they arrive)
- [x] Auto-scroll: stays at bottom while streaming, scroll-to-bottom button appears when scrolled up
- [x] Stop button — cancels in-flight stream via AbortController; saves partial response marked `isInterrupted`
- [x] Retry button — per-message retry on hover (re-runs the preceding user message)
- [x] Stream reconnect — orphaned streaming messages detected on page reload and marked interrupted

### Chat — persistence & context
- [x] Messages persisted in Convex (`chatMessages` table: epicId, role, content, metadata, createdAt, isStreaming, isInterrupted, tokenCount)
- [x] Conversation history: last 12 messages sent with each request (windowed + truncated for context efficiency)
- [x] Context injection: project name, repo, branch, epic title/status/priority/content, ticket list with status, active file content
- [x] Context window optimization: history truncation, ticket content capped at 500 chars, epic content at 2000 chars
- [x] Chat input persistence: draft saved to localStorage, restored on next visit, expires 24h
- [x] Chat pagination: "load earlier messages" toggle (recent 50 vs all messages)

### Chat — input UX
- [x] Multi-message queue: send while streaming, messages queue and process sequentially (Slack-style)
- [x] Queue status indicator: shows count of queued messages with spinner
- [x] Paste image upload: Ctrl+V screenshots upload to Convex file storage, inline preview with remove button (max 4)
- [x] Ticket mentions with `#`: searchable dropdown filtered by title and slug; inserts `#slug`; highlights mentions as pills
- [x] Slash commands: type `/` to open command palette (`/create-ticket`, `/sync`, `/tickets`, `/update-status`)
- [x] Active file pill: when a file is open in code view, its path appears as a dismissible pill above the input

### Chat — message rendering
- [x] Full markdown renderer in agent messages (headings, lists, tables, blockquotes, code blocks with syntax highlighting, inline code)
- [x] Syntax highlighting in code blocks
- [x] Clickable links in agent messages (rendered as `<a>` with target blank)
- [x] GitHub link preview cards: auto-extracts GitHub URLs and shows enriched preview cards
- [x] Commit cards: parses commit refs, renders branded GitHub/Bitbucket cards with hash, message, files changed
- [x] View diff button on GitHub commit cards — opens CommitDiffPanel with full file diffs
- [x] Agent action cards: structured `<actions>[...]</actions>` JSON rendered as visual cards (ticket-created, status-updated, sync-triggered)
- [x] Interrupted response banner with amber warning and retry button
- [x] User messages render `#ticket-slug` as highlighted pills

### Chat — header / tooling
- [x] View mode toggle (Plan / Code) in chat header
- [x] Connection status dot
- [x] Token counter: shows `Xk / 200k tokens` with color-coded dot (green/yellow/red)
- [x] Export conversation: downloads full chat as `.md` file
- [x] Theme toggle (dark/light)

### Chat — entry & discovery
- [x] Context summary card: shown at top of messages, displays epic title, status, and ticket progress
- [x] Roadmap modal: view all features and their status at a glance
- [x] Overview modal: feature description and plan overview on demand
- [x] Command palette file search (Cmd+P): fuzzy search files in the repo, opens them in code view

### Chat — agent actions (full loop)
- [x] Charizard can create tickets, update statuses, sync the project — directly from chat
- [x] Structured action cards rendered after each response when actions were taken
- [x] Agent repo push: pushes plan changes, GitHub webhook triggers Convex sync, ticket appears live
- [x] Chat memory: cross-session context via OpenClaw memory files on the VPS

### Code viewer (right panel, Code mode)
- [x] Chat/Code toggle switch in ChatPanel header
- [x] File tree fetched via GitHub Trees API
- [x] File content fetched via GitHub Blob API on demand
- [x] Syntax highlighting via `react-syntax-highlighter`
- [x] Context bridge: viewed file injected into chat system message
- [x] Commit diff viewer: view full file diffs from commit cards

## Components

- `FeatureLayout` — three-panel flex layout + resize logic
- `TicketSidebar` — left panel: back nav, epic title, branch, search, ticket list
- `TicketItem` — single ticket row with status dot
- `PlanViewer` — center panel: plan content rendering
- `ChecklistProgress` — progress bar below plan title
- `ChatPanel` — right panel: chat container
- `ChatMessage` — individual chat message bubble
- `ChatInput` — bottom input bar
- `ResizeHandle` — drag handle between plan viewer and chat

## Hooks

- `useLivePlan` — fetches plan data from filesystem API, polls every 3s in dev
- `useSendChat` — orchestrates chat: queries, streaming, message queue, abort

## Still needs

- [ ] Wire ticket sidebar to Convex queries (useQuery for tickets, epic data)
- [ ] Replace basic plan renderer with react-markdown + remark-gfm
- [ ] GFM tables support in plan viewer
- [ ] Remove filesystem API / dev polling in production
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

- Feature 4 (GitHub Sync) — context data comes from synced plans, tickets in DB
- Feature 5 (Kanban) — navigation from kanban card
