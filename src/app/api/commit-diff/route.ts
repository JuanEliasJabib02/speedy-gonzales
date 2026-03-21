import { NextRequest, NextResponse } from "next/server"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"

type GitHubFileData = {
  filename: string
  status: string
  additions: number
  deletions: number
  patch?: string
}

type CommitDiffResponse = {
  message: string
  files: {
    filename: string
    status: string
    additions: number
    deletions: number
    patch: string
  }[]
  stats: {
    total: number
    additions: number
    deletions: number
  }
}

export async function GET(req: NextRequest) {
  const token = await convexAuthNextjsToken()
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const owner = req.nextUrl.searchParams.get("owner")
  const repo = req.nextUrl.searchParams.get("repo")
  const sha = req.nextUrl.searchParams.get("sha")

  if (!owner || !repo || !sha) {
    return NextResponse.json(
      { error: "owner, repo, and sha params are required" },
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
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits/${encodeURIComponent(sha)}`,
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

    const result: CommitDiffResponse = {
      message: data.commit?.message ?? "",
      files: (data.files ?? []).map((f: GitHubFileData) => ({
        filename: f.filename,
        status: f.status,
        additions: f.additions,
        deletions: f.deletions,
        patch: f.patch ?? "",
      })),
      stats: {
        total: data.stats?.total ?? 0,
        additions: data.stats?.additions ?? 0,
        deletions: data.stats?.deletions ?? 0,
      },
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, max-age=600, stale-while-revalidate=1200",
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
