# Commit-Ticket Linking

**Status:** completed
**Priority:** medium

## What it does

Automatically link commits to their tickets based on commit message patterns. When viewing the commit timeline, each commit shows which ticket it belongs to. When viewing a ticket, show its related commits.

## Checklist

- [x] Parse commit messages for ticket references (e.g. `feat(plans): create ticket dark-mode` → links to `dark-mode.md`)
- [x] Match commit message keywords to ticket slugs in the feature
- [x] In CommitTimeline: show ticket pill/badge on each commit card
- [x] In PlanViewer: show linked commits section below the plan content (already built in CommitsSection)
- [x] Store commit-ticket links in Convex for fast queries (commits field on tickets schema, populated during sync)
