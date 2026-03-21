"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { Button } from "@/src/lib/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/lib/components/ui/dialog"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const STATUS_PILL: Record<string, string> = {
  "blocked": "bg-status-blocked/15 text-status-blocked",
  "todo": "bg-status-todo/15 text-status-todo",
  "in-progress": "bg-status-in-progress/15 text-status-in-progress",
  "review": "bg-status-review/15 text-status-review",
  "completed": "bg-status-completed/15 text-status-completed",
}

const PRIORITY_PILL: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-status-in-progress/15 text-status-in-progress",
  high: "bg-status-review/15 text-status-review",
  critical: "bg-status-blocked/15 text-status-blocked",
}

type OverviewModalProps = {
  title: string
  status: string
  priority: string
  content: string
}

export function OverviewModal({ title, status, priority, content }: OverviewModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 h-7 text-xs gap-1.5">
          <Eye className="size-3.5" />
          Overview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="size-4" />
            {title}
          </DialogTitle>
          <div className="flex gap-2 pt-1">
            <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_PILL[status] ?? STATUS_PILL.todo}`}>
              {status}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs ${PRIORITY_PILL[priority] ?? PRIORITY_PILL.medium}`}>
              {priority}
            </span>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto scrollbar-thin -mx-6 px-6">
          <div className="prose prose-sm prose-invert max-w-none [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:text-base [&_h3]:font-medium [&_li]:text-sm [&_p]:text-sm [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:ml-4 [&_a]:text-primary [&_a]:underline">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
