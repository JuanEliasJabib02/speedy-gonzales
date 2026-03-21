# Context Bridge (Viewed File → Chat)

**Status:** todo
**Priority:** medium

## What it does

When the user is viewing a file in Code mode and switches to Chat (or sends a message while in Code mode), automatically inject the currently viewed file path and content into the chat system message. The agent knows what you're looking at without you having to paste it.

## Checklist

- [ ] Track `activeFile` state in the FeatureView (path + content)
- [ ] Pass `activeFile` to `useSendChat` hook
- [ ] Append to system message: "The user is currently viewing: `<path>`\n\n```\n<content>\n```"
- [ ] Show a pill/badge in the ChatInput when a file is in context ("📄 viewing src/app/page.tsx")
- [ ] Allow dismissing the file context (click X on the pill)

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/page.tsx`
- `src/hooks/useSendChat.ts`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatInput.tsx`
