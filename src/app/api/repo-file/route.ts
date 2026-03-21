import { NextRequest, NextResponse } from "next/server"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"

export async function GET(req: NextRequest) {
  const token = await convexAuthNextjsToken()
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const owner = req.nextUrl.searchParams.get("owner")
  const repo = req.nextUrl.searchParams.get("repo")
  const path = req.nextUrl.searchParams.get("path")
  const ref = req.nextUrl.searchParams.get("ref")

  if (!owner || !repo || !path || !ref) {
    return NextResponse.json(
      { error: "owner, repo, path, and ref params are required" },
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
    const encodedPath = path
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/")

    const res = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodedPath}?ref=${ref.split("/").map(encodeURIComponent).join("/")}`,
      {
        headers: {
          Authorization: `Bearer ${githubPat}`,
          Accept: "application/vnd.github.v3+json",
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

    if (data.encoding !== "base64" || typeof data.content !== "string") {
      return NextResponse.json(
        { content: "", encoding: data.encoding ?? "none", size: data.size ?? 0 },
      )
    }

    const content = Buffer.from(data.content, "base64").toString("utf-8")

    return NextResponse.json(
      { content, encoding: "utf-8", size: data.size ?? content.length },
      {
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
        },
      },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
