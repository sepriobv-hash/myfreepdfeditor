import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/brand/SiteFooter";
import { SiteHeader } from "@/components/brand/SiteHeader";
import { FaqList } from "@/components/ui/FaqList";
import { getLocalizedPath, type SupportedLocale } from "@/lib/i18n";
import type { PdfTool } from "@/lib/pdfTools";
import { getToolGuide } from "@/lib/toolGuides";
import { translators } from "@/lib/translations";
import { CompressionExamples, DocumentExample } from "./ToolExamples";
import { ToolWorkspace } from "./ToolWorkspace";

export function ToolLandingPage({
  tool,
  relatedTools,
  locale,
}: {
  tool: PdfTool;
  relatedTools: PdfTool[];
  locale: SupportedLocale;
}) {
  const t = translators[locale];
  const guide = getToolGuide(locale, tool.slug);
  const relatedLinks = guide?.links ?? relatedTools.map(item => ({
    slug: item.slug,
    label: item.shortTitle,
    description: item.intro,
  }));

  return (
    <main className="min-h-screen bg-paper text-ink">
      <SiteHeader locale={locale} path={`/${tool.slug}`} t={t} />
      <section className="site-wrap py-6 sm:py-8 lg:py-11">
        <a
          href={getLocalizedPath(locale, "/all-tools")}
          className="mb-4 inline-flex min-h-9 items-center gap-2 rounded-sm text-sm font-medium text-muted hover:text-ink hover:underline"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          {t("All PDF tools")}
        </a>
        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-start lg:gap-14">
          <div className="min-w-0">
            <h1 className="site-title text-[clamp(2.35rem,5vw,4.25rem)]">{tool.h1}</h1>
            <p className="mt-3 max-w-[49ch] text-base leading-relaxed text-muted sm:mt-4 sm:text-lg">
              {tool.intro}
            </p>
            <a
              href={getLocalizedPath(locale, "/security")}
              className="mt-4 inline-flex min-h-8 items-center gap-2 rounded-sm text-sm font-medium text-muted hover:text-ink hover:underline"
            >
              <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-brand-700" />
              {t("Files stay on your device")}
            </a>
          </div>
          <ToolWorkspace slug={tool.slug} workflow={tool.workflow} uploadTitle={tool.uploadTitle} />
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="site-wrap grid gap-8 py-8 sm:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <h2 className="site-title text-3xl">{t("How it works")}</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-muted marker:font-semibold marker:text-brand-700">
              {tool.steps.map(step => <li key={step} className="pl-1">{step}</li>)}
            </ol>
          </div>
          {tool.limitation && (
            <div className="border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <h2 className="text-base font-semibold">{t("Important limits")}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{tool.limitation}</p>
            </div>
          )}
        </div>
      </section>

      <DocumentExample slug={tool.slug} locale={locale} />
      {tool.workflow === "compress" && <CompressionExamples locale={locale} />}

      {guide && (
        <section className="site-wrap border-b border-line py-8 sm:py-12" aria-labelledby="tool-guide-heading">
          <h2 id="tool-guide-heading" className="site-title max-w-[30ch] text-3xl sm:text-4xl">{guide.heading}</h2>
          <div className="mt-4 max-w-[70ch] space-y-3 leading-relaxed text-muted">
            {guide.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-white p-5">
              <h3 className="font-semibold">{guide.exampleHeading}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{guide.example}</p>
            </div>
            <div className="border-t border-line pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <h3 className="font-semibold">{guide.tipsHeading}</h3>
              <ul className="ml-4 mt-2 list-disc space-y-1 text-sm leading-6 text-muted">
                {guide.tips.map(tip => <li key={tip}>{tip}</li>)}
              </ul>
            </div>
          </div>
        </section>
      )}

      {relatedLinks.length > 0 && (
        <section className="site-wrap py-8 sm:py-11">
          <h2 className="site-title mb-4 text-3xl">{guide?.relatedHeading ?? t("Related tools")}</h2>
          <div className="tool-link-grid grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {relatedLinks.map(({ slug, label, description }) => (
              <a
                key={slug}
                href={getLocalizedPath(locale, `/${slug}`)}
                className="group flex items-start gap-3 bg-white px-4 py-4 hover:bg-mist focus-visible:outline-offset-[-3px]"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold leading-snug group-hover:text-brand-700">{label}</h3>
                  <p className="mt-1 text-sm leading-5 text-muted">{description}</p>
                </div>
                <ArrowRight aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted group-hover:text-brand-700" />
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="site-wrap grid gap-4 pb-10 sm:pb-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <h2 className="site-title text-3xl">{t("FAQ")}</h2>
        <FaqList faqs={tool.faqs} />
      </section>
      <SiteFooter locale={locale} t={t} />
    </main>
  );
}
