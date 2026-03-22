# Commit-Ticket Linking

**Status:** in-progress
**Priority:** medium

## What it does

Automatically link commits to their tickets based on commit message patterns. When viewing the commit timeline, each commit shows which ticket it belongs to. When viewing a ticket, show its related commits.

## Checklist

- [ ] Parse commit messages for ticket references (e.g. `feat(plans): create ticket dark-mode` → links to `dark-mode.md`)
- [ ] Match commit message keywords to ticket slugs in the feature
- [ ] In CommitTimeline: show ticket pill/badge on each commit card
- [ ] In PlanViewer: show linked commits section below the plan content (already partially built in ticket-commit-history)
- [ ] Store commit-ticket links in Convex for fast queries
