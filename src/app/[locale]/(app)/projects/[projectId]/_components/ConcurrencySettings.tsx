"use client"

import { useState } from "react"
import { Settings2, Loader2 } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
import { Label } from "@/src/lib/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/lib/components/ui/popover"

type ConcurrencySettingsProps = {
  projectId: Id<"projects">
  maxConcurrentPerFeature: number
  maxConcurrentGlobal: number
}

export function ConcurrencySettings({
  projectId,
  maxConcurrentPerFeature,
  maxConcurrentGlobal,
}: ConcurrencySettingsProps) {
  const updateSettings = useMutation(api.projects.updateSettings)
  const [perFeature, setPerFeature] = useState(maxConcurrentPerFeature)
  const [global, setGlobal] = useState(maxConcurrentGlobal)
  const [isSaving, setIsSaving] = useState(false)
  const [open, setOpen] = useState(false)

  const hasChanges =
    perFeature !== maxConcurrentPerFeature || global !== maxConcurrentGlobal

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSettings({
        projectId,
        maxConcurrentPerFeature: perFeature,
        maxConcurrentGlobal: global,
      })
      setOpen(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      setPerFeature(maxConcurrentPerFeature)
      setGlobal(maxConcurrentGlobal)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <Settings2 className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Concurrency Limits</h4>
            <p className="text-xs text-muted-foreground">
              Controls how many tickets the agent runs in parallel.
            </p>
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="per-feature" className="text-xs">
                Per feature (max tickets within one feature)
              </Label>
              <Input
                id="per-feature"
                type="number"
                min={1}
                max={10}
                value={perFeature}
                onChange={(e) => setPerFeature(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="global" className="text-xs">
                Global (max tickets across all features)
              </Label>
              <Input
                id="global"
                type="number"
                min={1}
                max={20}
                value={global}
                onChange={(e) => setGlobal(Number(e.target.value))}
              />
            </div>
          </div>
          <Button
            size="sm"
            className="w-full"
            disabled={!hasChanges || isSaving}
            onClick={handleSave}
          >
            {isSaving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
