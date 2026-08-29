import type { Metadata } from "next";
import Link from "next/link";
import { PrivacyControls } from "@/components/privacy/PrivacyControls";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy and PDF File Handling",
  description:
    "Learn how MyFreePDFEditor processes PDF files locally, what limited usage data is collected, and how to clear local app data.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `Privacy Policy and PDF File Handling - ${siteName}`,
    description: "How MyFreePDFEditor handles PDF files, product analytics, and retention.",
    url: `${siteUrl}/privacy`,
    siteName,
    type: "website",
  },
};

const sections = [
  {
    title: "PDF files and document content",
    paragraphs: [
      "PDF editing, merging, compression, and export are performed in your browser. Your PDF files and their contents are not uploaded to our usage analytics endpoint.",
      "A PDF selected on the homepage is temporarily stored in IndexedDB on your device so the editor can open it after navigation. The editor removes that pending copy after it is consumed. Unused pending uploads are automatically removed after one hour when the upload store is next used.",
    ],
  },
  {
    title: "Product usage data",
    paragraphs: [
      "To understand reliability and improve the product, we record a random per-tab session identifier, event time, page path, referring domain, language, coarse device and browser category, and broad buckets such as file size, page count, object count, file count, and task duration.",
      "We do not record PDF names, document text, form values, precise edit contents, full URLs, exact file sizes, exact page counts, IP addresses in the event record, or full browser user-agent strings. Hosting providers may process request metadata such as IP addresses in their normal security logs.",
    ],
  },
  {
    title: "Analytics and legal basis",
    paragraphs: [
      "Essential, privacy-minimized product events are processed for our legitimate interest in operating, securing, and improving the service. Vercel Web Analytics may also provide privacy-focused aggregate traffic measurements.",
      "Google Analytics is optional and loads only after you choose Allow analytics. That choice is stored in your browser. You can withdraw it by clearing local app data below and then declining the next prompt.",
    ],
  },
  {
    title: "Retention and service providers",
    paragraphs: [
      "Product usage events are kept for up to 90 days. In-memory runtime data may disappear sooner. If persistent analytics storage is configured, Supabase processes those events for us. Vercel hosts the website and may provide aggregate web analytics. Google processes analytics only after consent and only when a measurement ID is configured.",
      "We do not sell personal data. Data is disclosed only to service providers needed to operate the product, to comply with law, or to protect the service and its users.",
    ],
  },
  {
    title: "Your choices and rights",
    paragraphs: [
      "Depending on where you live, you may have rights to access, correct, delete, restrict, or object to processing, and to lodge a complaint with your data protection authority. Because the editor has no accounts, include enough context for us to locate any relevant server-side event data.",
      "For privacy questions or requests, email privacy@myfreepdfeditor.com. MyFreePDFEditor is operated by the website operator identified through that address. This policy was last updated on August 29, 2026.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-mist px-5 py-12 text-ink">
      <article className="mx-auto max-w-3xl rounded-lg border border-line bg-white p-7 shadow-soft md:p-10">
        <Link className="text-sm font-semibold text-brand-700 hover:underline" href="/">MyFreePDFEditor</Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-normal text-brand-600">Privacy policy</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">Your PDF stays on your device.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          This policy explains the difference between local PDF processing and the limited product
          analytics used to keep the service reliable.
        </p>

        <div className="mt-10 space-y-9">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-base leading-7 text-slate-600">{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-lg border border-line bg-mist p-5">
          <h2 className="text-lg font-semibold">Data on this device</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This removes pending local PDF uploads, the current tab&apos;s anonymous usage session, and
            your optional analytics choice. It does not delete files already downloaded to your device.
          </p>
          <PrivacyControls />
        </section>

        <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
          <Link className="text-brand-700 hover:underline" href="/terms">Terms of use</Link>
          <a className="text-brand-700 hover:underline" href="mailto:privacy@myfreepdfeditor.com">Contact privacy</a>
          <Link className="text-brand-700 hover:underline" href="/">Back home</Link>
        </div>
      </article>
    </main>
  );
}
