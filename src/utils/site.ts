export const siteConfig = {
  name: "LumoraEvents",
  //siteUrl: "https://lumoraevents.net",
  siteUrl: "https://amorancho.github.io",
  appUrl: "https://app.lumoraevents.net",
  email: "hello@lumoraevents.net",
  instagramHandle: "@lumoraevents.app",
  instagramUrl: "https://instagram.com/lumoraevents.app",
  socialImage: "/images/og-default.svg",
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
