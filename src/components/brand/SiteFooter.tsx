import { BrandLogo } from "@/components/brand/BrandLogo";
import { LanguageSelector } from "@/components/landing/LanguageSelector";
import { getLocalizedPath, type SupportedLocale } from "@/lib/i18n";

const links = [
  { path: "/all-tools", label: "All PDF tools" },
  { path: "/about", label: "About" },
  { path: "/security", label: "Security" },
  { path: "/how-it-works", label: "How it works" },
  { path: "/privacy", label: "Privacy policy" },
  { path: "/terms", label: "Terms of use" },
] as const;

export function SiteFooter({ locale, t }: { locale: SupportedLocale; t: (text: string) => string }) {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="site-wrap py-7 sm:py-9">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a href={getLocalizedPath(locale)} className="inline-flex min-h-11 w-fit items-center rounded-sm">
            <BrandLogo />
          </a>
          <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            {links.map(link => (
              <a
                key={link.path}
                href={getLocalizedPath(locale, link.path)}
                className="inline-flex min-h-9 items-center hover:text-ink hover:underline"
              >
                {t(link.label)}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-5 border-t border-line pt-4">
          <LanguageSelector currentLocale={locale} label={t("Language")} />
        </div>
      </div>
    </footer>
  );
}
