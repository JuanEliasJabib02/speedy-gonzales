![speedy gonzales](https://github.com/user-attachments/assets/eb8651eb-614c-4e83-9c3b-fd48c4bbeef4)

# SpeedIDE 🏎️

Hi, I'm **Juan Elías** 🫏🇨🇴 — Colombian dev.

I built this for myself. I got tired of jumping between Jira, GitHub, Slack, and markdown files just to move a ticket forward. Too much context-switching, too little actual building.

SpeedIDE is my personal workflow: AI writes the code, I write in plain language, and everything lives in one place. The goal is simple — ship faster and get my life back.

Not a startup. Not a pitch. Just a tool that works the way I think.

---

Meet the team:

**🔥 Charizard** — my main AI agent. Orchestrator, strategist, memory keeper.

**🌭 Perro Salchicha** — the autonomous dev agent. Give him a ticket and he codes it, commits it, and pushes it.

---

## What it does

SpeedIDE connects your GitHub repos, parses your `plans/features/` Markdown files, and gives you:

- **Dashboard** — all your projects with real-time progress bars
- **Kanban** — features organized by status, synced to your repo
- **Feature View** — sidebar with tickets + plan viewer + AI chat, all in one panel
- **Agent Chat** — talk to your AI agent with full project context. It can create tickets, update statuses, and push changes — all from the conversation

The full loop:

```
You (chat) → agent reads/writes plans → git push → GitHub webhook → Convex → UI updates in real time
```

No manual sync. No tab switching. No losing context.

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15 + Tailwind CSS + shadcn/ui |
| Database & Real-time | Convex |
| Auth | Convex Auth (magic link) |
| AI / Streaming | Vercel AI SDK + OpenAI-compatible API |
| Agent backend | [OpenClaw](https://openclaw.ai) |
| Deployment | Vercel |

---

## How it works

Plans live as `.md` files inside your repo:

```
plans/
└── features/
    ├── auth/
    │   ├── _context.md      ← epic overview
    │   ├── magic-link.md    ← ticket
    │   └── route-protection.md
    ├── chat/
    │   ├── _context.md
    │   └── streaming-ux.md
```

SpeedIDE reads these files via GitHub API, parses the frontmatter (`**Status:**`, `**Priority:**`, checklists), and stores everything in Convex. When your agent pushes a change to a plan file, the webhook fires and your UI updates in seconds.

---

## Self-hosted setup

You bring your own keys. No vendor lock-in, no subscription.

What you need:
- A [Convex](https://convex.dev) project (free tier works)
- A GitHub Personal Access Token with `repo` scope
- A [Resend](https://resend.com) API key for magic link emails
- An [OpenClaw](https://openclaw.ai) instance (for the AI agent chat)

---

## Running locally

```bash
# Clone
git clone https://github.com/JuanEliasJabib02/speedy-gonzales.git
cd speedy-gonzales

# Install
pnpm install

# Set env vars (copy from .env.example)
cp .env.example .env.local

# Start Convex + Next.js
pnpm dev
```

---

## Plans format

```markdown
# Ticket Title

**Status:** todo
**Priority:** medium

## What it does

Short description.

## Checklist

- [x] Done step
- [ ] Pending step
```

Status values: `todo` | `in-progress` | `review` | `completed` | `blocked`

---

*Built by Juan Elías with Charizard 🔥 and Perro Salchicha 🌭*
