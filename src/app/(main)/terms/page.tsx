import type { Metadata } from "next";
import Link from "next/link";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the free MyFreePDFEditor browser-based PDF tools.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: `Terms of Use - ${siteName}`,
    description: "Terms for using MyFreePDFEditor.",
    url: `${siteUrl}/terms`,
    siteName,
    type: "website",
  },
};

const terms = [
  ["Using the service", "You may use MyFreePDFEditor to process documents you own or are authorized to edit. Do not use the service to violate law, intellectual property rights, privacy rights, or security controls."],
  ["Your files", "You retain ownership of your files and edits. Core PDF processing occurs in your browser. You are responsible for keeping suitable backups and checking the exported document before relying on it."],
  ["Free service and availability", "The current core tools are provided without charge, signup, or export watermark. Features, limits, and availability may change as the service develops, but any paid or cloud feature will be identified before use."],
  ["No professional advice", "The service is a document editing utility. It does not provide legal, financial, medical, or other professional advice, and it does not validate the meaning or enforceability of edited documents."],
  ["Warranty and liability", "The service is provided as available without guarantees that every PDF, font, browser, or workflow will work perfectly. To the extent permitted by law, the operator is not liable for indirect losses, lost data, or decisions made from an unchecked export."],
  ["Changes and contact", "These terms may be updated as the product changes. Material updates will be reflected on this page. Questions can be sent to support@myfreepdfeditor.com. Last updated August 29, 2026."],
] as const;

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-mist px-5 py-12 text-ink">
      <article className="mx-auto max-w-3xl rounded-lg border border-line bg-white p-7 shadow-soft md:p-10">
        <Link className="text-sm font-semibold text-brand-700 hover:underline" href="/">MyFreePDFEditor</Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-normal text-brand-600">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold">Terms of use</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">Plain-language terms for the free browser-based PDF tools.</p>
        <div className="mt-10 space-y-8">
          {terms.map(([title, text]) => (
            <section key={title}>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{text}</p>
            </section>
          ))}
        </div>
        <div className="mt-8 flex gap-4 text-sm font-semibold">
          <Link className="text-brand-700 hover:underline" href="/privacy">Privacy policy</Link>
          <Link className="text-brand-700 hover:underline" href="/">Back home</Link>
        </div>
      </article>
    </main>
  );
}
