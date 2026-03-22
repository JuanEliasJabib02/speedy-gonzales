"use client"

import { useState, useEffect, useCallback } from "react"
import type { BranchCommit } from "@/src/app/api/branch-commits/route"

type UseCommitTimelineParams = {
  owner: string | undefined
  repo: string | undefined
  branch: string
}

export function useCommitTimeline({ owner, repo, branch }: UseCommitTimelineParams) {
  const [commits, setCommits] = useState<BranchCommit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchCommits = useCallback(async (pageNum: number, append: boolean) => {
    if (!owner || !repo) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        owner,
        repo,
        branch,
        per_page: "30",
        page: String(pageNum),
      })

      const res = await fetch(`/api/branch-commits?${params}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Failed to fetch commits (${res.status})`)
      }

      const data: { commits: BranchCommit[] } = await res.json()

      if (data.commits.length < 30) {
        setHasMore(false)
      }

      setCommits((prev) => append ? [...prev, ...data.commits] : data.commits)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [owner, repo, branch])

  useEffect(() => {
    setCommits([])
    setPage(1)
    setHasMore(true)
    fetchCommits(1, false)
  }, [fetchCommits])

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

  return { commits, loading, error, hasMore, loadMore, refresh }
}
