import { NextRequest, NextResponse } from "next/server"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"

type TreeNode = {
  path: string
  type: "blob" | "tree"
  sha: string
}

export async function GET(req: NextRequest) {
  const token = await convexAuthNextjsToken()
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const owner = req.nextUrl.searchParams.get("owner")
  const repo = req.nextUrl.searchParams.get("repo")
  const branch = req.nextUrl.searchParams.get("branch")

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
    const res = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/${branch.split("/").map(encodeURIComponent).join("/")}?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${githubPat}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        signal: AbortSignal.timeout(15000),
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
    const tree: TreeNode[] = (
      data.tree as Array<{ path: string; sha: string; type: string }>
    ).map((node) => ({
      path: node.path,
      type: node.type === "tree" ? "tree" : "blob",
      sha: node.sha,
    }))

    return NextResponse.json(
      { tree, truncated: data.truncated ?? false },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
