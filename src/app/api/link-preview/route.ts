import { NextRequest, NextResponse } from "next/server"

export type LinkPreviewData = {
  url: string
  title?: string
  description?: string
  image?: string
  favicon?: string
  type: "generic" | "github-commit" | "github-pr" | "github-blob" | "github-other"
  github?: {
    owner?: string
    repo?: string
    commitSha?: string
    prNumber?: number
    filePath?: string
  }
}

function parseGitHubUrl(url: string): LinkPreviewData["github"] & { type: LinkPreviewData["type"] } {
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== "github.com") return { type: "generic" }

    const parts = parsed.pathname.split("/").filter(Boolean)
    if (parts.length < 2) return { type: "github-other" }

    const [owner, repo, ...rest] = parts

    if (rest[0] === "commit" && rest[1]) {
      return { type: "github-commit", owner, repo, commitSha: rest[1] }
    }
    if (rest[0] === "pull" && rest[1]) {
      return { type: "github-pr", owner, repo, prNumber: parseInt(rest[1], 10) }
    }
    if (rest[0] === "blob" && rest.length > 2) {
      return { type: "github-blob", owner, repo, filePath: rest.slice(2).join("/") }
    }

    return { type: "github-other", owner, repo }
  } catch {
    return { type: "generic" }
  }
}

async function fetchOgMetadata(url: string): Promise<Partial<LinkPreviewData>> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SpeedyGonzales/1.0; +https://github.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) return {}
    const html = await res.text()

    const getMetaContent = (name: string): string | undefined => {
      const match =
        html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i")) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${name}["']`, "i"))
      return match?.[1]
    }

    const getTitleFromHtml = (): string | undefined => {
      const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      return match?.[1]?.trim()
    }

    return {
      title: getMetaContent("og:title") || getTitleFromHtml(),
      description: getMetaContent("og:description") || getMetaContent("description"),
      image: getMetaContent("og:image"),
    }
  } catch {
    return {}
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url) {
    return NextResponse.json({ error: "url param required" }, { status: 400 })
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  const isGitHub = parsedUrl.hostname === "github.com"
  const { type, ...githubData } = isGitHub ? parseGitHubUrl(url) : { type: "generic" as const }

  const ogMeta = await fetchOgMetadata(url)

  const result: LinkPreviewData = {
    url,
    type: type as LinkPreviewData["type"],
    ...ogMeta,
    favicon: isGitHub ? "https://github.com/favicon.ico" : `${parsedUrl.origin}/favicon.ico`,
    github: Object.keys(githubData).length > 0 ? githubData as LinkPreviewData["github"] : undefined,
  }

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  })
}
