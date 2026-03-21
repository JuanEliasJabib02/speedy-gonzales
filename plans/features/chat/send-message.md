# sendMessage Action

**Status:** todo

## What it does

Convex action that sends a user message to the OpenClaw agent and stores the response. Includes full project context with each request.

## Checklist

- [ ] Create `sendMessage` action in `convex/chat.ts`
- [ ] Store user message in chat_messages table
- [ ] Build context: project, repo, feature, current plan, chat history
- [ ] Call OpenClaw API with message + context
- [ ] Store agent response in chat_messages table
- [ ] Handle streaming (if supported) or wait for full response
- [ ] Return the agent's response

## Context sent with each message

- message (user's text)
- projectId, epicId
- repoUrl, branch, plansPath
- currentPlanContent (currently viewed plan)
- chatHistory (previous messages)
