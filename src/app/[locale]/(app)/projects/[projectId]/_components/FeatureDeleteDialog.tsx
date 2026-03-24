import { Button } from "@/src/lib/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/lib/components/ui/dialog"

type FeatureDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  featureTitle: string
  ticketCount: number
  onConfirm: () => void
}

export function FeatureDeleteDialog({
  open,
  onOpenChange,
  featureTitle,
  ticketCount,
  onConfirm,
}: FeatureDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Feature</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{featureTitle}&quot;? This will also delete all{" "}
            {ticketCount} tickets in this feature. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Feature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
