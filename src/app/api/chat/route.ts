import { NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: Request) {
  const { epicId, message } = await request.json()

  const serverUrl = process.env.OPENCLAW_SERVER_URL
  const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN

  if (!serverUrl || !gatewayToken) {
    // Save a fallback assistant message
    await convex.mutation(api.chat.saveAssistantMessage, {
      epicId,
      content: "Chat is not configured yet. Set OPENCLAW_SERVER_URL and OPENCLAW_GATEWAY_TOKEN env vars.",
    })
    return NextResponse.json({ ok: true })
  }

  try {
    const res = await fetch(`${serverUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${gatewayToken}`,
      },
      body: JSON.stringify({
        model: "openclaw:main",
        messages: [{ role: "user", content: message }],
        user: "juan",
        stream: false,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      await convex.mutation(api.chat.saveAssistantMessage, {
        epicId,
        content: `Error from agent: ${res.status} — ${error}`,
      })
      return NextResponse.json({ ok: false, error }, { status: 502 })
    }

    const data = await res.json()
    const assistantContent = data.choices?.[0]?.message?.content ?? "No response from agent."

    await convex.mutation(api.chat.saveAssistantMessage, {
      epicId,
      content: assistantContent,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    await convex.mutation(api.chat.saveAssistantMessage, {
      epicId,
      content: `Failed to reach agent: ${message}`,
    })
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
