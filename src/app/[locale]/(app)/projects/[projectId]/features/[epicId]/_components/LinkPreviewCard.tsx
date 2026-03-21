"use client"

import { useEffect, useState } from "react"
import { ExternalLink, GitCommitHorizontal, GitPullRequest, FileCode } from "lucide-react"
import { cn } from "@/src/lib/helpers/cn"
import type { LinkPreviewData } from "@/src/app/api/link-preview/route"

function GitHubLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  )
}

type LinkPreviewCardProps = {
  url: string
  className?: string
}

export function LinkPreviewCard({ url, className }: LinkPreviewCardProps) {
  const [data, setData] = useState<LinkPreviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setFailed(false)

    // Check session storage cache first
    const cacheKey = `link-preview:${url}`
    try {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        setData(JSON.parse(cached))
        setLoading(false)
        return
      }
    } catch {
      // ignore
    }

    fetch(`/api/link-preview?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((d: LinkPreviewData) => {
        if (cancelled) return
        setData(d)
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(d))
        } catch {
          // storage full — ignore
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [url])

  if (loading) {
    return (
      <div className={cn("flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground animate-pulse", className)}>
        <div className="size-3.5 rounded-full bg-muted" />
        <div className="h-3 w-48 rounded bg-muted" />
      </div>
    )
  }

  if (failed || !data) return null

  const isGitHub = data.url.includes("github.com")

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-start gap-3 rounded-lg border p-3 text-sm transition-colors",
        isGitHub
          ? "border-[#30363d] bg-[#161b22] text-white hover:bg-[#1c2128]"
          : "border-border bg-card text-foreground hover:bg-accent",
        className
      )}
    >
      {/* Icon */}
      <div className="mt-0.5 shrink-0">
        {isGitHub ? (
          <GitHubLogo className={cn("size-4", isGitHub ? "text-white" : "text-foreground")} />
        ) : (
          <img
            src={data.favicon}
            alt=""
            className="size-4 rounded"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = "none"
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {/* Sub-type icon */}
          {data.type === "github-commit" && (
            <GitCommitHorizontal className="size-3.5 shrink-0 text-[#8b949e]" />
          )}
          {data.type === "github-pr" && (
            <GitPullRequest className="size-3.5 shrink-0 text-[#8b949e]" />
          )}
          {data.type === "github-blob" && (
            <FileCode className="size-3.5 shrink-0 text-[#8b949e]" />
          )}

          <span className={cn("truncate font-medium text-sm", isGitHub ? "text-[#c9d1d9]" : "text-foreground")}>
            {data.title || new URL(data.url).pathname}
          </span>
          <ExternalLink className={cn("ml-auto shrink-0 size-3 opacity-0 group-hover:opacity-100 transition-opacity", isGitHub ? "text-[#8b949e]" : "text-muted-foreground")} />
        </div>

        {data.description && (
          <p className={cn("mt-1 line-clamp-2 text-xs", isGitHub ? "text-[#8b949e]" : "text-muted-foreground")}>
            {data.description}
          </p>
        )}

        {/* Commit SHA badge */}
        {data.type === "github-commit" && data.github?.commitSha && (
          <code className="mt-1.5 inline-block rounded bg-[#21262d] px-1.5 py-0.5 text-[10px] text-[#8b949e]">
            {data.github.commitSha.slice(0, 7)}
          </code>
        )}

        {/* PR number badge */}
        {data.type === "github-pr" && data.github?.prNumber && (
          <span className="mt-1.5 inline-block rounded bg-[#21262d] px-1.5 py-0.5 text-[10px] text-[#8b949e]">
            #{data.github.prNumber}
          </span>
        )}

        {/* Repo label */}
        {data.github?.owner && data.github?.repo && (
          <p className={cn("mt-1 text-[10px]", isGitHub ? "text-[#8b949e]" : "text-muted-foreground")}>
            {data.github.owner}/{data.github.repo}
          </p>
        )}
      </div>

      {/* OG Image for non-commit types */}
      {data.image && data.type !== "github-commit" && (
        <img
          src={data.image}
          alt=""
          className="hidden sm:block h-12 w-20 shrink-0 rounded object-cover"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.display = "none"
          }}
        />
      )}
    </a>
  )
}

/** Extract GitHub URLs from text content */
export function extractGitHubUrls(text: string): string[] {
  const urlPattern = /https?:\/\/github\.com\/[\w.-]+\/[\w.-]+(?:\/[^\s)>\]"']*)?/g
  const matches = text.match(urlPattern) ?? []
  // Deduplicate
  return [...new Set(matches)]
}
