import { NextRequest, NextResponse } from "next/server"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"

type GitHubCommit = {
  sha: string
  commit: {
    message: string
    author: { name: string; date: string } | null
    committer: { name: string; date: string } | null
  }
  author: { login: string; avatar_url: string } | null
  stats?: { total: number; additions: number; deletions: number }
  files?: { filename: string }[]
}

export type BranchCommit = {
  sha: string
  message: string
  author: string
  authorAvatar: string | null
  timestamp: string
  filesChanged: number
  additions: number
  deletions: number
}

export async function GET(req: NextRequest) {
  const token = await convexAuthNextjsToken()
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const owner = req.nextUrl.searchParams.get("owner")
  const repo = req.nextUrl.searchParams.get("repo")
  const branch = req.nextUrl.searchParams.get("branch")
  const perPage = req.nextUrl.searchParams.get("per_page") ?? "30"
  const page = req.nextUrl.searchParams.get("page") ?? "1"

  if (!owner || !repo || !branch) {
    return NextResponse.json(
      { error: "owner, repo, and branch params are required" },
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
    const url = new URL(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits`)
    url.searchParams.set("sha", branch)
    url.searchParams.set("per_page", perPage)
    url.searchParams.set("page", page)

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${githubPat}`,
        Accept: "application/vnd.github.v3+json",
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      return NextResponse.json(
        { error: `GitHub API error: ${res.status}`, detail: text },
        { status: res.status },
      )
    }

    const data: GitHubCommit[] = await res.json()

    const commits: BranchCommit[] = data.map((c) => ({
      sha: c.sha,
      message: c.commit.message.split("\n")[0],
      author: c.author?.login ?? c.commit.author?.name ?? "unknown",
      authorAvatar: c.author?.avatar_url ?? null,
      timestamp: c.commit.committer?.date ?? c.commit.author?.date ?? "",
      filesChanged: c.files?.length ?? 0,
      additions: c.stats?.additions ?? 0,
      deletions: c.stats?.deletions ?? 0,
    }))

    return NextResponse.json({ commits }, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
