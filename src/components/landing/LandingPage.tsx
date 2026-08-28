"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  CloudOff,
  FileImage,
  FileText,
  Highlighter,
  Layers3,
  LockKeyhole,
  MousePointer2,
  RotateCw,
  ShieldCheck,
  Signature,
  Sparkles,
  Stamp,
  TextCursorInput,
  UploadCloud,
  Wand2,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { UploadDropzone } from "@/components/editor/UploadDropzone";
import { getLandingFaqs } from "@/components/landing/faqData";
import { LanguageSelector } from "@/components/landing/LanguageSelector";
import { landingCopyByLocale } from "@/components/landing/landingCopy";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toaster";
import { storePendingUpload } from "@/lib/editor/uploadHandoff";
import { defaultLocale, type SupportedLocale } from "@/lib/i18n";
import { fileSizeBucket, trackUsageEvent } from "@/lib/usage/client";

const toolCards = [
  {
    title: "Edit PDF text",
    text: "Click detected text, replace it visually, tune font size, color, spacing, and export cleanly for free.",
    icon: TextCursorInput,
    tone: "bg-rose-50 text-rose-700 border-rose-100",
  },
  {
    title: "Add images",
    text: "Insert PNG, JPG, and WebP images, then move, resize, rotate, and layer them on any page.",
    icon: FileImage,
    tone: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    title: "Sign documents",
    text: "Draw a signature or upload one, place it precisely, and keep it editable until export.",
    icon: Signature,
    tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    title: "Highlight and annotate",
    text: "Add highlights, shapes, lines, and freehand notes for review workflows.",
    icon: Highlighter,
    tone: "bg-teal-50 text-teal-700 border-teal-100",
  },
  {
    title: "Manage pages",
    text: "Preview pages, reorder, duplicate, and delete pages before downloading the final file.",
    icon: Layers3,
    tone: "bg-violet-50 text-violet-700 border-violet-100",
  },
  {
    title: "Export securely",
    text: "Download a real edited PDF while preserving the original page content.",
    icon: LockKeyhole,
    tone: "bg-slate-100 text-slate-800 border-slate-200",
  },
];

const stepIcons = [UploadCloud, MousePointer2, FileText];

const trustItems = [
  { label: "No account needed to start", icon: CloudOff },
  { label: "No permanent storage by default", icon: ShieldCheck },
  { label: "Temporary local upload handoff", icon: Clock },
  { label: "Clear before future cloud saving", icon: Sparkles },
];

type LandingPageProps = {
  locale?: SupportedLocale;
};

export function LandingPage({ locale = defaultLocale }: LandingPageProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const { notify } = useToast();
  const copy = landingCopyByLocale[locale];
  const faqs = getLandingFaqs(locale);
  const localizedToolCards = toolCards.map((tool, index) => ({
    ...tool,
    ...copy.tools.cards[index],
  }));

  useEffect(() => {
    trackUsageEvent("page_view", { page: "home", locale });
  }, [locale]);

  async function handleUpload(file: File) {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      notify("Please choose a valid PDF file.", "error");
      return;
    }

    try {
      setIsUploading(true);
      trackUsageEvent("upload_started", {
        source: "homepage",
        fileSizeBucket: fileSizeBucket(file.size),
      });
      const uploadId = await storePendingUpload(file);
      trackUsageEvent("upload_handoff_created", {
        source: "homepage",
        fileSizeBucket: fileSizeBucket(file.size),
      });
      notify("PDF uploaded. Opening editor...", "success");
      window.location.assign(`/editor?uploadId=${encodeURIComponent(uploadId)}`);
    } catch (error) {
      setIsUploading(false);
      trackUsageEvent("upload_handoff_failed", { source: "homepage" });
      notify(error instanceof Error ? error.message : "Could not prepare this PDF.", "error");
    }
  }

  return (
    <main className="min-h-screen bg-mist text-ink">
      <nav className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button className="flex items-center gap-3" onClick={() => router.push("/")}>
            <BrandLogo />
          </button>
          <div className="hidden items-center gap-1 lg:flex">
            <a className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-ink" href="#tools">
              {copy.nav.tools}
            </a>
            <Link className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-ink" href="/all-tools">
              {copy.nav.allTools}
            </Link>
            <Link className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-ink" href="/about">
              {copy.nav.about}
            </Link>
            <a className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-ink" href="#security">
              {copy.nav.security}
            </a>
            <a className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-ink" href="#faq">
              {copy.nav.faq}
            </a>
          </div>
          <Button variant="primary" onClick={() => window.location.assign("/editor")}>
            {copy.nav.cta}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-5 pb-14 pt-12 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-rose-100 bg-white px-3 py-2 text-sm font-medium text-rose-700 shadow-sm">
            <BadgeCheck className="h-4 w-4 text-rose-600" />
            {copy.hero.badge}
          </div>
          <h1 className="text-5xl font-semibold leading-tight tracking-normal text-ink md:text-6xl">
            {copy.hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {copy.hero.description}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2 text-sm font-medium">
            {copy.hero.badges.map((label, index) => (
                <span
                  key={label}
                  className={
                    index === 0
                      ? "rounded-md bg-rose-50 px-3 py-2 text-rose-700"
                      : index === 1
                        ? "rounded-md bg-amber-50 px-3 py-2 text-amber-700"
                        : index === 2
                          ? "rounded-md bg-teal-50 px-3 py-2 text-teal-700"
                          : "rounded-md bg-emerald-50 px-3 py-2 text-emerald-700"
                  }
                >
                  {label}
                </span>
              ))}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-xl border border-rose-100 bg-white p-2 shadow-panel">
          <UploadDropzone onFile={handleUpload} isLoading={isUploading} wide copy={copy.upload} />
          <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <TrustPill icon={ShieldCheck} label={copy.hero.trust[0]} />
            <TrustPill icon={Wand2} label={copy.hero.trust[1]} />
            <TrustPill icon={Clock} label={copy.hero.trust[2]} />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-7 md:grid-cols-4">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={copy.trustItems[index]} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <div
                  className={
                    item.label.includes("Browser")
                      ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-600"
                      : item.label.includes("No permanent")
                        ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-600"
                        : item.label.includes("Vercel")
                          ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600"
                          : "flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600"
                  }
                >
                  <Icon className="h-4 w-4" />
                </div>
                {copy.trustItems[index]}
              </div>
            );
          })}
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-brand-600">{copy.tools.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
              {copy.tools.title}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600">
            {copy.tools.description}
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {localizedToolCards.map((tool) => {
            const Icon = tool.icon;
            return (
              <article
                key={tool.title}
                className="rounded-lg border border-line bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-panel"
              >
                <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-md border ${tool.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-ink">{tool.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{tool.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-brand-600">{copy.workflow.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
              {copy.workflow.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {copy.workflow.description}
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {copy.workflow.features.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="h-4 w-4 shrink-0 text-accent-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-mist p-4 shadow-soft">
              <div className="rounded-md border border-line bg-white shadow-soft">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-500" />
                </div>
                <span className="text-xs font-medium text-slate-500">{copy.workflow.previewLabel}</span>
              </div>
              <div className="grid min-h-96 grid-cols-[84px_1fr]">
                <div className="border-r border-line bg-rose-50/40 p-3">
                  {[1, 2, 3].map((page) => (
                    <div
                      key={page}
                      className="mb-3 h-20 rounded-sm border border-line bg-white p-2 shadow-sm"
                    >
                      <div className="mb-2 h-2 w-10 rounded bg-slate-200" />
                      <div className="h-2 w-8 rounded bg-slate-100" />
                    </div>
                  ))}
                </div>
                <div className="p-5">
                  <div className="mb-4 flex gap-2">
                    {[TextCursorInput, FileImage, Signature, Highlighter, Stamp].map((Icon, index) => (
                      <div
                        key={index}
                        className={
                          index === 0
                            ? "flex h-9 w-9 items-center justify-center rounded-md border border-rose-100 bg-rose-50 text-rose-700"
                            : index === 1
                              ? "flex h-9 w-9 items-center justify-center rounded-md border border-amber-100 bg-amber-50 text-amber-700"
                              : index === 2
                                ? "flex h-9 w-9 items-center justify-center rounded-md border border-emerald-100 bg-emerald-50 text-emerald-700"
                                : index === 3
                                  ? "flex h-9 w-9 items-center justify-center rounded-md border border-teal-100 bg-teal-50 text-teal-700"
                                  : "flex h-9 w-9 items-center justify-center rounded-md border border-violet-100 bg-violet-50 text-violet-700"
                        }
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                  <div className="mx-auto h-72 max-w-sm rounded-sm border border-line bg-white p-8 shadow-soft">
                    <div className="h-5 w-44 rounded bg-slate-800" />
                    <div className="mt-5 space-y-2">
                      <div className="h-2.5 rounded bg-slate-200" />
                      <div className="h-2.5 rounded bg-slate-200" />
                      <div className="h-2.5 w-4/5 rounded bg-slate-200" />
                    </div>
                    <div className="mt-8 rounded-md border border-rose-300 bg-rose-50 p-3">
                      <div className="h-3 w-36 rounded bg-brand-600" />
                      <div className="mt-2 h-2 w-48 rounded bg-rose-200" />
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      <div className="h-12 w-28 rounded-sm border-2 border-dashed border-teal-500 bg-teal-50" />
                      <Signature className="h-10 w-10 text-amber-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {copy.steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <article key={step.title} className="rounded-lg border border-line bg-white p-6 shadow-soft">
                <div className="mb-5 flex items-center justify-between">
                  <div
                    className={
                      index === 0
                        ? "flex h-11 w-11 items-center justify-center rounded-md bg-rose-600 text-white"
                        : index === 1
                          ? "flex h-11 w-11 items-center justify-center rounded-md bg-teal-600 text-white"
                          : "flex h-11 w-11 items-center justify-center rounded-md bg-amber-500 text-white"
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-400">0{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="security" className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-brand-600">{copy.security.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              {copy.security.title}
            </h2>
            {copy.security.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-base leading-7 text-slate-600">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {copy.security.cards.map(({ title, text }, index) => (
              <div
                key={title}
                className={
                  index === 0
                    ? "rounded-lg border border-rose-100 bg-rose-50 p-5"
                    : index === 1
                      ? "rounded-lg border border-teal-100 bg-teal-50 p-5"
                      : index === 2
                        ? "rounded-lg border border-amber-100 bg-amber-50 p-5"
                        : "rounded-lg border border-emerald-100 bg-emerald-50 p-5"
                }
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-white text-ink shadow-sm">
                  <LockKeyhole className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-5 pb-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-normal text-brand-600">{copy.faq.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
            {copy.faq.title}
          </h2>
        </div>
        <div className="mt-8 divide-y divide-line rounded-lg border border-line bg-white shadow-soft">
          {faqs.map((faq) => (
            <details key={faq.question} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink">
                {faq.question}
                <RotateCw className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-semibold">{copy.cta.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              {copy.cta.description}
            </p>
          </div>
          <Button variant="primary" className="h-12 px-5" onClick={() => window.location.assign("/editor")}>
            {copy.cta.button}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8">
          <LanguageSelector currentLocale={locale} label={copy.footer.language} />
          <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <BrandLogo compact />
              <div>
                <div className="text-xs text-slate-500">{copy.footer.tagline}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <Link href="/editor" className="hover:text-ink">{copy.footer.editor}</Link>
              <Link href="/all-tools" className="hover:text-ink">{copy.footer.allTools}</Link>
              <Link href="/about" className="hover:text-ink">{copy.footer.about}</Link>
              <Link href="/security" className="hover:text-ink">{copy.footer.security}</Link>
              <Link href="/privacy" className="hover:text-ink">{copy.footer.privacy}</Link>
              <a href="#faq" className="hover:text-ink">{copy.footer.faq}</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function TrustPill({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-3 shadow-sm">
      <Icon className="h-4 w-4 text-accent-600" />
      <span className="font-medium">{label}</span>
    </div>
  );
}
