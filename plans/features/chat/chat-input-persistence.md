# Chat Input Persistence

**Status:** todo
**Priority:** medium

## What it does

Persist the chat input draft so text is not lost when the user navigates away from the feature view and returns. Also support multiple image attachments in a single message.

## Part 1: Input Draft Persistence

When the user types in the chat input and navigates back to the project view, the draft should be saved and restored on return.

### Approach
- Save input value to `localStorage` keyed by `epicId` (e.g. `chat-draft-<epicId>`)
- Restore draft on component mount
- Clear draft on successful send

### Checklist
- [ ] Save draft to `localStorage` on every keystroke (debounced 300ms)
- [ ] Restore draft on `ChatInput` mount using `epicId` key
- [ ] Clear draft from `localStorage` after message is sent successfully
- [ ] Handle edge case: draft older than 24h should be discarded

## Part 2: Multiple Image Attachments

Allow users to paste or attach multiple images in one message (not just one).

### Approach
- Change `pendingImage` state to `pendingImages: string[]` in `useSendChat`
- Each Ctrl+V adds to the array (up to a max of 4 images)
- Show thumbnails as a row above the input
- Each thumbnail has an X to remove it individually
- On send: all images are prepended as markdown `![screenshot-N](url)` lines

### Checklist
- [ ] Change `pendingImage` → `pendingImages: string[]` in `useSendChat.ts`
- [ ] Allow multiple paste events to queue images (max 4)
- [ ] Show image thumbnails as a horizontal row above the input
- [ ] Each thumbnail has an individual X remove button
- [ ] On send: include all image URLs in message as separate markdown lines
- [ ] Clear `pendingImages` array after send

## Files
- `src/hooks/useSendChat.ts`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatInput.tsx`
