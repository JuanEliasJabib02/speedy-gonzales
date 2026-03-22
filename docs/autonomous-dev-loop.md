# Autonomous Dev Loop — How it works in Speedy Gonzales

## TL;DR

The **Autonomous Dev Loop** is the core feature that turns Speedy from an "IDE without an editor" into a **development team that works while you sleep**.

You define the tickets. Charizard runs overnight on the VPS, picks up available work, dispatches it to the coding agent (Perro salchicha), opens PRs, and sends you a Slack report in the morning.

---

## The loop (a typical night)

```
23:00 — You create tickets in Speedy and go to sleep
         ↓
Every N minutes — Cron fires Charizard
         ↓
Charizard queries Convex → any tickets in `todo` with a configured project?
         ↓
      YES → Analyzes file dependencies between pending tickets
            → Queues in order (nothing in parallel touching the same files)
            → Dispatches first ticket to the coding agent
            → Agent works: code → commit → push → PR → status: review
            ↓
      NO (everything blocked) → Charizard notifies you on Slack:
            "Nothing to do — these tickets are blocked: [list]. Need your input."
         ↓
08:00 — You get a report on Slack:
         "Worked on [project X]: completed [ticket A] and [ticket B].
          [Ticket C] is blocked: reason. [Ticket D] in review: PR link."
```

---

## Layers of the system

| Layer | Who | What they do |
|-------|-----|-------------|
| **Planning** | Charizard | Reads projects, analyzes dependencies, queues tickets, writes the report |
| **Execution** | Perro salchicha (Claude Code) | Implements the ticket, commits, pushes, opens the PR |
| **Review** | You | Approves PRs, unblocks tickets, moves to `completed` |

Charizard never writes production code. Perro salchicha never plans. The loop only works because both stay in their lane.

---

## Operating rules

### Charizard (planning layer)
- Before dispatching, checks which files each ticket touches
- **Nothing runs in parallel if it touches the same files** — strict queue
- If two tickets both modify `ChatPanel.tsx`, they run sequentially, not simultaneously
- If all available tickets are blocked → notifies you, does not guess

### Perro salchicha (execution layer)
- If the ticket description is unclear → immediately marks `blocked`, does not interpret
- If something breaks during execution → `git revert` + ticket to `blocked` with an explanation
- **Never pushes broken code** — revert is always the safe exit
- Always ends in `review`, never in `completed` — you approve the final step

---

## Daily Slack report

**When:** configurable cron (default: 8:00 AM Bogotá)  
**Where:** Slack — channel configured per project (set in Speedy's project settings)  
**Fallback:** default Slack channel if no project-specific channel is configured

**Report format:**
```
🤖 Autonomous Dev Loop — Overnight Report

📁 speedy-gonzales
  ✅ Completed → ticket-foo (PR: link)
  🔄 In review → ticket-bar (PR: link)
  🚫 Blocked → ticket-baz — reason: undeclared dependency

📁 action-experience
  ✅ Completed → ticket-qux (PR: link)

⚠️ Needs your input:
  - ticket-baz in speedy-gonzales is blocked. Unblock?
```

---

## Project configuration

Each project in Speedy has three fields that control the loop:

| Field | Type | Purpose |
|-------|------|---------|
| `autonomousLoop` | boolean | Enables the loop for this project |
| `localPath` | string | Path on the VPS where the repo is cloned (e.g. `/home/juan/Projects/speedy-gonzales`) |
| `slackChannel` | string | Slack channel for reports (e.g. `#speedy-gonzales`) |

Charizard only works on projects where `autonomousLoop: true` and `localPath` is set. Everything else is ignored.

---

## Speedy local vs Speedy cloud

### TL;DR: **Speedy lives in the cloud. Always.**

Speedy Gonzales is a cloud-first app. Running it locally is not a supported workflow.

**Why?**
- Convex is cloud — there is no real local mode
- The autonomous loop runs on the OpenClaw VPS — requires connection
- Notifications go to Slack — requires internet
- PRs are opened on GitHub — requires internet
- The daily report goes to Slack — requires internet

**When does local make sense?**

One case only: **when Speedy itself has a bug you need to reproduce with devtools open**.

> **Even the person actively developing Speedy never uses local.**  
> Speedy self-develops in the cloud. The flow is:  
> Describe the ticket in Speedy (cloud) → Perro salchicha implements → Vercel preview → review at the URL → merge.

You could technically run `npm run dev` locally, but you'd still connect to the same cloud Convex instance — so "local" would only mean the Next.js frontend. Not worth it unless the bug is specifically in the frontend and doesn't reproduce on the preview URL.

**Official recommendation:** Speedy local = debugging Speedy. Nothing else.

---

## Expected success rate

| Ticket type | Autonomous success |
|-------------|-------------------|
| UI components (Tailwind + shadcn) | ~85% |
| Convex mutations / queries | ~75% |
| Integration features (Convex + UI) | ~65% |
| Debugging known bugs | ~50% |
| Debugging vague bugs | ~25% |

**Overall average: ~70% of tickets complete overnight on their own.**

The remaining 30% end up `blocked` with a clear note explaining why — and you resolve them the next morning.

---

## Related

- [Context Window doc](./context-window.md)
- [Agent Repo Push ticket](../plans/features/chat/agent-repo-push.md)
- [Autonomous Dev Loop feature plan](../plans/features/autonomous-dev-loop/_context.md)
