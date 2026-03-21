"use client"

import { ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"

import { OtpDialog } from "./OtpDialog"
import { MagicLink } from "./MagicLink"
import { GoogleAuth } from "./GoogleAuth"
import { useLoginForm } from "../_hooks/useLoginForm"

export function LoginForm() {
  const t = useTranslations("login")
  const {
    email,
    isSending,
    isGoogleLoading,
    otpOpen,
    error,
    handleEmailChange,
    handleOtpOpenChange,
    handleSubmit,
    handleGoogleAuth,
  } = useLoginForm()

  return (
    <>
      <div className="flex min-h-svh items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          {/* Logo & branding */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-sm">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              HostCo
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("branding.tagline")}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-card-foreground">
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

            <div className="relative my-6 flex items-center">
              <div className="flex-1 border-t border-border" />
              <span className="mx-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                o
              </span>
              <div className="flex-1 border-t border-border" />
            </div>

            <GoogleAuth isLoading={isGoogleLoading} onAuth={handleGoogleAuth} />
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t("footer.termsPrefix")}{" "}
            <a
              href="#"
              className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
            >
              {t("footer.terms")}
            </a>{" "}
            {t("footer.privacyConnector")}{" "}
            <a
              href="#"
              className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
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
