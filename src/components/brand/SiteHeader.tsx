import { LayoutGrid } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { getLocalizedPath, type SupportedLocale } from "@/lib/i18n";

import { SiteLanguageMenu } from "./SiteLanguageMenu";

const links = [
  { path: "/all-tools", label: "All PDF tools" },
  { path: "/merge-pdf", label: "Merge PDF" },
  { path: "/compress-pdf", label: "Compress PDF" },
] as const;

export function SiteHeader({
  locale,
  path,
  t,
}: {
  locale: SupportedLocale;
  path: string;
  t: (text: string) => string;
}) {
  return (
    <header className="relative z-20 border-b border-line bg-paper">
      <nav className="site-wrap flex min-h-[3.75rem] items-center gap-2 sm:min-h-16 sm:gap-5">
        <a href={getLocalizedPath(locale)} className="mr-auto inline-flex min-h-11 items-center rounded-sm">
          <BrandLogo />
        </a>
        <div className="hidden items-center gap-1 md:flex lg:gap-5">
          {links.map(link => (
            <a
              key={link.path}
              href={getLocalizedPath(locale, link.path)}
              aria-current={link.path === path ? "page" : undefined}
              className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-muted hover:text-ink aria-[current=page]:font-semibold aria-[current=page]:text-brand-700"
            >
              {t(link.label)}
            </a>
          ))}
        </div>
        <a
          href={getLocalizedPath(locale, "/all-tools")}
          aria-label={t("All PDF tools")}
          aria-current={path === "/all-tools" ? "page" : undefined}
          className="grid size-11 shrink-0 place-items-center rounded-md text-muted hover:bg-mist hover:text-ink aria-[current=page]:text-brand-700 md:hidden"
        >
          <LayoutGrid aria-hidden="true" size={18} />
        </a>
        <SiteLanguageMenu locale={locale} path={path} label={t("Language")} />
      </nav>
    </header>
  );
}
