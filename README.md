![speedy gonzales](https://github.com/user-attachments/assets/eb8651eb-614c-4e83-9c3b-fd48c4bbeef4)

# 🏎️ Speedy Gonzales

**You write the plan. AI builds it while you sleep.**

Speedy Gonzales is an autonomous development orchestrator. Define features in plain markdown, and AI agents code them 24/7 — picking tickets by priority, writing code, pushing branches, creating PRs, and updating a real-time kanban. You review when you're ready.

## How it works

```
You define a feature → tickets are created as .md files in your repo
                              ↓
         The loop fires every 30 minutes (cron)
                              ↓
     Picks the highest priority "todo" ticket
                              ↓
    AI agent reads the plan, codes the solution
                              ↓
      Pushes to a feature branch automatically
                              ↓
        Kanban updates in real-time (before PR merge)
                              ↓
           PR is created on GitHub
                              ↓
         Loop picks the next ticket. Repeat.
                              ↓
          You wake up. Review. Approve.
```

## Why Speedy

- **Fully autonomous** — no prompting, no babysitting. Define the work, walk away.
- **Git is the source of truth** — plans are `.md` files in your repo. No vendor lock-in.
- **Real-time kanban** — watch tickets move from `todo` → `in-progress` → `review` as agents work.
- **Stack-agnostic** — works with any repo. Next.js, Expo, FastAPI, Shopify, whatever. Each repo defines its own conventions via `.claude/` adapters.
- **Agent-agnostic** — uses Claude Code today, swap in Codex, OpenHands, or anything tomorrow.
- **Open source** — inspect everything. Trust the system.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Your Repo                      │
│                                                  │
│  plans/features/                                 │
│    ├── auth/                                     │
│    │   ├── _context.md      ← feature overview   │
│    │   ├── login-flow.md    ← ticket             │
│    │   └── oauth-setup.md   ← ticket             │
│    ├── dashboard/                                │
│    │   ├── _context.md                           │
│    │   └── progress-bar.md                       │
│    └── ...                                       │
│                                                  │
│  .claude/                   ← agent conventions  │
│  src/                       ← your code          │
└──────────────────┬──────────────────────────────┘
                   │
                   │  git sync (webhooks)
                   ▼
┌──────────────────────────────────────────────────┐
│              Convex (real-time DB)                │
│                                                  │
│  Syncs .md plans → real-time kanban state         │
│  Status updates before PR merge (HTTP endpoint)  │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│            Speedy UI (Next.js)                    │
│                                                  │
│  Dashboard → Features → Kanban → Plan Viewer     │
│  Real-time updates • Commit diffs • PR links     │
└──────────────────────────────────────────────────┘
                   │
                   │  autonomous loop (cron)
                   ▼
┌──────────────────────────────────────────────────┐
│            Orchestrator (OpenClaw)                │
│                                                  │
│  Every 30 min:                                   │
│    1. Query todo tickets                         │
│    2. Pick highest priority                      │
│    3. Dispatch AI agent                          │
│    4. Agent codes → pushes → creates PR          │
│    5. Kanban updates in real-time                │
│    6. Repeat                                     │
└──────────────────────────────────────────────────┘
```

## Tech Stack

- **Frontend:** Next.js 15, Tailwind CSS, shadcn/ui
- **Backend:** Convex (real-time database + serverless functions)
- **Orchestration:** OpenClaw (agent management + cron loop)
- **AI Agent:** Claude Code (swappable)
- **Hosting:** Vercel

## Getting Started

```bash
# Clone
git clone https://github.com/JuanEliasJabib02/speedy-gonzales.git
cd speedy-gonzales

# Install
pnpm install

# Configure Convex
npx convex dev

# Run
pnpm dev
```

## License

MIT License — see [LICENSE](LICENSE) for details.

## Author

Created by **[Juan Elias Jabib](https://github.com/JuanEliasJabib02)**

Built with [OpenClaw](https://openclaw.ai)
