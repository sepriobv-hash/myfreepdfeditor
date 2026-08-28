import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About MyFreePDFEditor",
  description:
    "Learn about MyFreePDFEditor, a free browser-based PDF editor focused on no signup, no watermark, and private PDF editing.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `About ${siteName}`,
    description: siteDescription,
    url: `${siteUrl}/about`,
    siteName,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-mist text-ink">
      <section className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <Link className="text-sm font-semibold text-brand-600 hover:text-brand-700" href="/">
          MyFreePDFEditor
        </Link>
        <div className="mt-8 rounded-lg border border-line bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-normal text-brand-600">About</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink md:text-5xl">
            A free, private PDF editor for everyday document fixes
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            MyFreePDFEditor is built for the moment when you need to fix a PDF quickly: change text,
            add a signature, place an image, highlight a section, draw a note, remove a page, or
            export a clean copy without creating an account.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Core PDF editing stays free",
              "No signup before you can start",
              "No watermark on exported PDFs",
              "Browser-first file handling",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md bg-mist p-4 text-sm font-medium text-slate-700">
                <Check className="h-4 w-4 text-accent-600" />
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 text-base leading-7 text-slate-600">
            The long-term goal is to become a useful PDF toolkit, not a paywall trap. Optional
            accounts, cloud workflows, batch processing, and advanced tools can be added later for
            people who want them, while the core editor remains easy to use.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/editor"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-brand-600 bg-brand-600 px-3 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Open free editor
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/all-tools"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink transition hover:bg-slate-50"
            >
              View all tools
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
