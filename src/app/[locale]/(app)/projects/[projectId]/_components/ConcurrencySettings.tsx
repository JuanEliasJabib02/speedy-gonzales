"use client"

import { useState } from "react"
import { Settings2, Loader2 } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
import { Label } from "@/src/lib/components/ui/label"
import { Switch } from "@/src/lib/components/ui/switch"
import { Separator } from "@/src/lib/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/lib/components/ui/popover"

type ConcurrencySettingsProps = {
  projectId: Id<"projects">
  maxConcurrentPerFeature: number
  maxConcurrentGlobal: number
  autonomousLoop: boolean
  localPath: string
  notificationEnabled: boolean
}

export function ConcurrencySettings({
  projectId,
  maxConcurrentPerFeature,
  maxConcurrentGlobal,
  autonomousLoop,
  localPath,
  notificationEnabled,
}: ConcurrencySettingsProps) {
  const updateSettings = useMutation(api.projects.updateSettings)
  const [perFeature, setPerFeature] = useState(maxConcurrentPerFeature)
  const [global, setGlobal] = useState(maxConcurrentGlobal)
  const [loopEnabled, setLoopEnabled] = useState(autonomousLoop)
  const [path, setPath] = useState(localPath)
  const [notifications, setNotifications] = useState(notificationEnabled)
  const [isSaving, setIsSaving] = useState(false)
  const [open, setOpen] = useState(false)

  const hasChanges =
    perFeature !== maxConcurrentPerFeature ||
    global !== maxConcurrentGlobal ||
    loopEnabled !== autonomousLoop ||
    path !== localPath ||
    notifications !== notificationEnabled

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSettings({
        projectId,
        maxConcurrentPerFeature: perFeature,
        maxConcurrentGlobal: global,
        autonomousLoop: loopEnabled,
        localPath: path,
        notificationEnabled: notifications,
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
      setLoopEnabled(autonomousLoop)
      setPath(localPath)
      setNotifications(notificationEnabled)
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

          <Separator />

          <div>
            <h4 className="text-sm font-medium">Autonomous Loop</h4>
            <p className="text-xs text-muted-foreground">
              Enables the agent to pick and work on tickets automatically.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="autonomous-loop" className="text-xs">
                Enable autonomous loop
              </Label>
              <Switch
                id="autonomous-loop"
                checked={loopEnabled}
                onCheckedChange={setLoopEnabled}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="local-path" className="text-xs">
                Local repo path
              </Label>
              <Input
                id="local-path"
                type="text"
                placeholder="/home/juan/Projects/speedy-gonzales"
                value={path}
                onChange={(e) => setPath(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-xs">
                Notifications
              </Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
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
