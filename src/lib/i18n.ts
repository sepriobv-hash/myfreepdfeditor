import { siteUrl } from "@/lib/site";

import { defaultLocale, supportedLocales, completedLocales, localeOptions, getIndexableLocales, type SupportedLocale } from "./routeRegistry";
export { defaultLocale, supportedLocales, localeOptions, type SupportedLocale } from "./routeRegistry";
export const indexableLocales = completedLocales;
export type LocaleOption = (typeof localeOptions)[number];

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
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const boundary = path.search(/[?#]/);
  const pathname = boundary < 0 ? path : path.slice(0, boundary);
  const suffix = boundary < 0 ? "" : path.slice(boundary);
  if (/^\/(api|brand|_next)(\/|$)/.test(pathname)) return path;
  const segments = pathname.split("/").filter(Boolean);
  if (isSupportedLocale(segments[0] ?? "")) segments.shift();
  const base = segments.length ? `/${segments.join("/")}` : "";
  return (locale === defaultLocale ? base || "/" : `/${locale}${base}`) + suffix;
}

export function getAbsoluteLocalizedUrl(locale: SupportedLocale, path = "/") {
  return `${siteUrl}${getLocalizedPath(locale, path) === "/" ? "" : getLocalizedPath(locale, path)}`;
}

export function getLanguageAlternates(path = "/"): Record<string, string> {
  if (getIndexableLocales(path).length === 0) return {};
  return {
    ...Object.fromEntries(
      localeOptions.filter(locale => getIndexableLocales(path).includes(locale.code)).map((locale) => [
        locale.hreflang,
        getAbsoluteLocalizedUrl(locale.code, path),
      ]),
    ),
    "x-default": getAbsoluteLocalizedUrl(defaultLocale, path),
  };
}
