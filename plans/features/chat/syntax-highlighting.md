# Syntax Highlighting in Chat Messages

**Status:** completed
**Priority:** high

## What it does

Code blocks in chat messages render as plain text. Add syntax highlighting + copy button so code is readable and usable.

## Checklist

- [x] Install `shiki` or `react-syntax-highlighter`
- [x] Detect fenced code blocks in message content (` ```lang ... ``` `)
- [x] Render code blocks with syntax highlighting (language auto-detected from fence)
- [x] Add "Copy" button on each code block (copies raw code to clipboard)
- [x] Style: dark background, consistent with app theme

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatMessage.tsx`
