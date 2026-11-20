import { SiteFooter } from "@/components/brand/SiteFooter";
import { SiteHeader } from "@/components/brand/SiteHeader";
import { PrivacyControls } from "@/components/privacy/PrivacyControls";
import type { SupportedLocale } from "@/lib/i18n";
import { informationPages } from "@/lib/informationContent";
import { translators } from "@/lib/translations";

export { informationPages } from "@/lib/informationContent";

export function InformationPage({ page, locale }: { page: string; locale: SupportedLocale }) {
  const t = translators[locale];
  const content = informationPages[page];

  return (
    <main className="min-h-screen bg-paper text-ink">
      <SiteHeader locale={locale} path={`/${page}`} t={t} />
      <article className="site-wrap max-w-[49rem] py-9 sm:py-14">
        <header className="border-b border-line pb-7">
          <h1 className="site-title text-4xl sm:text-6xl">{t(content.title)}</h1>
          <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-muted">{t(content.intro)}</p>
        </header>
        <div className="mt-7 space-y-8 sm:space-y-9">
          {content.sections.map(([title, ...paragraphs]) => (
            <section key={title}>
              <h2 className="site-title text-2xl sm:text-3xl">{t(title)}</h2>
              {paragraphs.map(text => <p key={text} className="mt-3 leading-7 text-muted">{t(text)}</p>)}
            </section>
          ))}
        </div>
        {page === "privacy" && (
          <section className="mt-9 rounded-lg border border-line bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold">{t("Data on this device")}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {t("Clearing local data removes pending PDF uploads, this tab’s anonymous session and your analytics choice. It does not delete downloaded files.")}
            </p>
            <PrivacyControls />
          </section>
        )}
      </article>
      <SiteFooter locale={locale} t={t} />
    </main>
  );
}
