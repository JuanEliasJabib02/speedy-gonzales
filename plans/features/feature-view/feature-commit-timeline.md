# Feature Commit Timeline

**Status:** review
**Priority:** high

## What it does

Replace the chat panel (right side) with a commit timeline that shows all commits related to the current feature/epic. This is the primary way the user reviews what the agent has done — see all pushes, diffs, and file changes at a glance.

## User flow

1. User opens a feature → ticket sidebar (left) + plan viewer (center) + commit timeline (right)
2. Commit timeline shows all commits for this feature's branch, newest first
3. Each commit shows: hash, message, author, timestamp, files changed count
4. Click a commit → expand to see the file diff inline (reuse CommitDiffPanel)
5. Commits related to a specific ticket are grouped/tagged with the ticket slug

## Checklist

- [x] Create `CommitTimeline` component — fetches commits from GitHub API for the feature branch
- [x] Render commit cards in a vertical timeline layout (newest first)
- [x] Each card: short hash, commit message, relative timestamp, files changed badge
- [x] Click to expand → show file diffs inline (reuse existing CommitDiffPanel / diff viewer)
- [x] Tag commits with ticket slugs when commit message contains the ticket name (e.g. `feat(chat): ...` → matches chat tickets)
- [x] Filter: show all commits or filter by ticket
- [x] Empty state: "No commits yet" when the branch has no pushes
- [x] Wire into FeatureLayout as the right panel (replacing ChatPanel)
