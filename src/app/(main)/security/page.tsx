import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Security and File Privacy",
  description:
    "How MyFreePDFEditor handles PDFs in the browser, avoids account requirements for core editing, and keeps file handling understandable.",
  alternates: {
    canonical: "/security",
  },
  openGraph: {
    title: `Security and File Privacy - ${siteName}`,
    description: "Understand how browser-first PDF editing works in MyFreePDFEditor.",
    url: `${siteUrl}/security`,
    siteName,
    type: "website",
  },
};

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-mist text-ink">
      <section className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <Link className="text-sm font-semibold text-brand-600 hover:text-brand-700" href="/">
          MyFreePDFEditor
        </Link>
        <div className="mt-8 rounded-lg border border-line bg-white p-8 shadow-soft">
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-teal-100 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700">
            <ShieldCheck className="h-4 w-4" />
            Browser-first file handling
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Edit PDFs without handing over the whole document
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            PDF tools often ask you to upload private documents, create an account, and trust a
            cloud workflow you cannot see. MyFreePDFEditor is designed around a simpler model for
            everyday edits: open the file in your browser, make the change, and download the result.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              {
                title: "No account before editing",
                text: "You can start the core PDF editor without creating a workspace or entering payment details.",
              },
              {
                title: "Temporary local handoff",
                text: "When you upload from the homepage, the file is placed in temporary browser storage on your device so the editor can open it after navigation.",
              },
              {
                title: "No permanent storage by default",
                text: "The core workflow is not designed around permanent cloud storage of your uploaded PDFs.",
              },
              {
                title: "You control the final file",
                text: "Export creates a new PDF download, so you decide where the edited document goes next.",
              },
            ].map((item) => (
              <article key={item.title} className="rounded-lg border border-line bg-mist p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-white text-brand-600 shadow-sm">
                  <LockKeyhole className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-ink">What this means in practice</h2>
            <div className="mt-5 space-y-3">
              {[
                "You can use the editor for quick corrections without signing up.",
                "Your original local file is not overwritten by the web app.",
                "Future cloud features should be opt-in and clearly explained before use.",
                "Admin and API routes are blocked from public crawler discovery.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-accent-600" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/editor"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-brand-600 bg-brand-600 px-3 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Open free editor
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/privacy"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink transition hover:bg-slate-50"
            >
              Read privacy details
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink transition hover:bg-slate-50"
            >
              See how local processing works
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
