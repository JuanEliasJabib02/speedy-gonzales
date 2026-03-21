# Chat Messages Schema

**Status:** todo

## What it does

Convex schema for storing chat messages. Each message belongs to an epic (feature) and has a role (user or assistant).

## Checklist

- [ ] Create `convex/schema/chatMessages.ts`
- [ ] Define fields: epicId, role, content, type, commitData, actions, createdAt
- [ ] Add index `by_epic` on [epicId]
- [ ] Add index `by_epic_created` on [epicId, createdAt] for ordered retrieval
- [ ] Export and register in main schema

## Schema

| Field | Type | Description |
|-------|------|-------------|
| epicId | Id<"epics"> | Feature this chat belongs to |
| role | "user" \| "assistant" | Who sent it |
| content | string | Message text |
| type | "text" \| "commit" | Message type |
| commitData | object (optional) | Commit hash, message, url, filesChanged |
| actions | string[] (optional) | Actions the agent took |
| createdAt | number | Timestamp |
