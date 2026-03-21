# GitHub Link Preview in Chat

**Status:** todo
**Priority:** medium

## What it does

When the agent sends a GitHub URL, intercept it and render a rich preview card inside the chat instead of (or below) a plain link. Makes it easy to see what the agent is referencing without leaving the app.

## Two levels

### Level 1 — Generic link preview
- Detect any GitHub URL in the message
- Fetch OpenGraph metadata via a server-side proxy (to avoid CORS)
- Render a card: title, description, favicon/avatar

### Level 2 — GitHub-specific inline renderer
Detect URL type and render tailored content:
- `github.com/.../commit/<sha>` → show commit message + diff summary (reuse `parseCommitRefs`)
- `github.com/.../blob/.../<file>` → show file content with syntax highlighting
- `github.com/.../pull/<n>` → show PR title, status (open/merged/closed), author

## Checklist

- [ ] Detect GitHub URLs in rendered message content
- [ ] Create a server-side `/api/link-preview` route to fetch OG metadata (avoids CORS)
- [ ] Render `LinkPreviewCard` component below the link text
- [ ] Implement commit URL renderer (Level 2 - commit)
- [ ] Implement blob/file URL renderer (Level 2 - file)
- [ ] Implement PR URL renderer (Level 2 - PR)
- [ ] Lazy-load previews (don't block message render)
- [ ] Cache preview results in Convex or session storage

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatMessage.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/LinkPreviewCard.tsx` (new)
- `src/app/api/link-preview/route.ts` (new)

