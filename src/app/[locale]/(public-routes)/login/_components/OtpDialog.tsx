"use client"

import { Mail, ArrowLeft, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/lib/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/src/lib/components/ui/input-otp"
import { Button } from "@/src/lib/components/ui/button"
import type { OtpDialogProps } from "../_types/types"
import { useOtpDialog } from "../_hooks/useOtpDialog"

export function OtpDialog({ open, onOpenChange, email }: OtpDialogProps) {
  const t = useTranslations("login.otp")
  const {
    otp,
    setOtp,
    step,
    errorMessage,
    handleComplete,
    handleOpenChange,
    handleResend,
  } = useOtpDialog(email, onOpenChange)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>

          <DialogTitle className="text-xl">{t("title")}</DialogTitle>

          <DialogDescription className="text-center">
            {t("description")}{" "}
            <span className="font-medium text-foreground">{email}</span>
          </DialogDescription>
        </DialogHeader>

        {(step === "input" || step === "error") && (
          <div className="flex flex-col items-center gap-4 pt-2">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              onComplete={handleComplete}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
                <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
                <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
                <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
                <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
                <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
              </InputOTPGroup>
            </InputOTP>

            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}

            <p className="text-sm text-muted-foreground">
              {t("resendPrompt")}{" "}
              <button
                type="button"
                onClick={handleResend}
                className="cursor-pointer font-medium text-primary underline-offset-4 transition-colors hover:underline"
              >
                {t("resendButton")}
              </button>
            </p>
          </div>
        )}

        {step === "verifying" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{t("verifying")}</p>
          </div>
        )}

        {(step === "input" || step === "error") && (
          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenChange(false)}
              className="cursor-pointer gap-1 text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
