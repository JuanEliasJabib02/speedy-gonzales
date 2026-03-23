# Review Visibility

**Status:** todo
**Priority:** high

## Overview

When a ticket reaches `review`, Juan needs fast access to what changed — both at the kanban level (which PR to open) and at the ticket level (which commits to inspect). Right now the infrastructure exists (commit cards in PlanViewer, PR creation via API) but the data isn't being written or surfaced in the right places.

This feature closes the gap so Juan can go from kanban → PR → diff in seconds.

## Architecture decisions

- Commits: Perro writes a `## Commits` section in the ticket `.md` after pushing. The sync engine already parses this and the PlanViewer already renders commit cards with diffs. Just needs the data.
- PR link: stored as `prUrl` on the epic in Convex. Charizard writes it when creating the PR via GitHub API. The FeatureCard on the kanban shows a small GitHub link icon when the epic is in `review` status.

## Still needs

- [ ] Autonomous-loop skill writes commit SHAs to ticket .md files
- [ ] PR link on kanban FeatureCard when epic is in review
