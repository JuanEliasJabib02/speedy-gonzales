# Chat Panel Shell

**Status:** todo

## What it does

Right panel with the chat UI. Shows message list with user/agent avatars, commit cards with GitHub links, and an input bar at the bottom.

## Checklist

- [x] Create `ChatPanel` component (shrink-0, bg-card)
- [x] Header: "Chat" title + "coming soon" badge + ThemeToggle
- [x] Message list: scrollable, user messages right-aligned (blue), agent left-aligned (gray)
- [x] User avatar: initial circle (from useCurrentUser)
- [x] Agent avatar: Zap icon in primary square
- [x] Commit messages: card with hash, message, files changed, GitHub link
- [x] Input bar: text input + send button (ghost, SendHorizontal icon)

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatPanel.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatMessage.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatInput.tsx`
