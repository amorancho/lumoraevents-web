export const siteConfig = {
  name: "LumoraEvents",
  //siteUrl: "https://lumoraevents.net",
  siteUrl: "https://amorancho.github.io",
  email: "hello@lumoraevents.net",
  socialImage: "/images/og-default.svg",
  defaultLocale: "en",
  locales: {
    en: {
      label: "English",
      lang: "en",
    },
    es: {
      label: "Español",
      lang: "es",
    },
  },
} as const;

export type Locale = keyof typeof siteConfig.locales;
