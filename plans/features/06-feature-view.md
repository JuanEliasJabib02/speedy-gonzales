# Feature 6: Feature View

**Status:** todo
**Phase:** 4

## What it does

The **core screen of the app**. A three-panel layout where you:
- Browse tickets in a sidebar (like a wiki)
- Read the selected plan rendered as HTML
- Chat with your OpenClaw agent about the feature

You enter here by clicking a feature card from the kanban.

## UI

```
┌──────────┬──────────────────────────┬──────────────────────────┐
│ Sidebar  │  Plan viewer             │  Chat                    │
│          │                          │                          │
│ Auth     │  # Login                 │  Tú: agrega 2FA         │
│ ─────────│                          │                          │
│ ● Login ✅│  ## Description          │  Agent: Creé el ticket   │
│ ● Reg.  ✅│  Implement the login     │  "2FA Setup" con estos  │
│ ● Reset 🔄│  flow with email and     │  pasos:                 │
│ ● 2FA   ⬜│  password.               │  - [ ] TOTP library     │
│          │                          │  - [ ] QR code gen      │
│          │  ## Checklist            │  - [ ] Verify flow      │
│          │  ✅ Create form          │                          │
│          │  ✅ Connect auth         │  Ya pushee al repo.     │
│          │  ⬜ Handle errors        │                          │
│          │  ⬜ Redirect             │  ────────────────────    │
│          │                          │  [Type a message...]     │
└──────────┴──────────────────────────┴──────────────────────────┘
```

## Sidebar

The left panel shows all tickets for the current feature.

- Displays ticket **title** (from frontmatter, not file path)
- Status icon: ✅ completed, 🔄 in_progress, ⬜ todo, 🚫 blocked, 👀 review
- Click a ticket → its PLAN.md renders in the center panel
- The epic's own PLAN.md is also selectable (shown at top, like an "overview")
- Active ticket is highlighted

## Plan viewer (center)

Renders the selected PLAN.md as formatted HTML.

- Markdown rendering with headings, lists, code blocks, links
- Checklists rendered as interactive-looking checkboxes (read-only in MVP)
- Checklist progress shown as a small bar at the top: "3/5 tasks done"
- Uses `react-markdown` + `remark-gfm`

## Chat (right)

Chat panel connected to OpenClaw agent. One conversation per feature.

- Message list with user/agent bubbles
- Input field at the bottom
- Chat has context: current project, repo, feature, and selected plan
- Agent can create/modify/delete tickets from the chat
- When agent pushes changes → webhook fires → sidebar and plan viewer update in real-time while you're chatting

In Phase 4, the chat is a **placeholder UI** (visible but not connected). It gets wired to OpenClaw in Phase 5.

## Responsive behavior

On smaller screens, the three panels could collapse:
- Hide chat → two panels (sidebar + viewer)
- Or use tabs: Tickets | Plan | Chat

For MVP, optimize for desktop (1440px+). The three-panel layout is the primary experience.

## Frontend components

```
src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/
├── _components/
│   ├── FeatureLayout.tsx       # Three-panel grid
│   ├── TicketSidebar.tsx       # Left panel: ticket list
│   ├── TicketItem.tsx          # Single ticket row in sidebar
│   ├── PlanViewer.tsx          # Center: markdown renderer
│   ├── ChecklistProgress.tsx   # Progress bar for checklists
│   ├── ChatPanel.tsx           # Right: chat UI
│   └── ChatMessage.tsx         # Single message bubble
├── _hooks/
│   ├── useFeatureView.ts       # Composer: wires sub-hooks
│   ├── useTickets.ts           # Queries tickets for this epic
│   ├── useSelectedPlan.ts      # Tracks which ticket is selected, fetches content
│   └── useFeatureChat.ts       # Chat state + messages (placeholder in Phase 4)
└── page.tsx
```

## Depends on

- Feature 4 (GitHub Sync) — needs tickets in DB
- Feature 5 (Kanban) — navigation from kanban card to here

## Blocks

- Feature 8 (Chat) — chat panel is wired here
