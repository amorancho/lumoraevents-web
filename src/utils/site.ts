import sharedSiteConfig from "../../site.config.mjs";

export const siteConfig = {
  ...sharedSiteConfig,
  defaultLocale: "en",
  locales: {
    en: {
      label: "English",
      lang: "en",
    },
    es: {
      label: "Espa\u00f1ol",
      lang: "es",
    },
  },
} as const;

export type Locale = keyof typeof siteConfig.locales;
