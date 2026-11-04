import { siteUrl } from "@/lib/site";

export const defaultLocale = "en";

export const supportedLocales = ["en", "nl", "de", "fr", "es", "it"] as const;

// Only publish language variants whose landing copy has been reviewed.
export const indexableLocales: readonly SupportedLocale[] = ["en", "nl"];

export type SupportedLocale = (typeof supportedLocales)[number];

export type LocaleOption = {
  code: SupportedLocale;
  hreflang: string;
  label: string;
  nativeLabel: string;
};

export const localeOptions: LocaleOption[] = [
  { code: "en", hreflang: "en", label: "English", nativeLabel: "English" },
  { code: "nl", hreflang: "nl", label: "Dutch", nativeLabel: "Nederlands" },
  { code: "de", hreflang: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "fr", hreflang: "fr", label: "French", nativeLabel: "Francais" },
  { code: "es", hreflang: "es", label: "Spanish", nativeLabel: "Espanol" },
  { code: "it", hreflang: "it", label: "Italian", nativeLabel: "Italiano" },
];

export const indexableLocaleOptions = localeOptions.filter((locale) =>
  indexableLocales.includes(locale.code),
);

export function isIndexableLocale(locale: SupportedLocale) {
  return indexableLocales.includes(locale);
}

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}

export function getLocalizedPath(locale: SupportedLocale, path = "/") {
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return normalizedPath || "/";
  return `/${locale}${normalizedPath}`;
}

export function getAbsoluteLocalizedUrl(locale: SupportedLocale, path = "/") {
  return `${siteUrl}${getLocalizedPath(locale, path) === "/" ? "" : getLocalizedPath(locale, path)}`;
}

export function getLanguageAlternates(path = "/") {
  return {
    ...Object.fromEntries(
      indexableLocaleOptions.map((locale) => [
        locale.hreflang,
        getAbsoluteLocalizedUrl(locale.code, path),
      ]),
    ),
    "x-default": getAbsoluteLocalizedUrl(defaultLocale, path),
  };
}
