# Self-Improving Agent Loop

**Status:** backlog
**Priority:** medium

## Overview

The system learns from its own mistakes and gets better over time — automatically. When Juan approves a ticket "with fixes", the system analyzes what went wrong, extracts the pattern, and adds rules to the agent's config so the same mistake never happens again.

Combined with the analytics data (clean vs with-fixes vs blocked), this creates a feedback loop: measure → diagnose → fix → measure again.

## How it works

1. **Post-review learning:** When a ticket is "approved with fixes", diff Juan's fix vs Perro's code. Extract what Perro missed. Auto-add a rule to `.claude/rules/` for that repo.

2. **Analytics-driven improvement:** When quality rate drops below a threshold for a repo, review the "with-fixes" tickets, find common patterns, and update `.claude/` config.

3. **Prompt evolution:** Track which instructions Perro ignores most. Strengthen those in the dispatch prompt. Measure if it improves.

## Architecture decisions

- Rules are per-repo (`.claude/rules/`) — what works for Next.js might not work for Expo
- Learning happens after merge (Juan's fix is on main, Perro's original is on the branch → diff)
- New rules are committed as PRs for Juan to review — the system doesn't silently change its own config
- This is a Charizard-level feature (orchestrator logic), not Perro-level (executor)

## Still needs

- [ ] Post-review diff analysis — extract patterns from "with-fixes" tickets
- [ ] Auto-generate .claude/rules/ from patterns
- [ ] Quality threshold alerts — notify when quality drops
- [ ] Prompt evolution tracking — which instructions get ignored
