# Autonomous Dev Loop — Setup & Usage

## What it is

The **Autonomous Dev Loop** is the core feature of Speedy Gonzales — it turns your ticket backlog into working code while you sleep.

You write tickets. Charizard picks them up overnight, dispatches work to the coding agent, opens PRs, and sends you a Slack report in the morning.

No manual triggers. No babysitting. Just wake up to finished work.

---

## How it works

```
You create tickets in Speedy → go to sleep
        ↓
Charizard runs on your VPS on a schedule
        ↓
Picks up available tickets (todo → in_progress)
        ↓
Dispatches to coding agent (implements → commits → pushes → PR)
        ↓
Ticket moves to review
        ↓
8:00 AM — you get a Slack report with what was done
        ↓
You review the PRs and merge what looks good
```

Charizard never writes production code — it plans and orchestrates. The coding agent (Perro salchicha) implements. You review and approve the final step.

---

## Installation

### Prerequisites

- OpenClaw running on your VPS
- Speedy Gonzales deployed (Vercel + Convex)
- Slack workspace connected to OpenClaw

---

### Step 1 — Connect Slack to OpenClaw

In your `openclaw.json`, add the Slack plugin with your workspace token:

```json
{
  "plugins": {
    "slack": {
      "token": "xoxb-your-bot-token",
      "defaultChannel": "#dev-reports"
    }
  }
}
```

> Get your bot token from [api.slack.com/apps](https://api.slack.com/apps) — you need `chat:write` and `channels:join` scopes.

---

### Step 2 — Configure the cron job in OpenClaw

This cron triggers Charizard to run the loop on a schedule and send the morning report.

Add this to your `openclaw.json`:

```json
{
  "cron": [
    {
      "name": "autonomous-dev-loop",
      "schedule": "0 */2 * * *",
      "payload": {
        "kind": "agentTurn",
        "message": "Run the autonomous dev loop: check all active projects in Speedy, pick up available tickets, dispatch to Perro salchicha, and update statuses."
      },
      "sessionTarget": "isolated"
    },
    {
      "name": "daily-dev-report",
      "schedule": "0 8 * * *",
      "payload": {
        "kind": "agentTurn",
        "message": "Generate and send the daily dev loop report to Slack. Include completed tickets, PRs in review, and any blocked items that need attention."
      },
      "sessionTarget": "isolated",
      "delivery": {
        "mode": "announce",
        "channel": "slack"
      }
    }
  ]
}
```

> **Schedule explained:**
> - Loop runs every 2 hours (adjust to your preference)
> - Report fires at 8:00 AM — change to your timezone as needed

---

### Step 3 — Enable the loop per project in Speedy

In Speedy, go to your project's settings and configure:

| Field | What to fill |
|-------|-------------|
| **Autonomous Loop** | Toggle ON |
| **Repo path on VPS** | Path where the repo is cloned, e.g. `/home/juan/Projects/speedy-gonzales` |
| **Slack channel** | Channel for this project's reports, e.g. `#speedy-gonzales` |

Charizard only works on projects with the loop enabled and a repo path set. Everything else is ignored.

---

### Step 4 — Write good tickets

The loop is only as good as your ticket descriptions. A ticket that gets autonomously completed has:

- **Clear title** — what to build, not just a label
- **Description** — the specific behavior, file hints if relevant, acceptance criteria
- **No blockers** — dependencies resolved or documented

A vague ticket (`"fix the bug"`) will end up `blocked` with a note asking for more context.

---

## Daily Slack report

Every morning at 8:00 AM (or your configured time), Charizard sends a report to each project's Slack channel:

```
🤖 Autonomous Dev Loop — Overnight Report

📁 speedy-gonzales
  ✅ Completed → render-markdown (PR #42: link)
  🔄 In review → export-conversation (PR #43: link)
  🚫 Blocked → github-link-preview — needs API token in env

📁 action-experience
  ✅ Completed → fix-login-screen (PR #17: link)

⚠️ Needs your input:
  - github-link-preview in speedy-gonzales is blocked. Add GITHUB_TOKEN to env vars.
```

---

## What happens with failed or blocked tickets

If the coding agent runs into something unexpected:

- Code is reverted (`git revert`) — no broken code lands in the branch
- Ticket is moved to `blocked` with a clear explanation
- You see it in the morning report

You unblock the ticket (clarify the description, fix the dependency, add the env var) and it gets picked up in the next cycle.

---

## Expected success rate

| Ticket type | Autonomous success |
|-------------|-------------------|
| UI components (Tailwind + shadcn) | ~85% |
| Convex mutations / queries | ~75% |
| Integration features | ~65% |
| Known bugs with clear repro | ~50% |
| Vague bugs | ~25% |

**Average: ~70% of tickets complete without your involvement.**

The remaining 30% land in `blocked` with context — you resolve them in minutes, not hours.

---

## Local development — important note

**Speedy is cloud-first. There is no local mode worth using.**

> Even the person actively developing Speedy never runs it locally.  
> **Speedy self-develops in the cloud.** Tickets are created in Speedy → Perro salchicha implements → Vercel preview → review at the URL → merge.

Running `npm run dev` locally is technically possible, but you'd still connect to the same Convex cloud instance — so you'd only have the Next.js frontend locally. The loop, the agent, the reports — all of that still requires the VPS.

**Only run locally if:** you need to reproduce a frontend bug with browser devtools that doesn't show up on the Vercel preview URL. That's it.

---

## Related

- [Context Window doc](./context-window.md)
- [Feature plan — internal](../plans/features/autonomous-dev-loop/_context.md)
