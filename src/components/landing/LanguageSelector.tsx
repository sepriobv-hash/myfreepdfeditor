"use client";

import { usePathname } from "next/navigation";
import { defaultLocale, getLocalizedPath, localeOptions, type SupportedLocale } from "@/lib/i18n";

export function LanguageSelector({
  currentLocale = defaultLocale,
  label = "Language",
}: {
  currentLocale?: SupportedLocale;
  label?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs text-muted">
      {localeOptions.map(option => (
        <a
          key={option.code}
          href={getLocalizedPath(option.code, pathname)}
          hrefLang={option.hreflang}
          lang={option.hreflang}
          aria-current={option.code === currentLocale ? "page" : undefined}
          className="inline-flex min-h-8 items-center rounded-sm hover:text-ink hover:underline aria-[current=page]:font-semibold aria-[current=page]:text-ink"
        >
          {option.nativeLabel}
        </a>
      ))}
    </nav>
  );
}
