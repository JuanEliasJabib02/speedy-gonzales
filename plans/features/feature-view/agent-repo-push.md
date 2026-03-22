# Agent Repo Push (Full Loop)

**Status:** completed
**Priority:** critical

## What it does

The agent (Charizard) can create tickets, update plan files, and push changes to GitHub — all from a chat message. This closes the full loop: chat → commit → webhook → live update in Speedy.

## Examples

User: "Create a ticket for dark mode toggle"
→ Agent creates `plans/features/ui/dark-mode-toggle.md`, commits, pushes
→ Webhook fires → ticket appears in Speedy in real time

User: "Move syntax-highlighting to in-progress"
→ Agent updates `plans/features/chat/syntax-highlighting.md` status field, commits, pushes
→ Ticket status updates in Kanban automatically

## How it works

Charizard already has:
- The repo cloned on the VPS (`~/Projects/speedy-gonzales` or equivalent)
- SSH deploy key with write access to the repo
- Tool access to read/write files and run git commands

What needs to be added:
- System prompt instructions telling Charizard HOW to format plan files
- System prompt includes the repo path so Charizard knows where to write
- The `<actions>` metadata format to signal what was done (for ActionCards)

## Checklist

- [ ] Include repo clone path in system prompt (from project settings or env var)
- [ ] Add plan file format spec to system prompt (already in route.ts, verify it's complete)
- [ ] Add example interaction showing agent creating/updating a ticket
- [ ] Add `SPEEDY_REPO_PATH` env var or derive from project repoOwner/repoName
- [ ] Test end-to-end: ask agent to create a ticket → verify it appears in Speedy

## Files

- `src/app/api/chat/route.ts` — update system prompt with repo path + examples
- `plans/features/chat/enrich-system-spec.md` — already exists, check if covers this

## Notes

- The plan file format spec is already in the system prompt (buildSystemMessage)
- Charizard needs to know the local path of the cloned repo on the VPS
- For security: Charizard should only push to the project's configured repo/branch
