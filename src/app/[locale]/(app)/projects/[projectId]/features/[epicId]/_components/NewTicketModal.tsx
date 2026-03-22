"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
import { Label } from "@/src/lib/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/lib/components/ui/dialog"

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
] as const

type NewTicketModalProps = {
  epicId: string
  onSubmit?: (message: string) => void
}

export function NewTicketModal({ epicId, onSubmit }: NewTicketModalProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("medium")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim()) return
    setIsSubmitting(true)

    const prompt = [
      `Create a new ticket for the current feature:`,
      `Title: ${title.trim()}`,
      `Priority: ${priority}`,
      description.trim() ? `Description: ${description.trim()}` : "",
      "",
      `Create the file following the SPEC format, commit it, and push.`,
    ]
      .filter(Boolean)
      .join("\n")

    onSubmit?.(prompt)

    setTitle("")
    setPriority("medium")
    setDescription("")
    setIsSubmitting(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
          <Plus className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Plus className="size-4" />
            New Ticket
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          <div>
            <Label htmlFor="ticket-title" className="text-xs">Title *</Label>
            <Input
              id="ticket-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Add streaming support"
              className="h-8 text-sm mt-1"
              onKeyDown={(e) => { if (e.key === "Enter" && title.trim()) handleSubmit() }}
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="ticket-priority" className="text-xs">Priority</Label>
            <select
              id="ticket-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 w-full rounded border border-border bg-card text-sm px-2 py-1.5 text-foreground"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="ticket-desc" className="text-xs">Description (optional)</Label>
            <textarea
              id="ticket-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What should this ticket accomplish?"
              rows={3}
              className="mt-1 w-full rounded border border-border bg-card text-sm px-3 py-2 text-foreground resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting}
            className="w-full h-8 text-sm"
          >
            {isSubmitting ? "Creating…" : "Create Ticket"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
