import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { proxyAuthActionToConvex, shouldProxyAuthAction } = await import(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "@convex-dev/auth/nextjs/server" as any
  )
  if (shouldProxyAuthAction?.(request)) {
    return proxyAuthActionToConvex(request, {
      convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL,
    })
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 })
}

export async function POST(request: NextRequest) {
  const { proxyAuthActionToConvex } = await import(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "@convex-dev/auth/nextjs/server" as any
  )
  return proxyAuthActionToConvex(request, {
    convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL,
  })
}
