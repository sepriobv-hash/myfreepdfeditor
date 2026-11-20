import { ArrowRight, FileOutput, Files, Minimize2, FileText, ShieldCheck, Signature, TextCursorInput } from "lucide-react";
import { SiteFooter } from "@/components/brand/SiteFooter";
import { FaqList } from "@/components/ui/FaqList";
import { SiteHeader } from "@/components/brand/SiteHeader";
import { LandingUpload } from "@/components/landing/LandingUpload";
import { getLandingFaqs } from "@/components/landing/faqData";
import { getLandingCopy } from "@/components/landing/landingCopy";
import { defaultLocale, getLocalizedPath, type SupportedLocale } from "@/lib/i18n";
import { localizeTool } from "@/lib/localizedTools";
import { getToolBySlug } from "@/lib/pdfTools";
import { translators } from "@/lib/translations";

const shortcuts = [
  { slug: "edit-pdf-text", icon: TextCursorInput, description: "Replace existing text on the page." },
  { slug: "merge-pdf", icon: Files, description: "Combine several PDFs into one file." },
  { slug: "sign-pdf", icon: Signature, description: "Draw or place your signature on a page." },
  { slug: "compress-pdf", icon: Minimize2, description: "Reduce the file size for sharing or uploads." },
  { slug: "extract-pdf-pages", icon: FileOutput, description: "Save a selection of pages together in one PDF." },
  { slug: "pdf-to-text", icon: FileText, description: "Extract selectable text as a TXT file." },
];

export function LandingPage({ locale = defaultLocale }: { locale?: SupportedLocale }) {
  const t = translators[locale];
  const copy = getLandingCopy(locale);
  const faqs = getLandingFaqs(locale);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <SiteHeader locale={locale} path="/" t={t} />

      <section className="site-wrap grid gap-6 py-8 sm:gap-9 sm:py-12 md:grid-cols-[1fr_0.95fr] md:items-center lg:gap-16 lg:py-[4.5rem]">
        <div className="min-w-0">
          <h1 className="site-title md:max-w-[14ch] text-[clamp(2.6rem,6.15vw,5.25rem)]">{copy.title}</h1>
          <p className="mt-4 max-w-[34rem] text-base leading-relaxed text-muted sm:mt-5 sm:text-lg">
            {copy.description}
          </p>
          <a
            href={getLocalizedPath(locale, "/security")}
            className="mt-4 inline-flex min-h-8 items-center gap-2 rounded-sm text-sm font-medium text-muted hover:text-ink hover:underline sm:mt-5"
          >
            <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-brand-700" />
            {t("Files stay on your device")}
          </a>
        </div>
        <LandingUpload locale={locale} />
      </section>

      <section id="tools" className="border-y border-line bg-white">
        <div className="site-wrap py-8 sm:py-11">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2">
            <h2 className="site-title text-3xl sm:text-4xl">{t("Tools")}</h2>
            <a href={getLocalizedPath(locale, "/all-tools")} className="inline-flex min-h-9 items-center gap-2 rounded-sm text-sm font-semibold text-brand-700 hover:underline">
              {t("All PDF tools")} <ArrowRight aria-hidden="true" size={16} />
            </a>
          </div>
          <div className="tool-link-grid grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {shortcuts.map(({ slug, icon: Icon, description }) => {
              const tool = localizeTool(getToolBySlug(slug)!, locale);
              return (
                <a
                  key={slug}
                  href={getLocalizedPath(locale, `/${slug}`)}
                  aria-labelledby={`home-${slug}`}
                  aria-describedby={`home-${slug}-summary`}
                  className="group flex min-h-24 items-start gap-3 bg-white px-4 py-4 hover:bg-paper focus-visible:outline-offset-[-3px] sm:px-5"
                >
                  <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand-700" />
                  <div className="min-w-0 flex-1">
                    <h3 id={`home-${slug}`} className="font-semibold leading-snug group-hover:text-brand-700">{tool.shortTitle}</h3>
                    <p id={`home-${slug}-summary`} className="mt-1 text-sm leading-5 text-muted">{t(description)}</p>
                  </div>
                  <ArrowRight aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted group-hover:text-brand-700" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="site-wrap grid gap-4 py-9 sm:py-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <h2 className="site-title text-3xl sm:text-4xl">{t("FAQ")}</h2>
        <FaqList faqs={faqs} />
      </section>
      <SiteFooter locale={locale} t={t} />
    </main>
  );
}
