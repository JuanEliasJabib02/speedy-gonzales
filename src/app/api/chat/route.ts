import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get environment variables
    const openclawBaseUrl = process.env.OPENCLAW_BASE_URL
    const openclawApiKey = process.env.OPENCLAW_API_KEY

    if (!openclawBaseUrl || !openclawApiKey) {
      return NextResponse.json(
        { error: "OpenClaw configuration missing" },
        { status: 500 }
      )
    }

    // Forward request to OpenClaw gateway with streaming enabled
    const response = await fetch(`${openclawBaseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openclawApiKey}`,
      },
      body: JSON.stringify({
        ...body,
        stream: true, // Enable streaming
      }),
    })

    if (!response.ok) {
      if (!response.body) {
        return NextResponse.json(
          { error: "Gateway error: No response body" },
          { status: response.status }
        )
      }

      // Try to get error message from gateway
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Gateway error: ${errorText}` },
        { status: response.status }
      )
    }

    if (!response.body) {
      return NextResponse.json(
        { error: "Gateway returned no response body" },
        { status: 503 }
      )
    }

    // Create streaming response with proper headers
    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    // Check if it's a network error (gateway unreachable)
    if (error instanceof Error && error.message.includes("fetch")) {
      return NextResponse.json(
        { error: "OpenClaw gateway is unreachable. Please check your network connection." },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}