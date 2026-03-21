# Feature View

**Status:** in-progress
**Priority:** high

## Overview

The core screen of the app. A three-panel layout where you:
- Browse tickets in a sidebar (like a wiki)
- Read the selected plan rendered as HTML
- Chat with your OpenClaw agent about the feature

You enter here by clicking a feature card from the kanban. The app sidebar is hidden on this route to maximize screen space.

## Layout

- Left: **TicketSidebar** (280px) — back arrow, epic title, git branch indicator (`feat/xxx`), search bar to filter tickets, ticket list with status dots
- Center: **PlanViewer** (flex-1) — title, status/priority pills, checklist progress bar, line-by-line markdown rendering
- Right: **ChatPanel** (resizable 320-700px, drag handle) — "Chat" header with "coming soon" badge + ThemeToggle, message list with user/agent avatars, commit message cards with GitHub links, input bar

## UI built (mock)

- [x] Three-panel FeatureLayout with flex, full viewport height
- [x] App sidebar hidden when on `/features/` routes (layout.tsx)
- [x] TicketSidebar (280px): back arrow, FileText icon, epic title
- [x] Git branch indicator (GitBranch icon + monospace branch name) — NEW
- [x] Search bar to filter tickets by title — NEW
- [x] Ticket list with TicketItem components, status dots, active highlight
- [x] PlanViewer: title, status/priority badges, checklist progress, basic line-by-line markdown
- [x] ChatPanel: resizable (320-700px), drag handle (ResizeHandle component)
- [x] Chat header: "Chat" title + "coming soon" badge + ThemeToggle
- [x] Message list: user messages (blue, right), agent messages (gray, left)
- [x] User avatar: initial circle (from useCurrentUser), Agent avatar: Zap icon
- [x] Commit message cards with hash, message, files changed, GitHub link
- [x] Chat input bar with text input + send button
- [x] Live plan sync: API reads from `plans/features/` filesystem, useLivePlan hook polls every 3s (DEV ONLY)

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

- `useLivePlan` — fetches plan data from filesystem API, polls every 3s in dev, falls back to mock data

## Still needs

- [ ] Wire to Convex queries (useQuery for tickets, epic data)
- [ ] Replace basic markdown renderer with react-markdown + remark-gfm
- [ ] Remove filesystem API / dev polling in production

## Depends on

- Feature 4 (GitHub Sync) — needs tickets in DB
- Feature 5 (Kanban) — navigation from kanban card

## Blocks

- Feature 8 (Chat) — chat panel is wired here
