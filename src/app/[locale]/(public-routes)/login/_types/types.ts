export type OtpStep = "input" | "verifying" | "error"

export type OtpDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
}
