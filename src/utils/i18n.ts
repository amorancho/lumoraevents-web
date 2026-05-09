import en from "../i18n/en.json";
import es from "../i18n/es.json";
import { sharedMessages } from "../content/shared-messages";
import { siteConfig, type Locale } from "./site";

const mergedEn = {
  ...en,
  ...sharedMessages.en,
};

const dictionaries = {
  en: mergedEn,
  es: {
    ...es,
    ...sharedMessages.es,
  },
};

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

export function getMessages<T extends Locale>(locale: T) {
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

export function getAlternateLinks(
  slug: string | Partial<Record<Locale, string>> = "",
) {
  const slugByLocale =
    typeof slug === "string"
      ? Object.fromEntries(
          localeEntries.map(({ code }) => [code, slug]),
        ) as Record<Locale, string>
      : (slug as Partial<Record<Locale, string>>);

  const alternates = localeEntries.map(({ code, lang }) => ({
    href: getCanonicalUrl(code, slugByLocale[code] ?? ""),
    hreflang: lang,
  }));

  return [
    ...alternates,
    {
      href: getCanonicalUrl(
        siteConfig.defaultLocale,
        slugByLocale[siteConfig.defaultLocale] ?? "",
      ),
      hreflang: "x-default",
    },
  ];
}

export function getLocaleDefinition(locale: Locale) {
  return siteConfig.locales[locale];
}
