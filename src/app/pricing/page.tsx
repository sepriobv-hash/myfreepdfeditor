import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-mist px-5 py-12">
      <div className="mx-auto max-w-4xl rounded-lg border border-line bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-normal text-brand-600">Pricing</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink">The PDF editor is free.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          MyFreePDFEditor is free during the MVP. Core editing, signing, annotations, page tools, and
          PDF export are not locked behind a paywall in this version.
        </p>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            ["Free editor", "$0", "Upload, edit, sign, annotate, and export PDFs in the browser."],
            ["No account required", "$0", "Start editing without creating a workspace or entering payment details."],
            ["Future Pro", "Later", "Optional cloud storage, OCR, compression, teams, and version history."],
          ].map(([title, price, text]) => (
            <div key={title} className="rounded-lg border border-line bg-slate-50 p-5">
              <div className="text-sm font-semibold text-brand-600">{title}</div>
              <div className="mt-3 text-3xl font-semibold text-ink">{price}</div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm leading-6 text-slate-500">
          We are building around a simple promise: the essential online PDF editor should stay free
          and useful, while optional SaaS features can be added later for people who need cloud
          workflows.
        </p>
        <Link
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md border border-brand-600 bg-brand-600 px-3 text-sm font-medium text-white transition hover:bg-brand-700"
          href="/editor"
        >
          Start Editing Free
        </Link>
      </div>
    </main>
  );
}
