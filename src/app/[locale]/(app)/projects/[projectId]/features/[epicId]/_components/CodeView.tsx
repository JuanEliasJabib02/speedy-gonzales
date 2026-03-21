"use client"

import { Code2 } from "lucide-react"

export function CodeView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
      <Code2 className="size-10 opacity-40" />
      <p className="text-sm font-medium">Code viewer — coming soon</p>
    </div>
  )
}
