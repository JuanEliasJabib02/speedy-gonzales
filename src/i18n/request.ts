import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"
import { TRANSLATIONS_MODULES } from "./translation-modules"

async function loadMessages(locale: string) {
  const messages: Record<string, any> = {}

  for (const moduleName of TRANSLATIONS_MODULES) {
    try {
      const moduleMessages = await import(
        `../../messages/${locale}/${moduleName}.json`
      )
      messages[moduleName] = moduleMessages.default
    } catch (error) {
      console.warn(`Could not load ${moduleName}.json for locale ${locale}`)

      try {
        const fallbackMessages = await import(
          `../../messages/en/${moduleName}.json`
        )
        messages[moduleName] = fallbackMessages.default
      } catch (fallbackError) {
        console.error(`Module ${moduleName} not found in en either`)
      }
    }
  }

  return messages
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: await loadMessages(locale),
  }
})
