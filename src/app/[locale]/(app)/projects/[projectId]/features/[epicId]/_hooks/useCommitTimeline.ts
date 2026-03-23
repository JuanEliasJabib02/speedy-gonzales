"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { BranchCommit } from "@/src/app/api/branch-commits/route"

type UseCommitTimelineParams = {
  owner: string | undefined
  repo: string | undefined
  branch: string
  fallbackBranch?: string
}

export function useCommitTimeline({ owner, repo, branch, fallbackBranch = "main" }: UseCommitTimelineParams) {
  const [commits, setCommits] = useState<BranchCommit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [activeBranch, setActiveBranch] = useState(branch)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchCommits = useCallback(async (pageNum: number, append: boolean) => {
    if (!owner || !repo) return

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        owner,
        repo,
        branch,
        fallback_branch: fallbackBranch,
        per_page: "30",
        page: String(pageNum),
      })

      const res = await fetch(`/api/branch-commits?${params}`, { signal: controller.signal })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Failed to fetch commits (${res.status})`)
      }

      const data: { commits: BranchCommit[]; branch: string } = await res.json()

      setActiveBranch(data.branch)

      if (data.commits.length < 30) {
        setHasMore(false)
      }

      setCommits((prev) => append ? [...prev, ...data.commits] : data.commits)
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [owner, repo, branch, fallbackBranch])

  useEffect(() => {
    setCommits([])
    setPage(1)
    setHasMore(true)
    setActiveBranch(branch)
    fetchCommits(1, false)

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [fetchCommits, branch])

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    const nextPage = page + 1
    setPage(nextPage)
    fetchCommits(nextPage, true)
  }, [loading, hasMore, page, fetchCommits])

  const refresh = useCallback(() => {
    setCommits([])
    setPage(1)
    setHasMore(true)
    fetchCommits(1, false)
  }, [fetchCommits])

  return { commits, loading, error, hasMore, loadMore, refresh, activeBranch }
}
