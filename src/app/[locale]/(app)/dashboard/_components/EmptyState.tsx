import { FolderKanban } from "lucide-react"
import { Button } from "@/src/lib/components/ui/button"

type EmptyStateProps = {
  onCreateProject: () => void
}

export function EmptyState({ onCreateProject }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <FolderKanban className="size-12 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-medium">No projects yet</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Create your first project to get started.
      </p>
      <Button className="mt-6" onClick={onCreateProject}>
        Create project
      </Button>
    </div>
  )
}
