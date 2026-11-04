"use client";
import { useLocale, useTranslation } from "@/components/i18n/LocaleProvider";

import Link from "@/components/i18n/LocaleLink";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  FileText,
  LockKeyhole,
  RotateCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { UploadDropzone } from "@/components/editor/UploadDropzone";
import { useToast } from "@/components/ui/Toaster";
import { storePendingUpload } from "@/lib/editor/uploadHandoff";
import { type PdfTool } from "@/lib/pdfTools";
import { getLocalizedPath } from "@/lib/i18n";
import { LanguageSelector } from "@/components/landing/LanguageSelector";
import { fileSizeBucket, trackUsageEvent } from "@/lib/usage/client";

const MergePdfPanel = dynamic(
  () => import("@/components/tools/MergePdfPanel").then((module) => module.MergePdfPanel),
  { ssr: false, loading: function Loading() { return <p className="min-h-72 p-6 text-sm text-slate-600" role="status">{useTranslation()("Loading PDF merge tool…")}</p>; } },
);
const CompressPdfPanel = dynamic(
  () => import("@/components/tools/CompressPdfPanel").then((module) => module.CompressPdfPanel),
  { ssr: false, loading: function Loading() { return <p className="min-h-72 p-6 text-sm text-slate-600" role="status">{useTranslation()("Loading PDF compression tool…")}</p>; } },
);

type ToolLandingPageProps = {
  tool: PdfTool;
  relatedTools: PdfTool[];
};

export function ToolLandingPage({ tool, relatedTools }: ToolLandingPageProps) {
  const t = useTranslation();
  const locale = useLocale();
  const [isUploading, setIsUploading] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    trackUsageEvent("landing_view", { page: tool.slug });
  }, [tool.slug]);

  async function handleUpload(file: File) {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      notify(t("Please choose a valid PDF file."), "error");
      return;
    }

    try {
      setIsUploading(true);
      trackUsageEvent("upload_started", {
        source: tool.slug,
        fileSizeBucket: fileSizeBucket(file.size),
      });
      const uploadId = await storePendingUpload(file);
      trackUsageEvent("upload_success", {
        source: tool.slug,
        fileSizeBucket: fileSizeBucket(file.size),
      });
      notify(t("PDF uploaded. Opening editor..."), "success");
      window.location.assign(getLocalizedPath(locale, `/editor?uploadId=${encodeURIComponent(uploadId)}&tool=${tool.slug}`));
    } catch {
      setIsUploading(false);
      trackUsageEvent("upload_failed", { source: tool.slug });
      notify(t("Could not prepare this PDF."), "error");
    }
  }

  return (
    <main className="min-h-screen bg-mist text-ink">
      <nav className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 gap-y-2 px-5 py-4">
          <Link className="text-sm font-semibold text-ink" href="/">
            MyFreePDFEditor
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link className="hover:text-ink" href="/all-tools"> {t("All Tools")} </Link>
            <Link className="hover:text-ink" href="/security"> {t("Security")} </Link>
            <Link className="hover:text-ink" href="/privacy"> {t("Privacy")} </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <nav aria-label={t("Breadcrumb")} className="mb-6 text-sm text-slate-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link className="hover:text-ink" href="/">{t("Home")}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link className="hover:text-ink" href="/all-tools">{t("All PDF tools")}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-ink">{tool.shortTitle}</li>
          </ol>
        </nav>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-rose-100 bg-white px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm">
              <Sparkles className="h-4 w-4" /> {t("Free PDF tool")} </div>
            <h1 className="text-4xl font-semibold leading-tight text-ink md:text-5xl">
              {tool.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{tool.intro}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm font-medium">
              {[t("Free"), t("No signup"), t("No watermark"), t("Files stay on your device")].map((label, index) => (
                <span
                  key={label}
                  className={
                    index === 0
                      ? "rounded-md bg-rose-50 px-3 py-2 text-rose-700"
                      : index === 1
                        ? "rounded-md bg-amber-50 px-3 py-2 text-amber-700"
                        : index === 2
                          ? "rounded-md bg-emerald-50 px-3 py-2 text-emerald-700"
                          : "rounded-md bg-teal-50 px-3 py-2 text-teal-700"
                  }
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-rose-100 bg-white p-2 shadow-panel">
            {tool.workflow === "merge" ? (
              <MergePdfPanel />
            ) : tool.workflow === "compress" ? (
              <CompressPdfPanel />
            ) : (
              <UploadDropzone
                onFile={handleUpload}
                isLoading={isUploading}
                onChoose={() => trackUsageEvent("upload_clicked", { source: tool.slug })}
                wide
                copy={{
                  title: tool.uploadTitle,
                  description: tool.uploadDescription,
                  button: t("Choose PDF"),
                  privacy: t("Browser-first editing. No account required."),
                }}
              />
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-7 md:grid-cols-4">
          {[
            [t("No account required"), ShieldCheck],
            [t("Free core editing"), Check],
            [t("No watermark on export"), FileText],
            [t("Browser-first workflow"), LockKeyhole],
          ].map(([label, Icon]) => {
            const ToolIcon = Icon as typeof Check;
            return (
              <div key={label as string} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-600">
                  <ToolIcon className="h-4 w-4" />
                </div>
                {label as string}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-brand-700">{t("How it works")}</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">{t("Use the tool in three steps")}</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {tool.workflow === "merge"
              ? t("Choose multiple PDFs, set their order, and combine every page into one downloadable document without leaving this page.")
              : tool.workflow === "compress"
                ? t("Choose a quality level and let the browser compare lossless optimization with a smaller image-based copy before downloading the best result.")
                : t("This page opens the full editor workspace, focused on the task you searched for. You get the complete editor instead of a limited upload form.")}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {tool.steps.map((step, index) => (
            <article key={step} className="rounded-lg border border-line bg-white p-5 shadow-soft">
              <div className="mb-4 text-sm font-semibold text-brand-700">0{index + 1}</div>
              <p className="text-sm leading-6 text-slate-700">{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-14 md:grid-cols-2">
        <article className="rounded-lg border border-line bg-white p-6"><h2 className="text-xl font-semibold">{t("Example use")}</h2><p className="mt-3 leading-7 text-slate-600">{tool.useCase}</p>
          {tool.slug === "edit-pdf-text" && <div className="mt-5" aria-label={t("Sample correction")}><p className="mb-2 text-sm font-medium">{t("Sample correction")}</p><div className="grid grid-cols-2 gap-3"><div className="rounded border border-rose-200 bg-rose-50 p-4"><span className="text-xs">{t("Before")}</span><p className="mt-2 font-mono">{({en:"Invocie",nl:"Factur",de:"Rechnug",fr:"Factre",es:"Factra",it:"Fattua"})[locale]} #104</p></div><div className="rounded border border-emerald-200 bg-emerald-50 p-4"><span className="text-xs">{t("After")}</span><p className="mt-2 font-mono">{({en:"Invoice",nl:"Factuur",de:"Rechnung",fr:"Facture",es:"Factura",it:"Fattura"})[locale]} #104</p></div></div></div>}
          {tool.slug === "sign-pdf" && <div className="mt-5 rounded border border-line bg-mist p-4"><h3 className="font-semibold">{t("Signature placement")}</h3><p className="mt-2 leading-7">{t("Draw or upload → place and resize → download and review.")}</p></div>}
          {["reorder-pdf-pages", "delete-pdf-pages"].includes(tool.slug) && <div className="mt-5 rounded border border-line bg-mist p-4"><h3 className="font-semibold">{t("Sample page order")}</h3><p className="mt-2">{t("Before")}: 1 · 2 · 3</p><p>{t("After")}: {tool.slug === "reorder-pdf-pages" ? "3 · 1 · 2" : "1 · 3"}</p></div>}
        </article>
        <article className="rounded-lg border border-amber-200 bg-amber-50 p-6"><h2 className="text-xl font-semibold">{t("Important limits")}</h2><p className="mt-3 leading-7 text-slate-700">{tool.limitation}</p></article>
      </section>

      {tool.workflow === "compress" && <section className="mx-auto max-w-7xl px-5 pb-14"><h2 className="text-2xl font-semibold">{t("Measured compression examples")}</h2><p className="mt-3 max-w-3xl leading-7 text-slate-600">{t("One-page samples measured in Chromium: a short text invoice and a generated 1200 × 1600 RGB gradient embedded as a PNG. Results depend on the document and browser; these are examples, not expected savings.")}</p><div className="mt-5 overflow-x-auto"><table className="w-full border-collapse text-left text-sm"><caption className="sr-only">{t("Measured compression examples")}</caption><thead><tr>{[t("Sample"), t("Compression level"), t("Input → output (bytes)")].map(label=><th key={label} className="border-b border-line p-3">{label}</th>)}</tr></thead><tbody>{[
        ["Text sample", "Strong", 1304, 888], ["Text sample", "Balanced", 1304, 888], ["Text sample", "High quality", 1304, 888],
        ["Generated image sample", "Strong", 1205231, 44502], ["Generated image sample", "Balanced", 1205231, 70809], ["Generated image sample", "High quality", 1205231, 121061],
      ].map(([sample,mode,input,output])=><tr key={`${sample}-${mode}`}><td className="border-b border-line p-3">{t(String(sample))}</td><td className="border-b border-line p-3">{t(String(mode))}</td><td className="border-b border-line p-3 tabular-nums">{Number(input).toLocaleString(locale)} → {Number(output).toLocaleString(locale)}</td></tr>)}</tbody></table></div></section>}

      {relatedTools.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-normal text-brand-700">{t("Related tools")}</p>
                <h2 className="mt-3 text-3xl font-semibold text-ink">{t("Keep working with your PDF")}</h2>
              </div>
              <Link
                href="/all-tools"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink transition hover:bg-slate-50"
              > {t("All Tools")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.slug}
                  href={`/${relatedTool.slug}`}
                  className="rounded-lg border border-line bg-mist p-5 shadow-soft transition hover:-translate-y-0.5 hover:bg-white hover:shadow-panel"
                >
                  <h3 className="font-semibold text-ink">{relatedTool.shortTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{relatedTool.intro}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-normal text-brand-700">{t("FAQ")}</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">{t("Questions about")} {tool.shortTitle.toLowerCase()}</h2>
        </div>
        <div className="mt-8 divide-y divide-line rounded-lg border border-line bg-white shadow-soft">
          {tool.faqs.map((faq) => (
            <details key={faq.question} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink">
                {faq.question}
                <RotateCw className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 pb-10"><LanguageSelector currentLocale={locale} label={t("Language")} /></div>
    </main>
  );
}
