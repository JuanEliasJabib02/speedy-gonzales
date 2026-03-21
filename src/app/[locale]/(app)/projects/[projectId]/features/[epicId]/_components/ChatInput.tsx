"use client"

import { useState } from "react"
import { SendHorizontal } from "lucide-react"
import { Input } from "@/src/lib/components/ui/input"
import { Button } from "@/src/lib/components/ui/button"

export function ChatInput() {
  const [value, setValue] = useState("")

  return (
    <div className="flex items-center gap-2 border-t border-border p-3">
      <Input
        placeholder="Type a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1"
      />
      <Button variant="ghost" size="icon" className="shrink-0">
        <SendHorizontal className="size-4" />
      </Button>
    </div>
  )
}
