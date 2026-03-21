export type TicketStatus = "todo" | "in-progress" | "review" | "completed"

export type Ticket = {
  id: string
  title: string
  status: TicketStatus
}

export type ChatMessageType = "text" | "commit"

export type CommitData = {
  hash: string
  message: string
  url: string
  filesChanged: number
}

export type ChatMessage = {
  id: string
  role: "user" | "agent"
  type: ChatMessageType
  content: string
  commit?: CommitData
  timestamp: string
}

export type EpicData = {
  title: string
  status: TicketStatus
  priority: string
  tickets: Ticket[]
  planContent: string
  checklist: { total: number; completed: number }
  chatMessages: ChatMessage[]
}

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  "todo": "bg-status-todo",
  "in-progress": "bg-status-in-progress",
  "review": "bg-status-review",
  "completed": "bg-status-completed",
}

const REPO = "https://github.com/JuanEliasJabib02/speedy-gonzales/commit"

export const MOCK_EPICS: Record<string, EpicData> = {
  "01-auth": {
    title: "Auth",
    status: "completed",
    priority: "critical",
    tickets: [
      { id: "t0", title: "Overview", status: "completed" },
      { id: "t1", title: "Convex Auth setup", status: "completed" },
      { id: "t2", title: "Magic Link sign-in", status: "completed" },
      { id: "t3", title: "OTP verification dialog", status: "completed" },
      { id: "t4", title: "Route protection middleware", status: "completed" },
      { id: "t5", title: "Users table & getCurrentUser", status: "completed" },
    ],
    planContent: `## What it does

Users can log in with Magic Link (email OTP). After login, they're redirected to the dashboard. All other pages are protected — unauthenticated users get sent to login.

## What's built

- Login page with email input
- 6-digit OTP dialog (sent via Resend)
- Middleware protects all \`/(app)/\` routes
- Convex Auth setup: \`auth.ts\`, \`auth.config.ts\`, \`http.ts\`
- Users table with auth-only fields (email, name, authProvider)

## Routes

- \`/login\` — public, login page
- \`/dashboard\` — protected, redirects to login if unauthenticated
- Authenticated users on \`/login\` get redirected to \`/dashboard\`

## Files

- [x] \`convex/auth.ts\` — Auth config with providers + callbacks
- [x] \`convex/auth.config.ts\` — Provider domain config
- [x] \`convex/schema/users.ts\` — Users table (email, name, authProvider)
- [x] \`convex/users.ts\` — getCurrentUser query
- [x] \`src/proxy.ts\` — Middleware (auth + i18n)
- [x] \`src/app/[locale]/(public-routes)/login/\` — Login page + components + hooks
- [x] \`src/app/[locale]/(app)/dashboard/\` — Protected placeholder page`,
    checklist: { total: 7, completed: 7 },
    chatMessages: [
      { id: "m1", role: "user", type: "text", content: "Set up Convex Auth with magic link. Use Resend for the OTP emails.", timestamp: "2:30 PM" },
      { id: "m2", role: "agent", type: "text", content: "On it. I'll configure Convex Auth with the Resend provider, create the users table schema, and set up the auth config files.", timestamp: "2:30 PM" },
      { id: "m3", role: "agent", type: "commit", content: "", commit: { hash: "a1b2c3d", message: "feat: configure Convex Auth with Resend OTP provider", url: `${REPO}/a1b2c3d`, filesChanged: 5 }, timestamp: "2:32 PM" },
      { id: "m4", role: "user", type: "text", content: "Now build the login page with the email input and the OTP dialog.", timestamp: "2:33 PM" },
      { id: "m5", role: "agent", type: "text", content: "Done. Login page, OTP dialog, middleware, and users table are all wired up. Auth is fully functional.", timestamp: "2:38 PM" },
      { id: "m6", role: "agent", type: "commit", content: "", commit: { hash: "da27afe", message: "feat: scaffold speedy gonzales template with auth and design system", url: `${REPO}/da27afe`, filesChanged: 24 }, timestamp: "2:38 PM" },
    ],
  },

  "02-projects": {
    title: "Projects",
    status: "in-progress",
    priority: "high",
    tickets: [
      { id: "t0", title: "Overview", status: "in-progress" },
      { id: "t1", title: "Projects schema & indexes", status: "todo" },
      { id: "t2", title: "createProject mutation", status: "todo" },
      { id: "t3", title: "getProjects / getProject queries", status: "todo" },
      { id: "t4", title: "deleteProject mutation", status: "todo" },
    ],
    planContent: `## What it does

The user can create, view, edit, and delete projects. Each project has exactly one GitHub repo — one project, one repo.

## Project data

- **Name** — displayed in dashboard and header
- **Description** — short summary shown on cards
- **Repo URL** — the single GitHub repo
- **Plans path** — where plans live in the repo (default: \`plans/\`)
- **Branch** — branch to track (default: \`main\`)

## Schema

### projects table

- [ ] userId (Id<"users">) — Owner
- [ ] name (string) — Project name
- [ ] description (string, optional) — Short description
- [ ] repoUrl (string) — Full GitHub URL
- [ ] repoOwner (string) — extracted from URL
- [ ] repoName (string) — extracted from URL
- [ ] plansPath (string) — default: "plans/"
- [ ] branch (string) — default: "main"
- [ ] lastSyncAt (number, optional)

## Backend functions

- [ ] \`createProject(name, description, repoUrl, plansPath?, branch?)\`
- [ ] \`getProjects()\` — all projects for current user
- [ ] \`getProject(projectId)\` — single project
- [ ] \`updateProject(projectId, name?, description?)\`
- [ ] \`deleteProject(projectId)\` — deletes project and all synced data`,
    checklist: { total: 9, completed: 0 },
    chatMessages: [
      { id: "m1", role: "user", type: "text", content: "Start with the projects schema. Each project = one repo.", timestamp: "3:00 PM" },
      { id: "m2", role: "agent", type: "text", content: "Got it. I'll create the projects table with userId, name, description, repoUrl, repoOwner, repoName, plansPath, branch, and timestamps. Indexes on by_user and by_repo_owner_name.", timestamp: "3:00 PM" },
    ],
  },

  "03-dashboard": {
    title: "Dashboard",
    status: "in-progress",
    priority: "high",
    tickets: [
      { id: "t0", title: "Overview", status: "in-progress" },
      { id: "t1", title: "Project cards grid", status: "completed" },
      { id: "t2", title: "Create project dialog", status: "completed" },
      { id: "t3", title: "Empty state", status: "completed" },
      { id: "t4", title: "Wire to Convex queries", status: "todo" },
    ],
    planContent: `## What it does

The main page after login. Shows all the user's projects as cards. This is the entry point to everything — from here you click into a project.

## Project card contents

- Project name
- Description (if set)
- Active features count + total features + ticket count
- Click navigates to project view (Kanban)

## Actions

- **New Project button** — opens "Create project" dialog
- **Click card** — navigates to \`/projects/[projectId]\`

## UI built

- [x] Project cards grid (responsive: 1/2/3 cols)
- [x] Create project dialog (name + description + repo URL)
- [x] Empty state (FolderKanban icon + CTA)
- [ ] Wire to Convex \`useQuery(api.projects.getProjects)\`
- [ ] Wire create dialog to \`useMutation(api.projects.createProject)\``,
    checklist: { total: 5, completed: 3 },
    chatMessages: [
      { id: "m1", role: "user", type: "text", content: "Build the dashboard UI with project cards, create dialog, and empty state.", timestamp: "4:00 PM" },
      { id: "m2", role: "agent", type: "text", content: "I'll create the dashboard with a responsive grid of project cards, a create project dialog with name/description/repo URL fields, and an empty state component.", timestamp: "4:00 PM" },
      { id: "m3", role: "agent", type: "commit", content: "", commit: { hash: "b3f8a12", message: "feat: build dashboard UI with project cards and create dialog", url: `${REPO}/b3f8a12`, filesChanged: 6 }, timestamp: "4:05 PM" },
    ],
  },

  "04-github-sync": {
    title: "GitHub Sync",
    status: "todo",
    priority: "critical",
    tickets: [
      { id: "t0", title: "Overview", status: "todo" },
      { id: "t1", title: "GitHub OAuth flow", status: "todo" },
      { id: "t2", title: "Webhook registration", status: "todo" },
      { id: "t3", title: "Webhook handler endpoint", status: "todo" },
      { id: "t4", title: "syncRepo action", status: "todo" },
      { id: "t5", title: "Frontmatter parser", status: "todo" },
      { id: "t6", title: "Upsert logic (epics + tickets)", status: "todo" },
      { id: "t7", title: "Manual sync button", status: "todo" },
    ],
    planContent: `## What it does

Reads \`plans/\` from linked GitHub repos, parses the \`.md\` files, and stores the data in Convex. Keeps everything in sync via webhooks.

This is the **core engine** of Speedy Gonzales. Without it, there's nothing to show.

## How it works

- [ ] GitHub OAuth flow (connect account, store token)
- [ ] Webhook registration when linking a repo
- [ ] HTTP endpoint to receive webhooks (\`/github-webhook\`)
- [ ] Sync action: read plans/, parse frontmatter, upsert epics + tickets
- [ ] Frontmatter parser (\`convex/model/parsePlan.ts\`)
- [ ] Upsert logic with hash-based change detection
- [ ] "Sync now" manual button as fallback

## Webhook handler

POST /github-webhook:
1. Verify HMAC-SHA256 signature
2. Extract repo owner/name from payload
3. Look up repo in DB by [owner, name] index
4. Check if changed files are inside plansPath
5. Schedule internal action: syncRepo(repoId)

## Schema

### epics table
- projectId, title, path, content, contentHash, status, priority, progress

### tickets table
- projectId, epicId, title, path, content, contentHash, status, priority, checklistProgress`,
    checklist: { total: 7, completed: 0 },
    chatMessages: [
      { id: "m1", role: "user", type: "text", content: "This is the next big one. We need to sync plans/ from GitHub repos into Convex.", timestamp: "5:00 PM" },
      { id: "m2", role: "agent", type: "text", content: "This is the core engine. I'll start with the GitHub OAuth flow, then webhook registration, handler, sync action, and frontmatter parser. Want me to begin with the OAuth setup?", timestamp: "5:00 PM" },
    ],
  },

  "05-kanban": {
    title: "Kanban",
    status: "in-progress",
    priority: "high",
    tickets: [
      { id: "t0", title: "Overview", status: "in-progress" },
      { id: "t1", title: "Kanban board layout", status: "completed" },
      { id: "t2", title: "Feature cards", status: "completed" },
      { id: "t3", title: "Completed toggle", status: "completed" },
      { id: "t4", title: "Wire to Convex queries", status: "todo" },
    ],
    planContent: `## What it does

When you click a project from the dashboard, you see a kanban board of features (epics). Each card is a feature, organized by status columns. Click a feature card to enter the Feature View.

## Columns

1. **Todo** — not started
2. **In Progress** — agent is working
3. **Review** — agent finished, needs human review
4. **Blocked** — agent got stuck
5. **Completed** — hidden by default, toggle to show

## Feature card contents

- Feature title (from epic's frontmatter)
- Progress bar + percentage
- Ticket count
- Priority indicator (color badge)
- Click navigates to \`/projects/[projectId]/features/[epicId]\`

## UI built

- [x] Kanban board with 4 active columns + completed toggle
- [x] Feature cards with progress bars and priority pills
- [x] Empty column state (dashed border)
- [ ] Wire to Convex \`useQuery(api.epics.getByProject)\`
- [ ] Drag & drop to change feature status (optional)`,
    checklist: { total: 5, completed: 3 },
    chatMessages: [
      { id: "m1", role: "user", type: "text", content: "Build the kanban board UI. 4 active columns, completed hidden by default with a toggle.", timestamp: "6:00 PM" },
      { id: "m2", role: "agent", type: "text", content: "I'll create the board with Todo, In Progress, Review, and Blocked columns visible by default. A 'Completed' toggle in the header reveals the fifth column. Each feature card shows title, progress, tickets, and priority.", timestamp: "6:00 PM" },
      { id: "m3", role: "agent", type: "commit", content: "", commit: { hash: "c4d5e6f", message: "feat: build kanban board with feature cards and completed toggle", url: `${REPO}/c4d5e6f`, filesChanged: 8 }, timestamp: "6:08 PM" },
    ],
  },

  "06-feature-view": {
    title: "Feature View",
    status: "in-progress",
    priority: "high",
    tickets: [
      { id: "t0", title: "Overview", status: "in-progress" },
      { id: "t1", title: "Three-panel layout", status: "completed" },
      { id: "t2", title: "Ticket sidebar", status: "completed" },
      { id: "t3", title: "Plan viewer (basic)", status: "completed" },
      { id: "t4", title: "Chat panel shell", status: "completed" },
      { id: "t5", title: "Resizable chat", status: "completed" },
      { id: "t6", title: "Wire to Convex queries", status: "todo" },
    ],
    planContent: `## What it does

The core screen of the app. A three-panel layout where you:
- Browse tickets in a sidebar (like a wiki)
- Read the selected plan rendered as HTML
- Chat with your OpenClaw agent about the feature

## Sidebar

- Displays ticket title with status dot
- Click a ticket to render its PLAN.md in the center panel
- Epic's own PLAN.md shown at top as "Overview"
- Active ticket is highlighted

## Plan viewer (center)

- Markdown rendering with headings, lists, code blocks
- Checklists rendered as checkboxes (read-only)
- Checklist progress shown as bar at top

## Chat (right)

- Message list with user/agent bubbles
- Resizable panel (drag left edge)
- Agent avatar (Zap icon) + user avatar (initial)
- Commit messages rendered as clickable cards with GitHub links

## UI built

- [x] Three-panel layout (sidebar + viewer + chat)
- [x] Ticket sidebar with status dots and selection
- [x] Plan viewer with basic markdown rendering
- [x] Chat panel with messages and input
- [x] Resizable chat panel (320px - 700px)
- [ ] Wire to Convex \`useQuery(api.tickets.getByEpic)\``,
    checklist: { total: 6, completed: 5 },
    chatMessages: [
      { id: "m1", role: "user", type: "text", content: "Build the three-panel feature view. Sidebar with tickets, plan viewer in center, chat on right.", timestamp: "7:00 PM" },
      { id: "m2", role: "agent", type: "text", content: "I'll create the three-panel layout. Ticket sidebar (280px) with status dots, plan viewer with markdown rendering and checklist progress, and a chat panel (380px) with user/agent avatars.", timestamp: "7:00 PM" },
      { id: "m3", role: "agent", type: "commit", content: "", commit: { hash: "e7f8g9h", message: "feat: build three-panel feature view with ticket sidebar, plan viewer, and chat", url: `${REPO}/e7f8g9h`, filesChanged: 12 }, timestamp: "7:12 PM" },
      { id: "m4", role: "user", type: "text", content: "Make the chat panel resizable so I can drag to adjust the width.", timestamp: "7:15 PM" },
      { id: "m5", role: "agent", type: "commit", content: "", commit: { hash: "h1i2j3k", message: "feat: add resizable chat panel with drag handle", url: `${REPO}/h1i2j3k`, filesChanged: 3 }, timestamp: "7:17 PM" },
    ],
  },

  "07-plan-viewer": {
    title: "Plan Viewer",
    status: "in-progress",
    priority: "medium",
    tickets: [
      { id: "t0", title: "Overview", status: "in-progress" },
      { id: "t1", title: "Basic markdown rendering", status: "completed" },
      { id: "t2", title: "Checklist progress bar", status: "completed" },
      { id: "t3", title: "Full react-markdown + remark-gfm", status: "todo" },
    ],
    planContent: `## What it does

Renders a PLAN.md file as formatted HTML inside the Feature View center panel. The reading experience — the user should be able to read plans comfortably, like documentation.

## What it renders

- Header: Title + status badge + priority badge
- Progress bar: "X/Y tasks done" — calculated from checkboxes
- Body: Full markdown rendered as HTML
  - Headings, paragraphs, bold/italic
  - Code blocks with syntax highlighting (optional)
  - Checklists with checkbox styling (read-only)
  - Links, images, tables
  - GFM (GitHub Flavored Markdown) support

## UI built

- [x] Basic markdown line-by-line renderer
- [x] Checklist progress component
- [ ] Install and use \`react-markdown\` + \`remark-gfm\`
- [ ] Code block syntax highlighting`,
    checklist: { total: 4, completed: 2 },
    chatMessages: [
      { id: "m1", role: "user", type: "text", content: "We need a proper markdown renderer for the plan viewer. react-markdown + remark-gfm.", timestamp: "8:00 PM" },
      { id: "m2", role: "agent", type: "text", content: "I'll install react-markdown and remark-gfm, then replace the current line-by-line renderer with a proper component that handles headings, code blocks, tables, and GFM task lists.", timestamp: "8:00 PM" },
    ],
  },

  "08-chat": {
    title: "OpenClaw Chat",
    status: "todo",
    priority: "medium",
    tickets: [
      { id: "t0", title: "Overview", status: "todo" },
      { id: "t1", title: "Chat messages schema", status: "todo" },
      { id: "t2", title: "sendMessage action", status: "todo" },
      { id: "t3", title: "OpenClaw API integration", status: "todo" },
      { id: "t4", title: "Real-time message updates", status: "todo" },
      { id: "t5", title: "Agent context injection", status: "todo" },
    ],
    planContent: `## What it does

The right panel in the Feature View. A chat where you talk to your OpenClaw agent about the current feature. The agent can read plans, create tickets, modify plans, and push changes — all from the conversation.

This is NOT a generic AI chat. The backend is OpenClaw — your agent with full context, memory, and execution access.

## What you can do from the chat

- [ ] Ask the agent to explain a plan
- [ ] Tell the agent to create new tickets
- [ ] Tell the agent to modify an existing plan
- [ ] Tell the agent to start working on a ticket
- [ ] Ask for a status update
- [ ] Tell the agent to split a big ticket into smaller ones

## Chat storage

### chat_messages table
- epicId — Feature this chat belongs to
- role — "user" or "assistant"
- content — Message text
- actions — Actions the agent took (optional)
- createdAt — Timestamp

## OpenClaw connection (TBD)

- API protocol: HTTP REST? WebSocket? gRPC?
- Streaming: token-by-token or all at once?
- Authentication: How does Speedy authenticate with OpenClaw?
- Hosting: VPS? Cloud? Local with tunnel?

For MVP, the chat UI is built with a placeholder backend.`,
    checklist: { total: 6, completed: 0 },
    chatMessages: [
      { id: "m1", role: "user", type: "text", content: "This is the final big feature. We need to connect the chat to OpenClaw.", timestamp: "9:00 PM" },
      { id: "m2", role: "agent", type: "text", content: "I'll need to research the OpenClaw API protocol first. For now, the chat UI is built and ready — we just need to swap the mock messages for real API calls once the protocol is defined.", timestamp: "9:00 PM" },
    ],
  },
}

export function getEpicData(epicId: string): EpicData {
  return MOCK_EPICS[epicId] ?? MOCK_EPICS["01-auth"]
}
