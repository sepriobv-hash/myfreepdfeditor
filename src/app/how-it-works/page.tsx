import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Download,
  FileInput,
  HardDrive,
  LockKeyhole,
  MonitorCog,
  ServerOff,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "How Browser-Based PDF Editing Works",
  description:
    "See how MyFreePDFEditor reads, edits, merges, compresses, and exports PDFs locally in your browser without sending document contents to a processing server.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    title: `How ${siteName} Edits PDFs in Your Browser`,
    description:
      "A clear technical explanation of local PDF processing, temporary browser storage, and browser-generated exports.",
    url: `${siteUrl}/how-it-works`,
    siteName,
    type: "article",
  },
};

const faqs = [
  {
    question: "Does MyFreePDFEditor upload my PDF to a server?",
    answer:
      "No. The active editor, merge, and compression workflows process the selected PDF contents in your browser. The document is not sent to a document-processing server.",
  },
  {
    question: "Why is temporary browser storage used?",
    answer:
      "The homepage and editor are separate pages. Temporary IndexedDB storage lets the browser carry the selected file across that navigation, after which the editor consumes and removes the pending record.",
  },
  {
    question: "Where is the edited PDF created?",
    answer:
      "The export is generated in browser memory. The browser then creates a local download for the new PDF file.",
  },
  {
    question: "Does browser processing mean no data leaves my device at all?",
    answer:
      "PDF contents stay local in the active tools. Like most websites, the app can send ordinary usage events such as page views and tool success or failure, but those events do not include the document contents.",
  },
];

export default function HowItWorksPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "How MyFreePDFEditor edits PDFs without uploading them",
    description:
      "A technical explanation of browser-local PDF processing in MyFreePDFEditor.",
    author: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/how-it-works`,
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-mist text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" aria-label="MyFreePDFEditor home">
            <BrandLogo />
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link className="hover:text-ink" href="/all-tools">All Tools</Link>
            <Link className="hover:text-ink" href="/security">Security</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-5 py-14 text-center md:py-20">
        <div className="mx-auto inline-flex items-center gap-2 rounded-md border border-teal-100 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700">
          <ServerOff className="h-4 w-4" />
          Browser-local document processing
        </div>
        <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
          How MyFreePDFEditor edits PDFs without uploading them
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          The document work happens on your device. The browser reads the PDF, applies your changes,
          and generates the download without sending the document contents to a processing server.
        </p>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:py-16">
          <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
            <FlowStep icon={FileInput} number="01" title="Select locally" text="Your browser opens the PDF you choose from your device." tone="rose" />
            <ArrowRight className="mx-auto hidden h-5 w-5 text-slate-300 md:block" />
            <FlowStep icon={MonitorCog} number="02" title="Process in browser" text="PDF.js, pdf-lib, canvas, and the editor operate in browser memory." tone="teal" />
            <ArrowRight className="mx-auto hidden h-5 w-5 text-slate-300 md:block" />
            <FlowStep icon={Download} number="03" title="Download the result" text="A new PDF is generated as a local browser download." tone="amber" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-brand-600">What happens to the file</p>
          <h2 className="mt-3 text-3xl font-semibold">A short-lived local workflow</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Uploading from the homepage stores a pending copy in your browser&apos;s IndexedDB so it
            survives the move to the editor page. The editor reads that record and removes it from
            the pending-upload store. Active work then stays in browser memory until you leave or
            reload the editor.
          </p>
          <Link className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700" href="/privacy">
            Read the privacy details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: HardDrive, title: "Temporary browser storage", text: "Used only to hand a homepage selection to the editor on the same device." },
            { icon: MonitorCog, title: "In-memory editing", text: "Page rendering and visual edits happen within the active browser session." },
            { icon: LockKeyhole, title: "No document account", text: "The core tools do not require an account or cloud workspace for file processing." },
            { icon: Download, title: "New local output", text: "The original file is not overwritten. You choose where the exported copy is saved." },
          ].map((item, index) => {
            const Icon = item.icon;
            const tones = ["bg-rose-50 text-rose-700", "bg-teal-50 text-teal-700", "bg-amber-50 text-amber-700", "bg-emerald-50 text-emerald-700"];
            return (
              <article key={item.title} className="border-t border-line pt-5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-md ${tones[index]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-rose-300">What leaves the browser</p>
            <h2 className="mt-3 text-3xl font-semibold">Usage signals, not document contents</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Basic product analytics can record events such as a page view, a started tool, or a
              successful export. The PDF bytes, extracted text, file contents, signatures, and
              annotations are not included in those events.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["PDF bytes stay local", "Extracted text stays local", "Signatures stay local", "Exports are browser-generated"].map((item) => (
              <div key={item} className="flex items-center gap-3 border-b border-slate-700 py-4 text-sm font-medium text-slate-100">
                <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-normal text-brand-600">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold">Questions about local PDF processing</h2>
        </div>
        <div className="mt-8 divide-y divide-line border-y border-line bg-white">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold">
                {faq.question}
                <span className="text-xl font-normal text-slate-400 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Try a browser-local PDF tool</h2>
            <p className="mt-2 text-sm text-slate-600">Free, no signup, and no watermark.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ToolLink href="/edit-pdf" label="Edit PDF" />
            <ToolLink href="/merge-pdf" label="Merge PDF" />
            <ToolLink href="/compress-pdf" label="Compress PDF" />
          </div>
        </div>
      </section>
    </main>
  );
}

function FlowStep({ icon: Icon, number, title, text, tone }: { icon: typeof FileInput; number: string; title: string; text: string; tone: "rose" | "teal" | "amber" }) {
  const toneClass = tone === "rose" ? "bg-rose-50 text-rose-700" : tone === "teal" ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700";
  return (
    <article className="text-center">
      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-md ${toneClass}`}><Icon className="h-6 w-6" /></div>
      <div className="mt-4 text-xs font-semibold text-slate-400">{number}</div>
      <h2 className="mt-2 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}

function ToolLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-ink hover:bg-slate-50">
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
