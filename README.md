![speedy gonzales](https://github.com/user-attachments/assets/eb8651eb-614c-4e83-9c3b-fd48c4bbeef4)

# Speedy Gonzales 🏎️

> **The IDE without an editor** — plan features, command AI agents to code, and track everything in real-time.

---

Hi, I'm **Juan Elías** 🫏 — a Colombian dev, and this is my vision of how to develop super fast.

I got tired of jumping between Slack, GitHub, Jira, and a dozen Markdown files just to keep track of what my AI agents were doing. So I built Speedy Gonzales: a single command center where I plan features, talk to my agents, and watch everything update in real time.

I didn't build this alone. Meet the team:

**🔥 Charizard** — my main AI agent. Orchestrator, strategist, memory keeper. He sees the big picture, manages context, and tells Perro Salchicha what to do.

**🌭 Perro Salchicha** — the autonomous dev agent. Give him a ticket and he codes it, commits it, and pushes it. He doesn't ask questions. He ships.

Built with AI agents. For AI agents.

---

## What it does

Speedy Gonzales connects your GitHub repos, parses your `plans/features/` Markdown files, and gives you:

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

Speedy reads these files via GitHub API, parses the frontmatter (`**Status:**`, `**Priority:**`, checklists), and stores everything in Convex. When your agent pushes a change to a plan file, the webhook fires and your UI updates in seconds.

---

## Self-hosted setup

Speedy is designed so **you bring your own keys**. No vendor lock-in, no subscription.

What you need:
- A [Convex](https://convex.dev) project (free tier works)
- A GitHub Personal Access Token with `repo` scope
- A [Resend](https://resend.com) API key for magic link emails
- An [OpenClaw](https://openclaw.ai) instance (for the AI agent chat)

See the [Setup Guide →](https://your-speedy-url/docs/setup)

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
# Fill in NEXT_PUBLIC_CONVEX_URL, OPENCLAW_BASE_URL, etc.

# Start Convex + Next.js
pnpm dev
```

---

## Plans format

Each plan file follows this format:

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

Full spec: [`plans/SPEC.md`](./plans/SPEC.md)

---

## Contributing

Open source, MIT license. PRs welcome.

If Speedy saves you time, consider [buying me a coffee ☕](https://github.com/JuanEliasJabib02) — or just give the repo a ⭐. It means a lot.

---

*Built by Juan Elías with Charizard 🔥 and Perro Salchicha 🌭*
