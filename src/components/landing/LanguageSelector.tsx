"use client";

import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  defaultLocale,
  getLocalizedPath,
  localeOptions,
  type SupportedLocale,
} from "@/lib/i18n";

type LanguageSelectorProps = {
  currentLocale?: SupportedLocale;
  label?: string;
};

export function LanguageSelector({ currentLocale = defaultLocale, label = "Language" }: LanguageSelectorProps) {
  const pathname = usePathname();
  // Keep the footer compact; every regional locale remains accessible via a real link.
  const featured = localeOptions.filter((option, i) => i < 6 || option.code === currentLocale);
  const more = localeOptions.filter(option => !featured.includes(option));
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-brand-700 shadow-sm">
          <Languages className="h-4 w-4" />
        </span>
        <span>{label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {featured.map((locale) => {
          const isActive = locale.code === currentLocale;
          return (
            <a
              key={locale.code}
              href={getLocalizedPath(locale.code, pathname)}
              hrefLang={locale.hreflang}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "inline-flex h-9 items-center rounded-md bg-ink px-3 text-sm font-semibold text-white"
                  : "inline-flex h-9 items-center rounded-md border border-line bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
              }
            >
              {locale.nativeLabel}
            </a>
          );
        })}
        {more.length > 0 && (
          <details className="relative">
            <summary className="inline-flex h-9 cursor-pointer items-center rounded-md border border-line bg-white px-3 text-sm font-medium text-slate-700">
              {label} +
            </summary>
            <nav aria-label={label} className="absolute right-0 z-20 mt-1 max-h-72 min-w-44 overflow-y-auto rounded-lg border border-line bg-white p-2 shadow-panel">
              {more.map((option) => (
                <a key={option.code} href={getLocalizedPath(option.code, pathname)} hrefLang={option.hreflang} lang={option.hreflang}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  {option.nativeLabel}
                </a>
              ))}
            </nav>
          </details>
        )}
      </div>
    </div>
  );
}
