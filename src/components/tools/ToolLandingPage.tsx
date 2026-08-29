"use client";

import Link from "next/link";
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
import { type PdfTool, getRelatedTools } from "@/lib/pdfTools";
import { fileSizeBucket, trackUsageEvent } from "@/lib/usage/client";

const MergePdfPanel = dynamic(
  () => import("@/components/tools/MergePdfPanel").then((module) => module.MergePdfPanel),
  { ssr: false },
);
const CompressPdfPanel = dynamic(
  () => import("@/components/tools/CompressPdfPanel").then((module) => module.CompressPdfPanel),
  { ssr: false },
);

type ToolLandingPageProps = {
  tool: PdfTool;
};

export function ToolLandingPage({ tool }: ToolLandingPageProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { notify } = useToast();
  const relatedTools = getRelatedTools(tool);

  useEffect(() => {
    trackUsageEvent("landing_view", { page: tool.slug });
  }, [tool.slug]);

  async function handleUpload(file: File) {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      notify("Please choose a valid PDF file.", "error");
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
      notify("PDF uploaded. Opening editor...", "success");
      window.location.assign(`/editor?uploadId=${encodeURIComponent(uploadId)}&tool=${tool.slug}`);
    } catch (error) {
      setIsUploading(false);
      trackUsageEvent("upload_failed", { source: tool.slug });
      notify(error instanceof Error ? error.message : "Could not prepare this PDF.", "error");
    }
  }

  return (
    <main className="min-h-screen bg-mist text-ink">
      <nav className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link className="text-sm font-semibold text-ink" href="/">
            MyFreePDFEditor
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link className="hover:text-ink" href="/all-tools">
              All Tools
            </Link>
            <Link className="hover:text-ink" href="/security">
              Security
            </Link>
            <Link className="hover:text-ink" href="/privacy">
              Privacy
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-rose-100 bg-white px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Free PDF tool
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-ink md:text-5xl">
              {tool.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{tool.intro}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm font-medium">
              {["Free", "No signup", "No watermark", "Files stay on your device"].map((label, index) => (
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
                  button: "Choose PDF",
                  privacy: "Browser-first editing. No account required.",
                }}
              />
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-7 md:grid-cols-4">
          {[
            ["No account required", ShieldCheck],
            ["Free core editing", Check],
            ["No watermark on export", FileText],
            ["Browser-first workflow", LockKeyhole],
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
          <p className="text-sm font-semibold uppercase tracking-normal text-brand-600">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Use the tool in three steps</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {tool.workflow === "merge"
              ? "Choose multiple PDFs, set their order, and combine every page into one downloadable document without leaving this page."
              : tool.workflow === "compress"
                ? "Choose a quality level and let the browser compare lossless optimization with a smaller image-based copy before downloading the best result."
                : "This page opens the full editor workspace, focused on the task you searched for. You get the complete editor instead of a limited upload form."}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {tool.steps.map((step, index) => (
            <article key={step} className="rounded-lg border border-line bg-white p-5 shadow-soft">
              <div className="mb-4 text-sm font-semibold text-brand-600">0{index + 1}</div>
              <p className="text-sm leading-6 text-slate-700">{step}</p>
            </article>
          ))}
        </div>
      </section>

      {relatedTools.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-normal text-brand-600">Related tools</p>
                <h2 className="mt-3 text-3xl font-semibold text-ink">Keep working with your PDF</h2>
              </div>
              <Link
                href="/all-tools"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink transition hover:bg-slate-50"
              >
                All Tools
                <ArrowRight className="h-4 w-4" />
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
          <p className="text-sm font-semibold uppercase tracking-normal text-brand-600">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Questions about {tool.shortTitle.toLowerCase()}</h2>
        </div>
        <div className="mt-8 divide-y divide-line rounded-lg border border-line bg-white shadow-soft">
          {tool.faqs.map((faq) => (
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
    </main>
  );
}
