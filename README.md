# Speedy 🏎️

Your AI dev command center. You say what to build. Agents build it. You review and ship.

## What is this?

Speedy is where you manage everything your AI agents are building. It's not an IDE — you don't write code here. You see features, track progress, and review results.

```
You → "build X" → Agent creates plan in Convex → Kanban updates instantly
                 → Claude Code starts coding → Pushes to feature branch
                 → Ticket moves to review → You review the PR → Ship
```

## How it works

**Plans and state live in Convex.** Not git, not files, not webhooks. Direct API calls. Instant. Reactive.

**Agents manage everything:**
- Create features and tickets via Convex API
- Dispatch Claude Code (Sonnet) to write the code
- Update ticket status in real-time
- Epic status auto-calculates from tickets

**You do two things:**
1. Move features from backlog → todo (queue them for work)
2. Review PRs and move epics from review → completed

That's it.

## Architecture

```
Convex          → single source of truth (plans + state)
GitHub          → code only (no plan files)
OpenClaw        → agent runtime (dispatch, crons, Telegram)
Vercel          → frontend hosting
```

## The agents

| Agent | Model | Job |
|-------|-------|-----|
| 🔥 Charizard | Opus | PM — creates plans, dispatches work, orchestrates |
| 🤖 Claude Code | Sonnet | Developer — codes, pushes, updates status |
| 💪 Goku | Opus | PM of Action Black — manages work repos |
| 💰 Toallin | Sonnet | Finance — expense tracking |

## The loop

Every hour, an autonomous loop checks for `todo` tickets. If found, it dispatches Claude Code. No human intervention needed.

```
Backlog → You move to Todo → Loop dispatches → In Progress → Review → You complete
```

## Stack

- **Next.js** — frontend
- **Convex** — backend, database, real-time subscriptions
- **Tailwind + shadcn/ui** — UI
- **OpenClaw** — agent orchestration
- **Claude (Anthropic)** — AI models

## Cost

~$8/month idle. ~$1-2 per ticket when Claude Code is working.

## Rules

- Agents never merge to main. Always PR. You merge.
- Agents move tickets to review. You move to completed.
- Epic status auto-calculates. Never auto-completes — that's your call.
- Features start in backlog. You decide what enters the queue.

---

Built by Juan with AI agents. The code in this repo was largely written by Claude Code, orchestrated by Charizard.
