"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/src/lib/components/ui/input"
import { cn } from "@/src/lib/helpers/cn"

type CommandPaletteProps = {
  files: { path: string; sha: string }[]
  onFileSelect: (path: string, sha: string) => void
  onClose: () => void
}

const MAX_RESULTS = 8

function highlightMatch(text: string, query: string) {
  if (!query) return <>{text}</>

  const lower = text.toLowerCase()
  const qLower = query.toLowerCase()
  const idx = lower.indexOf(qLower)

  if (idx === -1) return <>{text}</>

  return (
    <>
      {text.slice(0, idx)}
      <span className="bg-yellow-500/30 text-yellow-200">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}

export function CommandPalette({ files, onFileSelect, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = query
    ? files.filter((f) => f.path.toLowerCase().includes(query.toLowerCase())).slice(0, MAX_RESULTS)
    : files.slice(0, MAX_RESULTS)

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const selectFile = useCallback(
    (file: { path: string; sha: string }) => {
      onFileSelect(file.path, file.sha)
      onClose()
    },
    [onFileSelect, onClose],
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((i) => (i + 1 < filtered.length ? i + 1 : 0))
        return
      }

      if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((i) => (i - 1 >= 0 ? i - 1 : filtered.length - 1))
        return
      }

      if (e.key === "Enter") {
        e.preventDefault()
        if (filtered[activeIndex]) {
          selectFile(filtered[activeIndex])
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filtered, activeIndex, onClose, selectFile])

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const active = list.children[activeIndex] as HTMLElement | undefined
    active?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[20vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg rounded-lg border border-border bg-card shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files by name…"
            className="border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto scrollbar-thin p-1">
          {filtered.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">No files found</div>
          )}
          {filtered.map((file, i) => {
            const fileName = file.path.split("/").pop() ?? file.path
            const dirPath = file.path.split("/").slice(0, -1).join("/")

            return (
              <button
                key={file.path}
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors",
                  i === activeIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                )}
                onClick={() => selectFile(file)}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium font-mono text-xs">
                    {highlightMatch(fileName, query)}
                  </div>
                  {dirPath && (
                    <div className="truncate text-xs text-muted-foreground font-mono">
                      {highlightMatch(dirPath, query)}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-3 py-1.5 text-xs text-muted-foreground">
          <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">↑↓</kbd> navigate{" "}
          <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">↵</kbd> open{" "}
          <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">esc</kbd> close
        </div>
      </div>
    </div>
  )
}
