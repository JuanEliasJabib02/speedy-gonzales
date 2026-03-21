# Notification Center

**Status:** todo
**Priority:** medium

## What it does

Bell icon in the app header with an unread badge. Click to open a dropdown with recent notifications, each linking to the relevant feature/project.

## Checklist

- [ ] Add bell icon to app header (next to user avatar)
- [ ] Show unread count badge (red dot or number)
- [ ] Dropdown: list of notifications sorted by date, unread first
- [ ] Each notification: icon (type), title, body snippet, relative time, read/unread state
- [ ] Click notification → navigate to relevant page + mark as read
- [ ] "Mark all read" button
- [ ] Empty state: "No notifications yet"
- [ ] Reactive — updates in real time via Convex

## Files

- `src/app/[locale]/(app)/layout.tsx` or header component
- `src/lib/components/common/NotificationCenter.tsx` (new)
