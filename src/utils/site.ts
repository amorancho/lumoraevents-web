import sharedSiteConfig from "../../site.config.mjs";

export const siteConfig = {
  ...sharedSiteConfig,
  defaultLocale: "es",
  locales: {
    es: {
      label: "Espa\u00f1ol",
      lang: "es",
      ogLocale: "es_ES",
    },
    en: {
      label: "English",
      lang: "en",
      ogLocale: "en_US",
    },
  },
} as const;

export type Locale = keyof typeof siteConfig.locales;
