# Shared Types Cleanup (DUP-01 to DUP-06, TS-01 to TS-06)

**Status:** todo
**Priority:** medium

## What it does

Eliminate duplicated types and fix TypeScript inconsistencies across the chat feature.

## Duplications to fix

- `ChatContext` defined in both `route.ts` and `useSendChat.ts` → move to `src/types/chat.ts`
- `PendingImage` defined in both `useSendChat.ts` and `ChatInput.tsx` → move to shared types
- `HistoryMessage` defined in both `route.ts` and `useSendChat.ts` → move to shared types
- `GitHubLogo` SVG duplicated in `ChatMessage.tsx` and `LinkPreviewCard.tsx` → extract to `src/lib/components/common/GitHubLogo.tsx`

## TypeScript fixes

- `role: v.string()` in Convex schema → change to `v.union(v.literal("user"), v.literal("assistant"))`
- Add `toUIRole()` helper: `(role: "user"|"assistant") => "user"|"agent"`
- Remove unsafe casts like `message.role as "user" | "agent"`

## Checklist

- [ ] Create `src/types/chat.ts` with ChatContext, HistoryMessage, PendingImage
- [ ] Update imports in route.ts, useSendChat.ts, ChatInput.tsx
- [ ] Extract GitHubLogo to shared component
- [ ] Update Convex schema role field to union type
- [ ] Add toUIRole() helper
- [ ] Remove unsafe role casts in ChatPanel.tsx

## Files

- `src/types/chat.ts` (new)
- `src/lib/components/common/GitHubLogo.tsx` (new)
- `convex/schema/chatMessages.ts`
- `src/app/api/chat/route.ts`
- `src/app/.../useSendChat.ts`
- `src/app/.../ChatInput.tsx`
- `src/app/.../ChatPanel.tsx`
