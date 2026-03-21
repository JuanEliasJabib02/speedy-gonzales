"use client"

import { useState, useEffect, useCallback } from "react"
import { Copy, Check, ExternalLink, X, FileCode2 } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { cn } from "@/src/lib/helpers/cn"

const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  py: "python",
  rb: "ruby",
  rs: "rust",
  go: "go",
  java: "java",
  kt: "kotlin",
  swift: "swift",
  c: "c",
  cpp: "cpp",
  h: "c",
  hpp: "cpp",
  cs: "csharp",
  php: "php",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
  yml: "yaml",
  yaml: "yaml",
  json: "json",
  md: "markdown",
  mdx: "markdown",
  html: "html",
  css: "css",
  scss: "scss",
  sql: "sql",
  graphql: "graphql",
  dockerfile: "docker",
  toml: "toml",
  xml: "xml",
  svg: "xml",
  prisma: "prisma",
}

const BINARY_EXTENSIONS = new Set([
  "png", "jpg", "jpeg", "gif", "webp", "ico", "bmp", "svg",
  "woff", "woff2", "ttf", "eot", "otf",
  "pdf", "zip", "tar", "gz", "rar",
  "mp3", "mp4", "wav", "ogg", "webm",
  "exe", "dll", "so", "dylib",
])

const SKELETON_WIDTHS = [75, 60, 85, 55, 70, 90, 65, 80, 50, 80, 65, 75]

function getLanguageFromPath(path: string): string {
  const filename = path.split("/").pop() ?? ""
  const lower = filename.toLowerCase()

  if (lower === "dockerfile") return "docker"
  if (lower === "makefile") return "makefile"
  if (lower === ".gitignore" || lower === ".env" || lower === ".env.local") return "text"

  const ext = lower.split(".").pop() ?? ""
  return EXTENSION_LANGUAGE_MAP[ext] ?? "text"
}

function isBinaryPath(path: string): boolean {
  const ext = (path.split(".").pop() ?? "").toLowerCase()
  return BINARY_EXTENSIONS.has(ext)
}

type FileViewerProps = {
  owner: string
  repo: string
  path: string
  ref: string
  onClose?: () => void
}

export function FileViewer({ owner, repo, path, ref, onClose }: FileViewerProps) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isBinaryPath(path)) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    setContent(null)

    const params = new URLSearchParams({ owner, repo, path, ref })
    fetch(`/api/repo-file?${params}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: "Request failed" }))
          throw new Error(data.error ?? `HTTP ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setContent(data.content)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [owner, repo, path, ref])

  const handleCopy = useCallback(async () => {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [content])

  const segments = path.split("/")
  const language = getLanguageFromPath(path)
  const githubUrl = `https://github.com/${owner}/${repo}/blob/${ref}/${path}`
  const binary = isBinaryPath(path)

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-[#1e1e1e]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#252526] px-3 py-2">
        <FileCode2 className="size-4 shrink-0 text-muted-foreground" />
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-sm">
          {segments.map((segment, i) => (
            <span key={i} className="flex items-center gap-1 whitespace-nowrap">
              {i > 0 && <span className="text-muted-foreground/50">/</span>}
              <span
                className={cn(
                  i === segments.length - 1
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {segment}
              </span>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {!binary && content && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-white/10"
              title="Copy file content"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-white/10"
            title="Open in GitHub"
          >
            <ExternalLink className="size-3.5" />
          </a>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-white/10"
              title="Close"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading && (
          <div className="space-y-2 p-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-white/5"
                style={{ width: `${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}%` }}
              />
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 text-sm text-red-400">
            Failed to load file: {error}
          </div>
        )}

        {binary && !loading && (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-muted-foreground">
            <FileCode2 className="size-10 opacity-40" />
            <p className="text-sm">Binary file — preview not available</p>
          </div>
        )}

        {!loading && !error && !binary && content !== null && (
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            showLineNumbers
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: "0.8125rem",
              minHeight: "100%",
              background: "transparent",
            }}
            lineNumberStyle={{ minWidth: "3em", paddingRight: "1em", color: "#858585", userSelect: "none" }}
          >
            {content}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  )
}
