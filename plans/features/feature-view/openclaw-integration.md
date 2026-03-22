# OpenClaw API Integration

**Status:** todo
**Priority:** medium

## What it does

Connect the chat to the OpenClaw agent (Charizard) via OpenAI-compatible API.

## Protocol

- **OpenAI-compatible API**: `POST /v1/chat/completions`
- **HTTP REST** with SSE streaming (`stream: true`)
- Same format as OpenAI API (messages, model, stream)

## SDK

- Vercel AI SDK: `@ai-sdk/openai` + `ai`
- `createOpenAI({ baseURL, apiKey })` → `streamText({ model, messages })`

## Agent

- Agent name: **Charizard** (main agent with memory + repo access)
- Model field: `openclaw:main`

## Checklist

- [x] Next.js API route at `/api/chat` proxies to OpenClaw
- [x] Send `user: "juan"` for session persistence
- [x] Handle non-streaming responses
- [ ] Set env vars and test end-to-end
- [ ] Implement SSE streaming with Vercel AI SDK
- [ ] Handle agent actions (created ticket, pushed code, modified plan)
- [ ] Parse commit data from agent responses

## Env vars

```
OPENCLAW_SERVER_URL=https://<openclaw-server>/v1
OPENCLAW_GATEWAY_TOKEN=<gateway-token>
```

