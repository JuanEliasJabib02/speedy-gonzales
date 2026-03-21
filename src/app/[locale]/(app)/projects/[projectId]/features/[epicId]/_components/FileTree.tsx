"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronRight, GitBranch, Loader2 } from "lucide-react"
import { cn } from "@/src/lib/helpers/cn"

type TreeEntry = {
  path: string
  type: "blob" | "tree"
  sha: string
}

type Branch = {
  name: string
}

type TreeNode = {
  name: string
  path: string
  type: "blob" | "tree"
  sha: string
  children: TreeNode[]
}

type FileTreeProps = {
  owner: string
  repo: string
  branch: string
  onFileSelect: (path: string, sha: string) => void
  selectedFile?: string
}

const EXT_ICONS: Record<string, string> = {
  tsx: "\u269B\uFE0F",
  jsx: "\u269B\uFE0F",
  ts: "\uD83D\uDD37",
  js: "\uD83D\uDD36",
  md: "\uD83D\uDCDD",
  mdx: "\uD83D\uDCDD",
  json: "\uD83D\uDCCB",
  css: "\uD83C\uDFA8",
  scss: "\uD83C\uDFA8",
  html: "\uD83C\uDF10",
  svg: "\uD83D\uDDBC\uFE0F",
  png: "\uD83D\uDDBC\uFE0F",
  jpg: "\uD83D\uDDBC\uFE0F",
  yaml: "\u2699\uFE0F",
  yml: "\u2699\uFE0F",
  toml: "\u2699\uFE0F",
  env: "\uD83D\uDD12",
  lock: "\uD83D\uDD12",
  gitignore: "\uD83D\uDEAB",
}

function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  return EXT_ICONS[ext] ?? "\uD83D\uDCC4"
}

function buildTree(entries: TreeEntry[]): TreeNode[] {
  const root: TreeNode[] = []
  const dirs = new Map<string, TreeNode>()

  const sorted = [...entries].sort((a, b) => {
    if (a.type !== b.type) return a.type === "tree" ? -1 : 1
    return a.path.localeCompare(b.path)
  })

  for (const entry of sorted) {
    const parts = entry.path.split("/")
    const name = parts[parts.length - 1]
    const node: TreeNode = {
      name,
      path: entry.path,
      type: entry.type,
      sha: entry.sha,
      children: [],
    }

    if (parts.length === 1) {
      root.push(node)
    } else {
      const parentPath = parts.slice(0, -1).join("/")
      const parent = dirs.get(parentPath)
      if (parent) {
        parent.children.push(node)
      }
    }

    if (entry.type === "tree") {
      dirs.set(entry.path, node)
    }
  }

  return sortNodes(root)
}

function sortNodes(nodes: TreeNode[]): TreeNode[] {
  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "tree" ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

function TreeNodeRow({
  node,
  depth,
  expanded,
  onToggle,
  onFileSelect,
  selectedFile,
  expandedPaths,
}: {
  node: TreeNode
  depth: number
  expanded: boolean
  onToggle: (path: string) => void
  onFileSelect: (path: string, sha: string) => void
  selectedFile?: string
  expandedPaths: Set<string>
}) {
  const isFolder = node.type === "tree"
  const isSelected = node.path === selectedFile

  return (
    <>
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-1 rounded px-1.5 py-1 text-left text-xs hover:bg-accent/50 transition-colors",
          isSelected && "bg-accent text-accent-foreground",
        )}
        style={{ paddingLeft: `${depth * 12 + 6}px` }}
        onClick={() => {
          if (isFolder) {
            onToggle(node.path)
          } else {
            onFileSelect(node.path, node.sha)
          }
        }}
      >
        {isFolder ? (
          expanded ? (
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <span className="shrink-0 text-xs leading-none">
          {isFolder ? "\uD83D\uDCC1" : getFileIcon(node.name)}
        </span>
        <span className="truncate font-mono">{node.name}</span>
      </button>
      {isFolder &&
        expanded &&
        node.children.map((child) => (
          <TreeNodeRow
            key={child.path}
            node={child}
            depth={depth + 1}
            expanded={expandedPaths.has(child.path)}
            onToggle={onToggle}
            onFileSelect={onFileSelect}
            selectedFile={selectedFile}
            expandedPaths={expandedPaths}
          />
        ))}
    </>
  )
}

const SKELETON_WIDTHS = [75, 60, 85, 55, 70, 90, 65, 80, 50, 80, 65, 75]

function SkeletonRows() {
  return (
    <div className="flex flex-col gap-1.5 p-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-5 rounded bg-muted/50 animate-pulse"
          style={{ width: `${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}%`, marginLeft: `${(i % 3) * 12}px` }}
        />
      ))}
    </div>
  )
}

export function FileTree({ owner, repo, branch, onFileSelect, selectedFile }: FileTreeProps) {
  const [tree, setTree] = useState<TreeEntry[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [currentBranch, setCurrentBranch] = useState(branch)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTree = useCallback(async (branchName: string) => {
    setLoading(true)
    setError(null)

    const cacheKey = `repo-tree:${owner}/${repo}:${branchName}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { tree: TreeEntry[]; ts: number }
        if (Date.now() - parsed.ts < 5 * 60 * 1000) {
          setTree(parsed.tree)
          setLoading(false)
          return
        }
      } catch {
        sessionStorage.removeItem(cacheKey)
      }
    }

    try {
      const params = new URLSearchParams({ owner, repo, branch: branchName })
      const res = await fetch(`/api/repo-tree?${params}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed to fetch tree" }))
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }
      const data = await res.json()
      setTree(data.tree)
      sessionStorage.setItem(cacheKey, JSON.stringify({ tree: data.tree, ts: Date.now() }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load file tree")
    } finally {
      setLoading(false)
    }
  }, [owner, repo])

  const fetchBranches = useCallback(async () => {
    try {
      const params = new URLSearchParams({ owner, repo })
      const res = await fetch(`/api/repo-tree/branches?${params}`)
      if (!res.ok) return
      const data = await res.json()
      setBranches(data.branches ?? [])
    } catch {
      // branches are optional, fail silently
    }
  }, [owner, repo])

  useEffect(() => {
    fetchTree(currentBranch)
    fetchBranches()
  }, [currentBranch, fetchTree, fetchBranches])

  useEffect(() => {
    setCurrentBranch(branch)
  }, [branch])

  const treeNodes = useMemo(() => buildTree(tree), [tree])

  const handleToggle = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }, [])

  // Auto-expand parent folders of selected file
  useEffect(() => {
    if (!selectedFile) return
    const parts = selectedFile.split("/")
    const paths: string[] = []
    for (let i = 1; i < parts.length; i++) {
      paths.push(parts.slice(0, i).join("/"))
    }
    if (paths.length > 0) {
      setExpandedPaths((prev) => {
        const next = new Set(prev)
        let changed = false
        for (const p of paths) {
          if (!next.has(p)) {
            next.add(p)
            changed = true
          }
        }
        return changed ? next : prev
      })
    }
  }, [selectedFile])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Branch selector */}
      <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
        <GitBranch className="size-3.5 text-muted-foreground shrink-0" />
        {branches.length > 1 ? (
          <select
            value={currentBranch}
            onChange={(e) => setCurrentBranch(e.target.value)}
            className="min-w-0 flex-1 truncate rounded border border-border bg-card px-1.5 py-0.5 font-mono text-xs text-foreground"
          >
            {branches.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        ) : (
          <span className="truncate font-mono text-xs text-muted-foreground">
            {currentBranch}
          </span>
        )}
      </div>

      {/* Tree content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-1">
        {loading && <SkeletonRows />}
        {error && (
          <div className="px-3 py-4 text-center text-xs text-destructive">{error}</div>
        )}
        {!loading && !error && treeNodes.length === 0 && (
          <div className="px-3 py-4 text-center text-xs text-muted-foreground">
            No files found
          </div>
        )}
        {!loading &&
          !error &&
          treeNodes.map((node) => (
            <TreeNodeRow
              key={node.path}
              node={node}
              depth={0}
              expanded={expandedPaths.has(node.path)}
              onToggle={handleToggle}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
              expandedPaths={expandedPaths}
            />
          ))}
      </div>
    </div>
  )
}
