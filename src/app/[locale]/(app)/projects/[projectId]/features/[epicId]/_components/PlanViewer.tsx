"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/src/lib/helpers/cn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/lib/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/lib/components/ui/popover"
import { ChevronDown, Copy, Check } from "lucide-react"
import { ChecklistProgress } from "./ChecklistProgress"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useCallback, useState as useStateCopy } from "react"

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useStateCopy(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="relative my-3 rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between bg-muted/50 px-3 py-1">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <button type="button" onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </div>
      <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0, borderRadius: 0, fontSize: "0.8125rem" }}>
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

const planMarkdownComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "")
    const codeString = String(children).replace(/\n$/, "")
    if (match) return <CodeBlock language={match[1]} code={codeString} />
    return (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    )
  },
  pre({ children }) {
    return <>{children}</>
  },
  a({ href, children }) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
        {children}
      </a>
    )
  },
  h2({ children }) {
    return <h2 className="mt-6 mb-2 text-lg font-semibold text-foreground">{children}</h2>
  },
  h3({ children }) {
    return <h3 className="mt-4 mb-1 text-base font-medium text-foreground">{children}</h3>
  },
  p({ children }) {
    return <p className="text-sm text-foreground leading-relaxed mb-2">{children}</p>
  },
  ul({ children }) {
    return <ul className="ml-4 list-disc [&>li]:py-0.5 [&>li]:text-sm">{children}</ul>
  },
  ol({ children }) {
    return <ol className="ml-4 list-decimal [&>li]:py-0.5 [&>li]:text-sm">{children}</ol>
  },
  li({ children, ...props }) {
    const checked = (props as Record<string, unknown>).checked
    if (typeof checked === "boolean") {
      return (
        <li className="flex items-center gap-2 py-0.5 text-sm list-none -ml-4">
          <input type="checkbox" checked={checked} readOnly className="size-4 rounded accent-primary" />
          <span className={checked ? "line-through text-muted-foreground" : "text-foreground"}>{children}</span>
        </li>
      )
    }
    return <li className="text-foreground">{children}</li>
  },
  blockquote({ children }) {
    return <blockquote className="border-l-2 border-muted-foreground/30 pl-4 my-2 text-muted-foreground italic">{children}</blockquote>
  },
  table({ children }) {
    return <table className="my-3 w-full border-collapse text-sm">{children}</table>
  },
  th({ children }) {
    return <th className="border border-border bg-muted px-3 py-1.5 text-left text-xs font-semibold">{children}</th>
  },
  td({ children }) {
    return <td className="border border-border px-3 py-1.5 text-sm">{children}</td>
  },
  hr() {
    return <hr className="my-4 border-border" />
  },
}

const STATUS_PILL: Record<string, string> = {
  "blocked": "bg-status-blocked/15 text-status-blocked",
  "todo": "bg-status-todo/15 text-status-todo",
  "in-progress": "bg-status-in-progress/15 text-status-in-progress",
  "review": "bg-status-review/15 text-status-review",
  "completed": "bg-status-completed/15 text-status-completed",
}

const STATUS_DOT: Record<string, string> = {
  "blocked": "bg-status-blocked",
  "todo": "bg-status-todo",
  "in-progress": "bg-status-in-progress",
  "review": "bg-status-review",
  "completed": "bg-status-completed",
}

const STATUS_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "blocked", label: "Blocked" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Done" },
] as const

const PRIORITY_PILL: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-status-in-progress/15 text-status-in-progress",
  high: "bg-status-review/15 text-status-review",
  critical: "bg-status-blocked/15 text-status-blocked",
}

type PlanViewerProps = {
  title: string
  status: string
  priority: string
  content: string
  checklist: { total: number; completed: number }
  ticketId?: string
  blockedReason?: string
}

export function PlanViewer({ title, status, priority, content, checklist, ticketId, blockedReason }: PlanViewerProps) {
  const updateStatus = useMutation(api.tickets.updateStatus)
  const [showBlockedInput, setShowBlockedInput] = useState(false)
  const [reasonText, setReasonText] = useState("")

  const handleStatusChange = (newStatus: string) => {
    if (!ticketId) return
    if (newStatus === "blocked") {
      setReasonText("")
      setShowBlockedInput(true)
      return
    }
    updateStatus({ ticketId: ticketId as Id<"tickets">, status: newStatus })
  }

  const handleBlockedSubmit = () => {
    if (!ticketId) return
    updateStatus({
      ticketId: ticketId as Id<"tickets">,
      status: "blocked",
      blockedReason: reasonText.trim() || undefined,
    })
    setShowBlockedInput(false)
    setReasonText("")
  }

  const handleUnblock = () => {
    if (!ticketId) return
    updateStatus({ ticketId: ticketId as Id<"tickets">, status: "in-progress" })
  }

  const isBlocked = status === "blocked"

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-6 scrollbar-thin">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold">{title}</h2>

        {ticketId ? (
          <Popover open={showBlockedInput} onOpenChange={setShowBlockedInput}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80",
                    STATUS_PILL[status] ?? STATUS_PILL.todo
                  )}
                >
                  <div className={cn("size-1.5 rounded-full", STATUS_DOT[status] ?? "bg-status-todo")} />
                  {isBlocked ? "⛔ blocked" : status}
                  <ChevronDown className="size-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[140px]">
                {STATUS_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className="gap-2 text-xs"
                  >
                    <div className={cn("size-2 rounded-full", STATUS_DOT[option.value])} />
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <PopoverTrigger asChild>
              <span className="hidden" />
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="start">
              <p className="text-xs font-medium mb-2">Reason for blocking (optional)</p>
              <Input
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="e.g. Waiting on API…"
                className="h-7 text-xs mb-2"
                onKeyDown={(e) => { if (e.key === "Enter") handleBlockedSubmit() }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" className="h-6 text-xs flex-1" onClick={handleBlockedSubmit}>
                  Block
                </Button>
                <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setShowBlockedInput(false)}>
                  Cancel
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_PILL[status] ?? STATUS_PILL.todo}`}>
            {status}
          </span>
        )}

        <span className={`rounded-full px-2.5 py-0.5 text-xs ${PRIORITY_PILL[priority] ?? PRIORITY_PILL.medium}`}>
          {priority}
        </span>

        {isBlocked && ticketId && (
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs gap-1 border-status-blocked/30 text-status-blocked hover:bg-status-blocked/10"
            onClick={handleUnblock}
          >
            Unblock →
          </Button>
        )}
      </div>

      {isBlocked && blockedReason && (
        <div className="mb-4 rounded-md border border-status-blocked/30 bg-status-blocked/5 px-3 py-2">
          <p className="text-xs font-medium text-status-blocked">⛔ Blocked: {blockedReason}</p>
        </div>
      )}

      {checklist.total > 0 && (
        <ChecklistProgress completed={checklist.completed} total={checklist.total} />
      )}

      <div className="my-4 border-t border-border" />

      <div className="max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={planMarkdownComponents}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
