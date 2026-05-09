import {
  getAlternateLinks,
  getCanonicalUrl,
  getLocalizedPath,
} from "./i18n";
import type { Locale } from "./site";

export const pageSlugs = {
  home: {
    en: "",
    es: "",
  },
  platform: {
    en: "platform",
    es: "plataforma",
  },
  about: {
    en: "about",
    es: "nosotros",
  },
  insights: {
    en: "insights",
    es: "insights",
  },
  contact: {
    en: "contact",
    es: "contacto",
  },
} as const satisfies Record<string, Record<Locale, string>>;

export type SitePage = keyof typeof pageSlugs;

export function getPageSlug(locale: Locale, page: SitePage) {
  return pageSlugs[page][locale];
}

export function getPagePath(locale: Locale, page: SitePage) {
  return getLocalizedPath(locale, getPageSlug(locale, page));
}

export function getPageCanonicalUrl(locale: Locale, page: SitePage) {
  return getCanonicalUrl(locale, getPageSlug(locale, page));
}

export function getAlternatePageLinks(page: SitePage) {
  const slugByLocale = Object.fromEntries(
    Object.entries(pageSlugs[page]),
  ) as Record<Locale, string>;

  return getAlternateLinks(slugByLocale);
}
