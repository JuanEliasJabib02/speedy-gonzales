# Perro Prompt Injection from Convex

**Status:** todo
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Update the autonomous-loop skill so when dispatching Perro, the ticket plan is fetched from Convex (not read from a `.md` file). The plan content gets injected directly into Perro's prompt.

## Checklist

- [ ] Update `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md` — in Step 4c (Perro dispatch), instead of "Read the ticket plan at: {ticket.path}", fetch the plan via: `curl -s "https://necessary-fish-66.convex.site/get-ticket-plan?repoOwner={repoOwner}&repoName={repoName}&ticketPath={ticket.path}"` and inject the response content into the prompt
- [ ] The prompt should include the plan content inline: "Here is your ticket plan:\n\n{plan_content}\n\nImplement everything in the checklist."
- [ ] Perro no longer needs to `cat` any `.md` plan file — the plan is in his prompt
- [ ] If the API call fails (Convex down), fall back to reading the `.md` file if it exists. Log a warning.
- [ ] Update Step 3 (dependency analysis) — instead of reading `.md` files for file lists, parse the plan content from the Convex API response

## Files

- `~/.openclaw/workspace/skills/autonomous-loop/SKILL.md` — modify Step 4c dispatch prompt and Step 3 dependency analysis

## Patterns to follow

- Reference: current autonomous-loop Step 4c — the curl call to `/update-ticket-status` shows the pattern for calling Convex endpoints
- The `todoTickets` response from `/autonomous-loop/status` already returns ticket paths — use those to fetch plans
