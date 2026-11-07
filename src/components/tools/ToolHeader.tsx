import { ChevronDown, Globe2 } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { getLocalizedPath, localeOptions, type SupportedLocale } from "@/lib/i18n";

export function ToolHeader({ locale, path, languageLabel }: { locale: SupportedLocale; path: string; languageLabel: string }) {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a href={getLocalizedPath(locale, "/")} className="rounded-md text-ink"><BrandLogo compact /></a>
        <details className="group relative">
          <summary aria-label={languageLabel} className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
            <Globe2 aria-hidden="true" size={17} />{locale.toUpperCase()}<ChevronDown aria-hidden="true" size={14} className="group-open:rotate-180" />
          </summary>
          <ul className="absolute right-0 z-20 mt-1 max-h-80 w-48 overflow-y-auto rounded-lg border border-line bg-white p-1 shadow-panel">
            {localeOptions.map(option => <li key={option.code}>
              <a href={getLocalizedPath(option.code, path)} hrefLang={option.code} lang={option.code} aria-current={locale === option.code ? "page" : undefined}
                className="flex min-h-10 items-center rounded-md px-3 text-sm hover:bg-slate-50 aria-[current=page]:bg-rose-50 aria-[current=page]:font-semibold aria-[current=page]:text-brand-700">{option.nativeLabel}</a>
            </li>)}
          </ul>
        </details>
      </div>
    </header>
  );
}
