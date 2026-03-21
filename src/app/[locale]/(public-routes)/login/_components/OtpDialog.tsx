"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
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
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg font-medium">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-center">
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
                <InputOTPSlot index={0} className="size-11 text-base" />
                <InputOTPSlot index={1} className="size-11 text-base" />
                <InputOTPSlot index={2} className="size-11 text-base" />
                <InputOTPSlot index={3} className="size-11 text-base" />
                <InputOTPSlot index={4} className="size-11 text-base" />
                <InputOTPSlot index={5} className="size-11 text-base" />
              </InputOTPGroup>
            </InputOTP>

            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}

            <p className="text-xs text-muted-foreground">
              {t("resendPrompt")}{" "}
              <button
                type="button"
                onClick={handleResend}
                className="cursor-pointer text-foreground underline underline-offset-4 transition-colors hover:text-primary"
              >
                {t("resendButton")}
              </button>
            </p>
          </div>
        )}

        {step === "verifying" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("verifying")}</p>
          </div>
        )}

        {(step === "input" || step === "error") && (
          <div className="flex justify-center pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenChange(false)}
              className="cursor-pointer gap-1.5 text-muted-foreground"
            >
              <ArrowLeft className="size-4" />
              {t("back")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
