# Paste Image Upload (Ctrl+V Screenshots)

**Status:** todo
**Priority:** high

## What it does

Allow users to paste screenshots directly into the chat input (Ctrl+V). The image gets uploaded to Convex File Storage and sent as part of the message — so the agent can see screenshots, errors, UI states, etc.

## Approach

Listen for `paste` event on the chat input. If the clipboard contains an image (`image/*`), upload it to Convex File Storage and include the storage URL in the message payload.

## Checklist

- [ ] Listen for `paste` event in `ChatInput.tsx`
- [ ] Detect image in `event.clipboardData.items` (`image/png`, `image/jpeg`)
- [ ] Upload to Convex File Storage via `useUploadFile` mutation
- [ ] Show image preview thumbnail above the input while composing
- [ ] Include image URL in the message sent to the agent (as markdown `![screenshot](url)` or metadata)
- [ ] Show loading state while uploading
- [ ] Handle upload errors gracefully

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatInput.tsx`
- `src/hooks/useSendChat.ts`
- `convex/files.ts` (new — file upload mutations)
- `convex/schema.ts` (add optional `imageUrl` to chatMessages if needed)

