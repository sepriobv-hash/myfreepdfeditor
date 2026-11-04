import { LanguageSelector } from "@/components/landing/LanguageSelector";
import Link from "@/components/i18n/LocaleLink";
import { ArrowRight, Check } from "lucide-react";
import { activePdfTools } from "@/lib/pdfTools";
import { localizeTool } from "@/lib/localizedTools";
import { translators } from "@/lib/translations";
import type { SupportedLocale } from "@/lib/i18n";
const categoryOrder = ["Edit", "Sign", "Organize", "Convert", "Optimize", "Protect", "Annotate"] as const;

export default function AllToolsContent({ locale = "en" }: { locale?: SupportedLocale }) {
  const t = translators[locale];
  return (
    <main className="min-h-screen bg-mist text-ink">
      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <Link className="text-sm font-semibold text-brand-700 hover:text-brand-700" href="/">
          MyFreePDFEditor
        </Link>
        <div className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-brand-700">{t("All tools")}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink md:text-5xl">{t("Free PDF tools that work in your browser")}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{t("Edit text, sign a document, combine files or reduce the size of a PDF. Choose a tool below; your PDF is processed on your device, with no account and no watermark.")}</p>
        </div>

        <div className="mt-10 space-y-10">
          {categoryOrder.map((category) => {
            const tools = activePdfTools.filter((tool) => tool.category === category).map(tool => localizeTool(tool, locale));
            if (tools.length === 0) return null;

            return (
              <section key={category}>
                <h2 className="text-2xl font-semibold text-ink">{t(category)}</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/${tool.slug}`}
                      className="group rounded-lg border border-line bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-panel"
                    >
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-rose-50 text-rose-600">
                        <Check className="h-4 w-4" />
                      </div>
                      <h3 className="text-lg font-semibold text-ink">{tool.shortTitle}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{tool.intro}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">{t("Open tool")}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 pb-10"><LanguageSelector currentLocale={locale} label={t("Language")} /></div>
    </main>
  );
}
