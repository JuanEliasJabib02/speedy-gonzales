"use client"

import { Zap } from "lucide-react"
import { useTranslations } from "next-intl"

import { OtpDialog } from "./OtpDialog"
import { MagicLink } from "./MagicLink"
import { ThemeToggle } from "@/src/lib/components/common/ThemeToggle"
import { useLoginForm } from "../_hooks/useLoginForm"

export function LoginForm() {
  const t = useTranslations("login")
  const {
    email,
    isSending,
    otpOpen,
    error,
    handleEmailChange,
    handleOtpOpenChange,
    handleSubmit,
  } = useLoginForm()

  return (
    <>
      <div className="relative flex min-h-svh items-center justify-center px-4 py-12">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">
          {/* Logo & branding */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-primary">
              <Zap className="size-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Speedy Gonzales
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("branding.tagline")}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-5">
              <h2 className="text-lg font-medium text-card-foreground">
                {t("form.title")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("form.subtitle")}
              </p>
            </div>

            <MagicLink
              email={email}
              isSending={isSending}
              error={error}
              onEmailChange={handleEmailChange}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Footer */}
          <p className="mt-5 text-center text-xs text-muted-foreground">
            {t("footer.termsPrefix")}{" "}
            <a
              href="#"
              className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {t("footer.terms")}
            </a>{" "}
            {t("footer.privacyConnector")}{" "}
            <a
              href="#"
              className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {t("footer.privacy")}
            </a>
          </p>
        </div>
      </div>

      <OtpDialog open={otpOpen} onOpenChange={handleOtpOpenChange} email={email} />
    </>
  )
}
