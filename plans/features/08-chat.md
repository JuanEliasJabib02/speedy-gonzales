# Feature 8: OpenClaw Chat

**Status:** todo
**Phase:** 5

## What it does

The right panel in the Feature View. A chat where you talk to your OpenClaw agent about the current feature. The agent can read plans, create tickets, modify plans, and push changes — all from the conversation.

**This is NOT a generic AI chat.** The backend is OpenClaw — your agent with full context, memory, and execution access. It doesn't generate text — it executes.

**Speedy Gonzales replaces Slack as your agent interface.**

## How it works

```
User types message
    │
    ▼
Convex action: sendMessage(epicId, message, context)
    │
    ├── Context includes: project, repo, feature, current plan, chat history
    │
    ▼
OpenClaw API (TBD — protocol needs research)
    │
    ├── Agent processes the message with full project context
    ├── Agent decides what to do (answer, edit plan, create ticket, code)
    ├── Agent executes (git operations, file edits, commits, pushes)
    │
    ▼
Response saved to Convex
    │
    ├── Chat UI updates in real-time
    └── If agent pushed → webhook fires → sidebar + plan viewer update too
```

## Chat scope

- **One chat per feature (epic)**
- The agent knows which feature you're in and all its tickets
- If you need something specific about a ticket, say "fix the Login ticket" — the agent has the context
- History is persistent — you can come back later and continue the conversation

## What you can do from the chat

- Ask the agent to explain a plan
- Tell the agent to create new tickets ("add a 2FA ticket to Auth")
- Tell the agent to modify an existing plan ("change the priority of Login to low")
- Tell the agent to start working on a ticket ("start coding the Login ticket")
- Ask for a status update ("what's the progress on Auth?")
- Tell the agent to split a big ticket into smaller ones

## What the agent sends back

- **Text response** — displayed as a message bubble
- **Actions taken** — "Created ticket: 2FA Setup", "Pushed to repo", "Moved Login to completed"
- **Plan updates** — if the agent pushed changes, the plan viewer and sidebar refresh in real-time via webhook

## Context sent with each message

```typescript
{
  message: string                    // User's text
  projectId: Id<"projects">
  epicId: Id<"epics">
  repoUrl: string                    // e.g., "github.com/user/repo"
  branch: string                     // e.g., "main"
  plansPath: string                  // e.g., "plans/"
  currentPlanContent: string | null  // Currently viewed PLAN.md (if any)
  chatHistory: Message[]             // Previous messages in this conversation
}
```

## Chat storage

### chat_messages table

| Field | Type | Description |
|-------|------|-------------|
| epicId | Id<"epics"> | Feature this chat belongs to |
| role | "user" \| "assistant" | Who sent it |
| content | string | Message text |
| actions | string[] (optional) | Actions the agent took |
| createdAt | number | Timestamp |

Index: `by_epic` → `[epicId]`

## OpenClaw connection (TBD)

The technical details of how Speedy Gonzales communicates with OpenClaw need research:

- **API protocol:** HTTP REST? WebSocket? gRPC?
- **Streaming:** Does the response stream token-by-token or arrive all at once?
- **Authentication:** How does Speedy Gonzales authenticate with OpenClaw?
- **Hosting:** Where does OpenClaw run? VPS? Cloud? Local machine with tunnel?

For MVP, the chat UI is built and functional with a **placeholder backend** (could echo messages or use a simple Claude API call). The OpenClaw integration is swapped in once the protocol is defined.

## Frontend components

```
src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/
├── _components/
│   ├── ChatPanel.tsx           # Container: message list + input
│   ├── ChatMessage.tsx         # Single message bubble (user or agent)
│   ├── ChatInput.tsx           # Text input + send button
│   └── ChatActionBadge.tsx     # Shows actions taken ("Created ticket: X")
├── _hooks/
│   └── useFeatureChat.ts       # Messages query + send mutation + streaming state
```

## Depends on

- Feature 6 (Feature View) — chat lives in the right panel
- Feature 4 (GitHub Sync) — context data comes from synced plans

## Blocks

- Nothing — this is the final core feature
