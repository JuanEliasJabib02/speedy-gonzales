![speedy gonzales](https://github.com/user-attachments/assets/eb8651eb-614c-4e83-9c3b-fd48c4bbeef4)

# 🏎️ Speedy Gonzales

**You write the plan. AI builds it while you sleep.**

Speedy Gonzales is an autonomous development orchestrator. Define features as plain markdown files in your repo, and AI agents code them 24/7 — picking tickets by priority, writing code, pushing branches, and creating PRs. A real-time kanban tracks everything. You review when you're ready.

## How it works

```
You define a feature → tickets are created as .md files in your repo
                              ↓
            ┌─── Quality Gate 1: Plan Verification ───┐
            │  Structured discussion → ticket breakdown │
            │  UI contracts defined before code starts  │
            └─────────────────────────────────────────┘
                              ↓
         The loop fires every 30 minutes (cron)
                              ↓
     Picks the highest priority "todo" ticket
                              ↓
    Coding agent reads the plan, codes the solution
                              ↓
            ┌─── Quality Gate 2: Verification ────────┐
            │  Agent verifies checklist items are met   │
            │  Ticket moves to "review" only if passed  │
            └─────────────────────────────────────────┘
                              ↓
      Pushes to a feature branch automatically
                              ↓
        Kanban updates in real-time (before PR merge)
                              ↓
           PR is created on GitHub
                              ↓
            ┌─── Quality Gate 3: Human Review ────────┐
            │  Agents can't move tickets to "completed" │
            │  Only humans approve and merge             │
            └─────────────────────────────────────────┘
                              ↓
         Loop picks the next ticket. Repeat.
```

## Why Speedy

- **Plans as Code** — features and tickets are `.md` files in your repo. Git is the source of truth. No vendor lock-in, no external boards.
- **Real-Time Kanban** — plans sync from GitHub via webhooks. Watch tickets move across the board as agents work.
- **Autonomous Dev Loop** — a cron fires every 30 minutes, picks the highest-priority todo ticket, dispatches a coding agent, and pushes the result. No prompting, no babysitting.
- **Stack-Agnostic** — Speedy manages plans, not code. Next.js, Expo, FastAPI, Shopify, Rails — any stack works. Each repo defines its own conventions.
- **Agent-Agnostic** — uses Claude Code today. Swap in Codex, OpenHands, or any CLI-based agent tomorrow.
- **Quality Gates** — a 3-gate system ensures work is correct: structured planning → ticket verification → UI contracts. Code doesn't ship without passing all gates.
- **Human Review Gate** — agents move tickets to `review`, never to `completed`. Only humans approve and merge. You stay in control.
- **Multi-Project / Multi-Agent** — one orchestrator manages multiple repos and agents. Scale from one side project to a full portfolio.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Your Repo                         │
│                                                      │
│  plans/features/                                     │
│    ├── auth/                                         │
│    │   ├── _context.md      ← epic overview          │
│    │   ├── login-flow.md    ← ticket                 │
│    │   └── oauth-setup.md   ← ticket                 │
│    ├── dashboard/                                    │
│    │   ├── _context.md                               │
│    │   └── progress-bar.md                           │
│    └── ...                                           │
│                                                      │
│  .claude/                   ← agent conventions      │
│  src/                       ← your code              │
└──────────────────┬──────────────────────────────────┘
                   │
                   │  git sync (webhooks)
                   ▼
┌──────────────────────────────────────────────────────┐
│              Convex (real-time DB)                    │
│                                                      │
│  Syncs .md plans → real-time kanban state             │
│  Status updates before PR merge (HTTP endpoint)      │
│  Verification agent confirms checklist completion    │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│            Speedy UI (Next.js)                        │
│                                                      │
│  Dashboard → Features → Kanban → Plan Viewer         │
│  Real-time updates • Commit diffs • PR links         │
└──────────────────────────────────────────────────────┘
                   │
                   │  autonomous loop (cron)
                   ▼
┌──────────────────────────────────────────────────────┐
│            Orchestrator (OpenClaw)                    │
│                                                      │
│  Every 30 min:                                       │
│    1. Query todo tickets                             │
│    2. Pick highest priority                          │
│    3. Run quality gate checks                        │
│    4. Dispatch coding agent                          │
│    5. Agent codes → verifies → pushes → creates PR   │
│    6. Kanban updates in real-time                    │
│    7. Human reviews and approves                     │
│    8. Repeat                                         │
│                                                      │
│  Quality gates enforced at every step                │
└──────────────────────────────────────────────────────┘
```

## Core Concepts

### Epics and Tickets

Work is organized in two levels:

- **Epic** — a feature directory under `plans/features/<epic-slug>/`. Contains a `_context.md` (overview, architecture decisions, what's built, what's missing) and one or more ticket files.
- **Ticket** — a single `.md` file inside an epic directory. Each ticket has a status, priority, checklist, and description of the work to do.

### Plan Spec

Plans follow a strict format (see `plans/SPEC.md`):

```
plans/features/
  ├── auth/
  │   ├── _context.md        # Required: epic overview
  │   ├── login-flow.md      # Ticket
  │   └── oauth-setup.md     # Ticket
  └── dashboard/
      ├── _context.md
      └── progress-bar.md
```

- Kebab-case for all file and directory names
- Only 2 levels deep — no nested directories
- `_context.md` is required per epic

### Status Lifecycle

Every ticket follows this lifecycle:

```
todo → in-progress → review → completed
                       ↑          ↑
                    agent moves  human moves
                    ticket here  ticket here
```

- `todo` — ready for an agent to pick up
- `in-progress` — an agent is actively working on it
- `review` — agent finished, waiting for human review
- `completed` — human approved and merged
- `blocked` — waiting on a dependency (requires a `## Blocked` section explaining why)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A [Convex](https://convex.dev) account
- A GitHub repo with plans in `plans/features/`

### Setup

```bash
# Clone
git clone https://github.com/JuanEliasJabib02/speedy-gonzales.git
cd speedy-gonzales

# Install dependencies
pnpm install

# Set up Convex (creates your deployment, sets up schema)
npx convex dev

# Configure environment variables (see Configuration below)

# Run the development server
pnpm dev
```

### Create your first project

1. Connect your GitHub repo through the Speedy dashboard
2. Add a `plans/features/` directory to your repo with at least one epic and ticket
3. Push to GitHub — the webhook syncs your plans to the kanban automatically
4. The autonomous loop picks up `todo` tickets and starts coding

## Configuration

### Frontend (`.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Your Convex deployment URL |
| `NEXT_PUBLIC_SITE_URL` | No | Application URL (used for metadata/sitemap) |

### Backend (Convex environment variables)

Set these via `npx convex env set <KEY> <VALUE>`:

| Variable | Required | Description |
|---|---|---|
| `GITHUB_PAT` | Yes | GitHub Personal Access Token — reads repos, commits, and webhooks |
| `LOOP_API_KEY` | Yes | API key for the autonomous loop endpoint |
| `AUTH_RESEND_KEY` | Yes | Resend API key for email authentication (OTP/magic link) |
| `CONVEX_SITE_URL` | Yes | Your Convex deployment site URL (used for auth domains) |

## Tech Stack

- **Frontend:** Next.js 15, Tailwind CSS, shadcn/ui
- **Backend:** Convex (real-time database + serverless functions)
- **Orchestration:** OpenClaw (agent management + cron loop)
- **AI Agent:** Claude Code (swappable)
- **Hosting:** Vercel

## Documentation

Full documentation is available at `/docs` in the app:

- [Philosophy](/docs/philosophy) — why Speedy exists and the principles behind it
- [Setup Guide](/docs/setup) — complete onboarding: GitHub, Convex, first project
- [Plans Spec](/docs/plans) — plan structure, directory conventions, parsed fields
- [Source of Truth](/docs/source-of-truth) — how code, plans, and UI stay in sync
- [Sync](/docs/sync) — GitHub auto-sync webhook mechanism
- [AI Workflow](/docs/ai-workflow) — how the autonomous loop and agents work
- [Feature View](/docs/feature-view) — the three-panel UI for managing features

## License

MIT License — see [LICENSE](LICENSE) for details.

## Author

Created by **[Juan Elias Jabib](https://github.com/JuanEliasJabib02)**

Built with [OpenClaw](https://openclaw.ai)
