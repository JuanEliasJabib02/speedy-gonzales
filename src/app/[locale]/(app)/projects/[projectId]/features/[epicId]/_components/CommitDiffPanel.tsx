"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/lib/components/ui/dialog"
import { cn } from "@/src/lib/helpers/cn"
import { FileCode2, Plus, Minus, ChevronDown, ChevronRight, CheckCircle2, Wrench, Loader2 } from "lucide-react"

type DiffFile = {
  filename: string
  status: string
  additions: number
  deletions: number
  patch: string
}

type DiffStats = {
  total: number
  additions: number
  deletions: number
}

type CommitDiffData = {
  message: string
  files: DiffFile[]
  stats: DiffStats
}

type CommitDiffPanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  owner: string
  repo: string
  sha: string
  ticketId?: string
  onApprove?: (completionType: "clean" | "with-fixes") => void | Promise<void>
}

const MAX_LINES_PER_FILE = 500
const CACHE_PREFIX = "commit-diff:"
const MAX_CACHE_ENTRIES = 20

function safeSetCache(key: string, value: string) {
  try {
    evictOldestCacheEntries()
    sessionStorage.setItem(key, value)
  } catch {
    try {
      clearAllCacheEntries()
      sessionStorage.setItem(key, value)
    } catch {
      // Storage completely full or unavailable — skip caching
    }
  }
}

function evictOldestCacheEntries() {
  const keys: string[] = []
  for (let i = 0; i < sessionStorage.length; i++) {
    const k = sessionStorage.key(i)
    if (k?.startsWith(CACHE_PREFIX)) keys.push(k)
  }
  if (keys.length >= MAX_CACHE_ENTRIES) {
    const toRemove = keys.slice(0, keys.length - MAX_CACHE_ENTRIES + 1)
    toRemove.forEach((k) => sessionStorage.removeItem(k))
  }
}

function clearAllCacheEntries() {
  const keys: string[] = []
  for (let i = 0; i < sessionStorage.length; i++) {
    const k = sessionStorage.key(i)
    if (k?.startsWith(CACHE_PREFIX)) keys.push(k)
  }
  keys.forEach((k) => sessionStorage.removeItem(k))
}

function DiffLine({ line }: { line: string }) {
  const isAdded = line.startsWith("+") && !line.startsWith("+++")
  const isRemoved = line.startsWith("-") && !line.startsWith("---")
  const isHunkHeader = line.startsWith("@@")

  return (
    <div
      className={cn(
        "px-3 font-mono text-xs leading-5 whitespace-pre-wrap break-all",
        isAdded && "bg-emerald-500/15 text-emerald-400",
        isRemoved && "bg-red-500/15 text-red-400",
        isHunkHeader && "bg-blue-500/10 text-blue-400 mt-1",
        !isAdded && !isRemoved && !isHunkHeader && "text-muted-foreground",
      )}
    >
      {line}
    </div>
  )
}

function FileDiff({ file }: { file: DiffFile }) {
  const [collapsed, setCollapsed] = useState(false)

  const lines = file.patch ? file.patch.split("\n") : []
  const isTruncated = lines.length > MAX_LINES_PER_FILE
  const visibleLines = isTruncated ? lines.slice(0, MAX_LINES_PER_FILE) : lines

  const statusLabel =
    file.status === "added"
      ? "A"
      : file.status === "removed"
        ? "D"
        : file.status === "renamed"
          ? "R"
          : "M"

  const statusColor =
    file.status === "added"
      ? "text-emerald-400"
      : file.status === "removed"
        ? "text-red-400"
        : file.status === "renamed"
          ? "text-blue-400"
          : "text-yellow-400"

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center gap-2 px-3 py-2 text-xs bg-muted/50 hover:bg-muted transition-colors text-left"
      >
        {collapsed ? (
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        )}
        <span className={cn("font-mono font-bold", statusColor)}>
          {statusLabel}
        </span>
        <span className="font-mono truncate">{file.filename}</span>
        <span className="ml-auto flex items-center gap-2 shrink-0 text-muted-foreground">
          {file.additions > 0 && (
            <span className="flex items-center gap-0.5 text-emerald-400">
              <Plus className="size-3" />
              {file.additions}
            </span>
          )}
          {file.deletions > 0 && (
            <span className="flex items-center gap-0.5 text-red-400">
              <Minus className="size-3" />
              {file.deletions}
            </span>
          )}
        </span>
      </button>

      {!collapsed && (
        <div className="overflow-x-auto bg-[#0d1117]">
          {lines.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground italic">
              Binary file or no diff available
            </div>
          ) : (
            <>
              {visibleLines.map((line, i) => (
                <DiffLine key={i} line={line} />
              ))}
              {isTruncated && (
                <div className="px-3 py-2 text-xs text-muted-foreground italic border-t border-border">
                  Diff truncated — {lines.length - MAX_LINES_PER_FILE} more
                  lines
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="h-4 w-48 rounded bg-muted" />
      <div className="h-3 w-32 rounded bg-muted" />
      <div className="mt-4 flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-muted" />
        ))}
      </div>
    </div>
  )
}

export function CommitDiffPanel({
  open,
  onOpenChange,
  owner,
  repo,
  sha,
  ticketId,
  onApprove,
}: CommitDiffPanelProps) {
  const [data, setData] = useState<CommitDiffData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [marking, setMarking] = useState(false)

  const fetchDiff = useCallback(async () => {
    setLoading(true)
    setError(null)
    setData(null)

    const cacheKey = `${CACHE_PREFIX}${owner}/${repo}/${sha}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      try {
        setData(JSON.parse(cached))
        setLoading(false)
        return
      } catch {
        sessionStorage.removeItem(cacheKey)
      }
    }

    try {
      const res = await fetch(
        `/api/commit-diff?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&sha=${encodeURIComponent(sha)}`,
      )
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Failed to fetch diff (${res.status})`)
      }
      const result: CommitDiffData = await res.json()
      setData(result)
      safeSetCache(cacheKey, JSON.stringify(result))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [owner, repo, sha])

  useEffect(() => {
    if (open && sha) {
      fetchDiff()
    }
  }, [open, sha, fetchDiff])

  const shortSha = sha.slice(0, 7)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="fixed right-0 top-0 left-auto h-full max-h-screen w-full max-w-2xl translate-x-0 translate-y-0 rounded-none border-l sm:rounded-none data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCode2 className="size-4" />
            <code className="text-sm font-mono">{shortSha}</code>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-1">
              {data && (
                <>
                  <span className="text-sm">{data.message.split("\n")[0]}</span>
                  <span className="text-xs text-muted-foreground">
                    {data.files.length} file{data.files.length !== 1 ? "s" : ""} changed
                    {data.stats.additions > 0 && (
                      <span className="text-emerald-400"> +{data.stats.additions}</span>
                    )}
                    {data.stats.deletions > 0 && (
                      <span className="text-red-400"> -{data.stats.deletions}</span>
                    )}
                  </span>
                </>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-3 pb-6">
          {loading && <LoadingSkeleton />}

          {error && (
            <div className="rounded-md border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {data && data.files.map((file) => (
            <FileDiff key={file.filename} file={file} />
          ))}

          {data && data.files.length === 0 && (
            <div className="text-sm text-muted-foreground italic">
              No file changes in this commit.
            </div>
          )}

          {ticketId && onApprove && (
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
              <button
                onClick={async () => {
                  setMarking(true)
                  try {
                    await onApprove("clean")
                  } finally {
                    setMarking(false)
                  }
                }}
                disabled={marking}
                className="flex items-center gap-2 rounded-md bg-status-completed hover:bg-status-completed/80 text-white px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {marking ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                Approve
              </button>
              <button
                onClick={async () => {
                  setMarking(true)
                  try {
                    await onApprove("with-fixes")
                  } finally {
                    setMarking(false)
                  }
                }}
                disabled={marking}
                className="flex items-center gap-2 rounded-md border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {marking ? <Loader2 className="size-4 animate-spin" /> : <Wrench className="size-4" />}
                Approve with fixes
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
