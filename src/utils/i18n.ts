import en from "../i18n/en.json";
import es from "../i18n/es.json";
import { siteConfig, type Locale } from "./site";

type Dictionary = typeof en;

const dictionaries = {
  en,
  es,
} satisfies Record<Locale, Dictionary>;

type LocaleEntry = {
  code: Locale;
  label: string;
  lang: string;
};

export const localeEntries: LocaleEntry[] = (
  Object.entries(siteConfig.locales) as [
    Locale,
    (typeof siteConfig.locales)[Locale],
  ][]
).map(([code, config]) => ({
  code,
  label: config.label,
  lang: config.lang,
}));

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

export function getMessages(locale: Locale) {
  return dictionaries[locale];
}

export function getLocalizedPath(locale: Locale, slug = "") {
  const normalizedSlug = trimSlashes(slug);

  if (locale === siteConfig.defaultLocale) {
    return normalizedSlug ? `/${normalizedSlug}/` : "/";
  }

  return normalizedSlug ? `/${locale}/${normalizedSlug}/` : `/${locale}/`;
}

export function getCanonicalUrl(locale: Locale, slug = "") {
  return new URL(getLocalizedPath(locale, slug), siteConfig.siteUrl).toString();
}

export function getAlternateLinks(slug = "") {
  const alternates = localeEntries.map(({ code, lang }) => ({
    href: getCanonicalUrl(code, slug),
    hreflang: lang,
  }));

  return [
    ...alternates,
    {
      href: getCanonicalUrl(siteConfig.defaultLocale, slug),
      hreflang: "x-default",
    },
  ];
}

export function getLocaleDefinition(locale: Locale) {
  return siteConfig.locales[locale];
}
