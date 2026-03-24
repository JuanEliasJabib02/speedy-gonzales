"use client"

import { useState } from "react"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/lib/components/ui/dialog"
import { Input } from "@/src/lib/components/ui/input"
import { Label } from "@/src/lib/components/ui/label"
import { Button } from "@/src/lib/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/src/lib/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

type CreateProjectDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [repoUrl, setRepoUrl] = useState("")
  const [branch, setBranch] = useState("main")
  const [gitProvider, setGitProvider] = useState<"github" | "bitbucket">("github")
  const [isCreating, setIsCreating] = useState(false)

  const createProject = useAction(api.projects.createProject)

  const handleCreate = async () => {
    if (!name.trim() || !repoUrl.trim()) return
    setIsCreating(true)
    try {
      await createProject({
        name: name.trim(),
        description: description.trim() || undefined,
        repoUrl: repoUrl.trim(),
        branch: branch.trim() || "main",
        gitProvider,
      })
      setName("")
      setDescription("")
      setRepoUrl("")
      setBranch("main")
      setGitProvider("github")
      onOpenChange(false)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Create a new project to start managing features and tickets.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Project name</Label>
            <Input
              id="name"
              placeholder="My awesome project"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of the project"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Git Provider</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {gitProvider === "github" ? "GitHub" : "Bitbucket"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={gitProvider}
                  onValueChange={(value) => setGitProvider(value as "github" | "bitbucket")}
                >
                  <DropdownMenuRadioItem value="github">GitHub</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="bitbucket">Bitbucket</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="branch">Default branch</Label>
            <Input
              id="branch"
              placeholder="main"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="repo">Repository URL</Label>
            <Input
              id="repo"
              placeholder={gitProvider === "bitbucket" ? "bitbucket.org/workspace/repo" : "github.com/owner/repo"}
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || !repoUrl.trim() || isCreating}
          >
            {isCreating ? "Creating..." : "Create project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
