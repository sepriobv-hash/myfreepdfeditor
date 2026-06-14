import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-mist px-5 py-12">
      <div className="mx-auto max-w-3xl rounded-lg border border-line bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-normal text-brand-600">Privacy</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink">Browser-first PDF editing.</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          MyFreePDFEditor processes uploaded files in local browser memory by default. Files are not
          permanently stored, and the MVP does not require user accounts or server uploads for core
          editing.
        </p>
        <p className="mt-4 text-base leading-7 text-slate-600">
          When you upload from the homepage, the file is placed in temporary browser storage on your
          own device so it can be handed safely to the editor after navigation. The editor consumes
          and removes that pending upload when it opens.
        </p>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Future cloud features should add explicit consent, authentication, encrypted storage,
          retention controls, and audit-ready data handling.
        </p>
        <Link
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md border border-brand-600 bg-brand-600 px-3 text-sm font-medium text-white transition hover:bg-brand-700"
          href="/"
        >
          Back Home
        </Link>
      </div>
    </main>
  );
}
