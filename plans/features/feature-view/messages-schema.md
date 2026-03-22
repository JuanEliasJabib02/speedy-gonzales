# Chat Messages Schema

**Status:** review
**Priority:** medium

## What it does

Convex schema for storing chat messages. Each message belongs to an epic (feature) and has a role (user or assistant).

## Checklist

- [x] Create `convex/schema/chatMessages.ts`
- [x] Define fields: epicId, role, content, metadata, createdAt
- [x] Add index `by_epic` on [epicId]
- [x] Export and register in main schema

## Schema

| Field | Type | Description |
|-------|------|-------------|
| epicId | Id<"epics"> | Feature this chat belongs to |
| role | "user" \| "assistant" | Who sent it |
| content | string | Message text |
| metadata | any (optional) | Commit data, actions, etc. |
| createdAt | number | Timestamp |

