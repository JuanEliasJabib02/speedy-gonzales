# Syntax Highlighting in Chat Messages

**Status:** todo
**Priority:** high

## What it does

Code blocks in chat messages render as plain text. Add syntax highlighting + copy button so code is readable and usable.

## Checklist

- [ ] Install `shiki` or `react-syntax-highlighter`
- [ ] Detect fenced code blocks in message content (` ```lang ... ``` `)
- [ ] Render code blocks with syntax highlighting (language auto-detected from fence)
- [ ] Add "Copy" button on each code block (copies raw code to clipboard)
- [ ] Style: dark background, consistent with app theme

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatMessage.tsx`
