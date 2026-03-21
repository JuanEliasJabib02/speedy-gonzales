# Roadmap

## Build order

Each phase depends on the previous one. No skipping.

```
Phase 1: Projects + Dashboard
  │  Schema + CRUD + project cards UI
  │  The user can create projects and link repos
  │
  ▼
Phase 2: GitHub Sync
  │  Webhooks + read plans/ + parse frontmatter + store in DB
  │  Plans from repos appear in the app automatically
  │
  ▼
Phase 3: Kanban (features)
  │  Feature cards organized by status columns
  │  Click feature → enters feature view
  │
  ▼
Phase 4: Feature View
  │  Three-panel layout: sidebar (tickets) + plan viewer + chat
  │  The core screen of the app
  │
  ▼
Phase 5: OpenClaw Chat
  │  Connect chat panel to OpenClaw API
  │  Agent can create/modify plans from the chat
  │
  ▼
Phase 6: Polish + Open Source
     Auth improvements, error handling, docs, public release
```

## Phase 1: Projects + Dashboard

**Goal:** User logs in and sees their projects. Can create projects and link GitHub repos.

Features involved:
- `features/02-projects.md`
- `features/03-dashboard.md`

What gets built:
- Convex schema: `projects`, `repos` tables
- Backend: createProject, getProjects, getProject, updateProject, deleteProject, linkRepo, unlinkRepo
- Frontend: dashboard page with project cards, create project dialog, link repo form
- Project config from OpenClaw config repo (or manual input as fallback)

Done when: User can log in, see projects, click into a project (even if empty).

## Phase 2: GitHub Sync

**Goal:** Plans from `plans/` in linked repos appear in the app and stay in sync.

Features involved:
- `features/04-github-sync.md`

What gets built:
- GitHub OAuth flow (connect account, store token)
- Webhook registration when linking a repo
- HTTP endpoint to receive webhooks
- Sync action: read plans/, parse frontmatter, upsert epics + tickets
- Convex schema: `epics`, `tickets` tables
- Frontmatter parser (convex/model/parsePlan.ts)
- "Sync now" manual button

Done when: Push to a repo with plans/ → data appears in Convex within seconds.

## Phase 3: Kanban

**Goal:** Project view shows features as kanban cards. User can see status at a glance.

Features involved:
- `features/05-kanban.md`

What gets built:
- Kanban board component (5 columns: todo, in_progress, review, blocked, completed)
- Feature cards with title, progress %, ticket count
- Drag & drop to change feature status (optional — could be phase 4)
- Click feature card → navigates to feature view

Done when: User clicks a project and sees features organized by status.

## Phase 4: Feature View

**Goal:** The core screen. Three-panel layout where you read plans and (eventually) chat with your agent.

Features involved:
- `features/06-feature-view.md`
- `features/07-plan-viewer.md`

What gets built:
- Three-panel layout: sidebar + plan viewer + chat (chat placeholder for now)
- Sidebar: list of tickets with status badges, click to select
- Plan viewer: renders PLAN.md as formatted HTML with checklist progress
- Markdown rendering (react-markdown + remark-gfm)

Done when: User clicks a feature from kanban → sees tickets in sidebar, reads plan content.

## Phase 5: OpenClaw Chat

**Goal:** The chat panel connects to OpenClaw. User can talk to their agent and the agent modifies plans in the repo.

Features involved:
- `features/08-chat.md`

What gets built:
- Chat UI component (message list + input)
- Integration with OpenClaw API (protocol TBD — needs research)
- Chat history stored in Convex (per feature)
- Agent context: sends current project, repo, feature, plan content with each message
- Real-time: agent pushes → webhook → plan viewer updates while chatting

Done when: User types in chat → agent responds and can modify plans that update in real-time.

## Phase 6: Polish + Open Source

**Goal:** Make it usable by others. Clean up, document, release.

What gets built:
- Error handling for GitHub API failures, webhook misses
- "Sync now" button as fallback
- Setup guide (Convex API key, GitHub OAuth app, env vars)
- README for open source
- Optional: organization support (multiple users per org)

Done when: Someone can clone the repo, add their API keys, and use it.
