# Render Clickable Links in Chat Messages

**Status:** todo
**Priority:** medium

## What it does

Currently chat messages render as plain text. When the agent responds with URLs (GitHub links, commit URLs, file paths, docs links), they should be clickable. Makes the chat useful for navigation without copy-pasting.

## Checklist

- [ ] Parse URLs in message content (https://, http://)
- [ ] Render as `<a>` tags with `target="_blank"` and `rel="noopener noreferrer"`
- [ ] Style links with `text-primary underline` to distinguish from regular text
- [ ] Handle GitHub-specific links: commit URLs, PR URLs, file URLs
- [ ] Handle relative file paths (e.g. `src/app/...`) — optionally link to GitHub blob view
- [ ] Preserve markdown-style links `[text](url)` if the agent uses them

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatMessage.tsx`
