 # Speedy Gonzales — Business Model
 
 ## What it is
 
 A web command center for managing software projects where AI agents do the development work.
 
 You open the browser, see your projects, see the plan for each feature laid out like a wiki, and talk to your AI agent from a chat panel — the agent reads, writes, and pushes code to your repos. Everything syncs in real-time.
 
 **One sentence:** A reactive plan viewer + agent chat that replaces Slack as the interface to manage your AI-powered dev team.
 
 ## The problem
 
 Today the workflow is:
 1. You have repos with code
 2. You have AI agents (OpenClaw) that can code
 3. You talk to agents via Slack to give instructions
 4. You check GitHub manually to see progress
 5. Plans live as scattered `.md` files nobody reads in a nice way
 
 There's no single place to **see the big picture, read plans, and talk to your agent** — all at once, in real-time.
 
 ## The solution
 
 ```
 Tú (browser)
     │
     ▼
 Speedy Gonzales (Vercel + Convex)
     │
     ├── Dashboard: all your projects with progress bars
     ├── Kanban: features as cards, organized by status
     ├── Feature View: sidebar (tickets) + plan viewer + chat
     │
     ▼
 OpenClaw Agent (e.g., Charizard)
     │
     ├── Receives instructions from the chat
     ├── Reads/writes plans/ in repos
     ├── Commits and pushes changes
     ├── Codes features, moves tickets
     │
     ▼
 GitHub ──webhook──→ Convex DB ──real-time──→ UI updates automatically
 ```
 
 ## Key decisions
 
 | Decision | Answer |
 |----------|--------|
 | Where do plans live? | As `.md` files inside `plans/` in each git repo |
 | Source of truth for projects? | OpenClaw config (repo/file that lists projects + repos) |
 | What does the sidebar show? | Only files inside `plans/`, abstracted (titles from frontmatter, not file paths) |
 | Chat scope? | One chat per feature/epic — covers all its tickets from there |
 | Who creates plans? | The user, from the chat — agent creates `plans/` if it doesn't exist |
 | Kanban level? | Features (epics), not individual tickets — click feature to enter detail view |
 | OpenClaw connection? | TBD technically — core feature but API/protocol needs research |
 | Users? | Single-user MVP. Open source with Convex API key. Organizations later |
 
 ## Navigation flow
 
 ```
 Login
   │
   ▼
 Dashboard (project cards with progress)
   │
   │  Click project
   ▼
 Project View — Kanban of features
   │
   │  ┌──────────┬────────────┬──────────┬───────────┐
   │  │   Todo   │In Progress │  Review  │ Completed │
   │  │ ┌──────┐ │ ┌────────┐ │          │ ┌───────┐ │
   │  │ │Paymts│ │ │  Auth  │ │          │ │ Setup │ │
   │  │ └──────┘ │ └────────┘ │          │ └───────┘ │
   │  └──────────┴────────────┴──────────┴───────────┘
   │
   │  Click "Auth"
   ▼
 Feature View — three-panel layout
   ┌──────────┬──────────────────┬──────────────────┐
   │ Sidebar  │  Plan viewer     │  Chat (OpenClaw) │
   │          │                  │                  │
   │ ● Login ✅│  # Login         │  Tú: agrega 2FA │
   │ ● Reg.  ✅│                  │                  │
   │ ● Reset 🔄│  ## Checklist    │  Agent: Hecho.  │
   │ ● 2FA   ⬜│  ✅ Form         │                  │
   │          │  ⬜ Errors        │                  │
   └──────────┴──────────────────┴──────────────────┘
 ```
 
 ## Plan file structure
 
 Plans live inside each repo at `plans/`:
 
 ```
 plans/
 ├── auth/
 │   ├── PLAN.md              ← EPIC: describes the full feature
 │   ├── login/
 │   │   └── PLAN.md          ← TICKET: concrete task
 │   ├── register/
 │   │   └── PLAN.md          ← TICKET
 │   └── password-reset/
 │       └── PLAN.md          ← TICKET
 ```
 
 - **Epic** = folder with `PLAN.md` at root → the feature itself
 - **Ticket** = subfolder with `PLAN.md` → a concrete, executable task
 
 ### PLAN.md frontmatter
 
 ```yaml
 ---
 title: Implement Login
 status: todo
 priority: high
 ---
 ```
 
 - Status: `todo | in_progress | review | blocked | completed`
 - Priority: `high | medium | low`
 - The `title` is what shows in the UI (sidebar, kanban cards) — never file paths
 
 ### Status transitions
 
 | Transition | Who |
 |---|---|
 | `todo → in_progress` | Agent (starts working) |
 | `in_progress → review` | Agent (finished) |
 | `in_progress → blocked` | Agent (stuck) |
 | `review → completed` | User only (from kanban or UI) |
 | `any → todo` | User (manual reset) |
 
 ## Source of truth
 
 | Data | Lives in | Why |
 |------|----------|-----|
 | Plan content | Git (`plans/*.md`) | Agents edit files directly |
 | Status, priority, title | Git (frontmatter) | Agents change status by pushing |
 | Kanban order | Convex DB | No equivalent in `.md` files |
 | Progress % | Calculated | `completed / total × 100` |
 | Projects, users | Convex DB | App-level data |
 
 The DB is a **read-optimized cache** of git. Git is always right.
 
 ## What makes it different
 
 This is NOT "another project management tool." It's specifically built for the workflow where **AI agents do the work and you supervise**.
 
 - The chat backend is OpenClaw, not generic Claude — your agent knows your code, your decisions, your patterns
 - Plans are in git, not in a SaaS database — your agents already work with git
 - Everything is reactive — agent pushes, you see it instantly
 - No context switching — plan + chat + status in one view
 
 ## Tech stack
 
 - **Frontend:** Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui
 - **Backend:** Convex (DB, real-time, functions, auth)
 - **Auth:** Google OAuth + Magic Link via Convex Auth
 - **Sync:** GitHub webhooks + GitHub API (Contents/Trees)
 - **Chat:** OpenClaw API (TBD)
 - **i18n:** next-intl (en/es)
 - **Hosting:** Vercel
 