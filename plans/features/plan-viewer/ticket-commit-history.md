# Ticket Commit History + Review Flow

**Status:** review
**Priority:** high

## What it does

When a ticket is in "review" status, show the related commits in the PlanViewer so the reviewer can inspect the code without leaving Speedy. Includes a "Mark as completed" button to close the review loop.

## User flow

1. Ticket moves to "review" → appears in sidebar with review badge
2. User clicks the ticket → PlanViewer opens
3. Below the plan content, a "Commits" section shows commit cards (hash, message, files changed)
4. User clicks a commit card → CommitDiffPanel opens (already built) showing the full diff
5. If a Vercel preview URL exists for the branch, show a "Preview" link button next to the commits
6. User clicks "✅ Mark as completed" in the diff panel or in PlanViewer
7. Ticket status updates to "completed" in Convex (and agent pushes the plan file change)

## Vercel Preview URL

The agent includes the branch name in the plan file when finishing a ticket:

```markdown
## Commits

- `abc1234` feat(chat): syntax highlighting component

## Branch

feature/syntax-highlighting
```

The preview URL is derived from the branch name following Vercel's pattern:
`https://{project-name}-{branch-slug}.vercel.app`

Or stored explicitly if the agent knows the deploy URL.

Show as a button: `🔗 Preview on Vercel` → opens the preview URL in a new tab.

## Implementation

### Part 1 — Store commits in ticket metadata
When the agent (Perro) finishes a ticket, include the commit hashes in the plan file:

```markdown
## Commits

- `abc1234` feat(chat): syntax highlighting component
- `def5678` fix(chat): handle empty content edge case
```

The sync engine already parses the body — add a `parseCommits()` function that extracts hashes from `## Commits` section.

### Part 2 — Display commits in PlanViewer
In `PlanViewer.tsx`:
- Parse `## Commits` section from plan content
- Render commit cards (reuse `CommitCard` from `ChatMessage.tsx`) below the markdown content
- Fetch commit details from GitHub API (reuse `/api/commit-diff` route)
- Only show this section when ticket status is "review" or "completed"

### Part 3 — "Mark as completed" button
- Add button in PlanViewer header when status is "review"
- On click: call Convex mutation to update ticket status to "completed"
- Also update the plan file in GitHub (agent pushes `**Status:** completed`)
- Show success toast

### Part 4 — CommitDiffPanel integration
- CommitDiffPanel (already exists) gets a "Mark as completed" button when opened from PlanViewer context
- Pass `ticketId` + `onComplete` callback as props

## Checklist

- [x] Add `parseCommits(body: string)` to `convex/model/parsePlan.ts` — extract commit hashes from `## Commits` section
- [x] Update sync engine to store parsed commits in ticket record (`convex/schema.ts` + upsert logic)
- [x] Add `CommitsSection` component in PlanViewer.tsx — renders commit cards for tickets in review/completed
- [x] Fetch commit details from `/api/commit-diff` for each commit hash
- [x] Add "Mark as completed" button in PlanViewer header (only when status = "review")
- [x] Wire "Mark as completed" to Convex mutation + GitHub plan file update
- [x] Pass `onMarkComplete` prop to CommitDiffPanel when opened from PlanViewer

## Files

- `convex/model/parsePlan.ts` — add parseCommits()
- `convex/schema.ts` — add commits field to tickets
- `convex/githubSync.ts` — store commits during upsert
- `src/app/.../PlanViewer.tsx` — CommitsSection + Mark as completed
- `src/app/.../CommitDiffPanel.tsx` — add Mark as completed button
- `src/app/.../TicketSidebar.tsx` — review badge already exists, verify
