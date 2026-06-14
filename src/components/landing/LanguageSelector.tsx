"use client";

import { Languages } from "lucide-react";
import Link from "next/link";
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
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-brand-600 shadow-sm">
          <Languages className="h-4 w-4" />
        </span>
        <span>{label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {localeOptions.map((locale) => {
          const isActive = locale.code === currentLocale;
          return (
            <Link
              key={locale.code}
              href={getLocalizedPath(locale.code)}
              hrefLang={locale.hreflang}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "inline-flex h-9 items-center rounded-md bg-ink px-3 text-sm font-semibold text-white"
                  : "inline-flex h-9 items-center rounded-md border border-line bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
              }
            >
              {locale.nativeLabel}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
