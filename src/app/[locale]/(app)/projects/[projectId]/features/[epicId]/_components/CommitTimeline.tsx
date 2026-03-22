"use client"

import { useState } from "react"
import { GitCommitHorizontal, RefreshCw, ChevronDown, Plus, Minus, Code2, Loader2, GitBranch } from "lucide-react"
import { cn } from "@/src/lib/helpers/cn"
import { CommitDiffPanel } from "./CommitDiffPanel"
import type { BranchCommit } from "@/src/app/api/branch-commits/route"

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function CommitCard({
  commit,
  onViewDiff,
}: {
  commit: BranchCommit
  onViewDiff: (sha: string) => void
}) {
  return (
    <div className="relative pl-6">
      {/* Timeline dot */}
      <div className="absolute left-0 top-2.5 flex size-4 items-center justify-center rounded-full border-2 border-border bg-card">
        <div className="size-1.5 rounded-full bg-status-completed" />
      </div>

      <div className="rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">{commit.message}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                {commit.sha.slice(0, 7)}
              </code>
              <span>{commit.author}</span>
              {commit.timestamp && <span>{timeAgo(commit.timestamp)}</span>}
            </div>
          </div>
        </div>

        {(commit.additions > 0 || commit.deletions > 0) && (
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{commit.filesChanged} file{commit.filesChanged !== 1 ? "s" : ""}</span>
            {commit.additions > 0 && (
              <span className="flex items-center gap-0.5 text-emerald-400">
                <Plus className="size-3" />
                {commit.additions}
              </span>
            )}
            {commit.deletions > 0 && (
              <span className="flex items-center gap-0.5 text-red-400">
                <Minus className="size-3" />
                {commit.deletions}
              </span>
            )}
          </div>
        )}

        <button
          onClick={() => onViewDiff(commit.sha)}
          className="mt-2 flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
        >
          <Code2 className="size-3" />
          View diff
        </button>
      </div>
    </div>
  )
}

type CommitTimelineProps = {
  commits: BranchCommit[]
  loading: boolean
  error: string | null
  hasMore: boolean
  branch: string
  repoOwner: string
  repoName: string
  onLoadMore: () => void
  onRefresh: () => void
  ticketFilter: string | null
  onTicketFilterChange: (ticketSlug: string | null) => void
  tickets: { id: string; title: string }[]
}

export function CommitTimeline({
  commits,
  loading,
  error,
  hasMore,
  branch,
  repoOwner,
  repoName,
  onLoadMore,
  onRefresh,
  ticketFilter,
  onTicketFilterChange,
  tickets,
}: CommitTimelineProps) {
  const [diffTarget, setDiffTarget] = useState<string | null>(null)

  const filteredCommits = ticketFilter
    ? commits.filter((c) => {
        const msg = c.message.toLowerCase()
        const slug = ticketFilter.toLowerCase()
        return msg.includes(slug)
      })
    : commits

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        <div className="flex items-center gap-2">
          <GitCommitHorizontal className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Commits</span>
          <span className="text-xs text-muted-foreground">({filteredCommits.length})</span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
        </button>
      </div>

      {/* Branch label */}
      <div className="flex items-center gap-1.5 border-b border-border px-3 py-1.5">
        <GitBranch className="size-3 text-muted-foreground" />
        <span className="text-xs font-mono text-muted-foreground truncate">{branch}</span>
      </div>

      {/* Filter by ticket */}
      {tickets.length > 0 && (
        <div className="border-b border-border px-3 py-2">
          <select
            value={ticketFilter ?? "all"}
            onChange={(e) => onTicketFilterChange(e.target.value === "all" ? null : e.target.value)}
            className="w-full rounded border border-border bg-card text-xs px-2 py-1 text-foreground"
          >
            <option value="all">All commits</option>
            {tickets.map((t) => (
              <option key={t.id} value={t.title}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Commit list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3">
        {error && (
          <div className="rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400 mb-3">
            {error}
          </div>
        )}

        {!loading && filteredCommits.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <GitCommitHorizontal className="size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No commits yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Commits will appear here when code is pushed
            </p>
          </div>
        )}

        {/* Timeline line */}
        <div className="relative">
          {filteredCommits.length > 0 && (
            <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />
          )}
          <div className="flex flex-col gap-3">
            {filteredCommits.map((commit) => (
              <CommitCard
                key={commit.sha}
                commit={commit}
                onViewDiff={setDiffTarget}
              />
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {hasMore && !loading && filteredCommits.length > 0 && (
          <button
            onClick={onLoadMore}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ChevronDown className="size-3.5" />
            Load more
          </button>
        )}
      </div>

      {/* Diff panel */}
      {diffTarget && (
        <CommitDiffPanel
          open={true}
          onOpenChange={(open) => { if (!open) setDiffTarget(null) }}
          owner={repoOwner}
          repo={repoName}
          sha={diffTarget}
        />
      )}
    </div>
  )
}
