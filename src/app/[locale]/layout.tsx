import "./../../styles/globals.css"
import { Suspense } from "react"
import { Poppins } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { ConvexClientProvider } from "@/src/lib/components/common/ConvexClientProvider"
import { createMetadata } from "@/src/lib/helpers/createMetadata"

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
})

export const metadata = createMetadata()

type RootLayoutParams = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

async function LocaleLayout({
  children,
  params,
}: RootLayoutParams) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <ConvexAuthNextjsServerProvider>
      <html lang={locale}>
        <body className={poppins.className}>
          <ConvexClientProvider>
            <NextIntlClientProvider messages={messages}>
              <main>{children}</main>
            </NextIntlClientProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}

export default function RootLayout(props: RootLayoutParams) {
  return (
    <Suspense>
      <LocaleLayout {...props} />
    </Suspense>
  )
}
