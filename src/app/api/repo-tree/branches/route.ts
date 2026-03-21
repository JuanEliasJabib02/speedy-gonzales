import { NextRequest, NextResponse } from "next/server"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"

export async function GET(req: NextRequest) {
  const token = await convexAuthNextjsToken()
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const owner = req.nextUrl.searchParams.get("owner")
  const repo = req.nextUrl.searchParams.get("repo")

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "owner and repo params are required" },
      { status: 400 },
    )
  }

  const githubPat = process.env.GITHUB_PAT
  if (!githubPat) {
    return NextResponse.json(
      { error: "GITHUB_PAT is not configured" },
      { status: 503 },
    )
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${githubPat}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        signal: AbortSignal.timeout(10000),
      },
    )

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      return NextResponse.json(
        { error: `GitHub API error: ${res.status}`, detail: text },
        { status: res.status },
      )
    }

    const data = await res.json()
    const branches = (data as Array<{ name: string }>).map((b) => ({
      name: b.name,
    }))

    return NextResponse.json(
      { branches },
      {
        headers: {
          "Cache-Control": "public, max-age=120, stale-while-revalidate=600",
        },
      },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
