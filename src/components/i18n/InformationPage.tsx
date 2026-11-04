import Link from "./LocaleLink";
import { LanguageSelector } from "@/components/landing/LanguageSelector";
import { PrivacyControls } from "@/components/privacy/PrivacyControls";
import { translators } from "@/lib/translations";
import type { SupportedLocale } from "@/lib/i18n";

import { informationPages } from "@/lib/informationContent";
export { informationPages } from "@/lib/informationContent";
export function InformationPage({ page, locale }: { page: string; locale: SupportedLocale }) {
 const t = translators[locale], content = informationPages[page];
 return <main className="min-h-screen bg-mist px-5 py-12 text-ink"><article className="mx-auto max-w-3xl rounded-lg border border-line bg-white p-7 shadow-soft md:p-10">
  <nav className="flex flex-wrap gap-5 text-sm font-semibold text-brand-700"><Link href="/">MyFreePDFEditor</Link><Link href="/all-tools">{t("All Tools")}</Link></nav>
  <h1 className="mt-8 text-4xl font-semibold">{t(content.title)}</h1><p className="mt-4 text-lg leading-8 text-slate-600">{t(content.intro)}</p>
  <div className="mt-10 space-y-8">{content.sections.map(([title, ...paragraphs]) => <section key={title}><h2 className="text-xl font-semibold">{t(title)}</h2>{paragraphs.map(text => <p key={text} className="mt-3 text-base leading-7 text-slate-600">{t(text)}</p>)}</section>)}</div>
  {page === "privacy" && <section className="mt-10 rounded-lg bg-mist p-5"><h2 className="text-lg font-semibold">{t("Data on this device")}</h2><p className="mt-2 text-sm leading-6">{t("Clearing local data removes pending PDF uploads, this tab’s anonymous session and your analytics choice. It does not delete downloaded files.")}</p><PrivacyControls /></section>}
  <nav className="my-8 flex flex-wrap gap-4 text-sm font-semibold text-brand-700"><Link href="/editor">{t("Open free editor")}</Link><Link href="/privacy">{t("Privacy policy")}</Link><Link href="/terms">{t("Terms of use")}</Link><Link href="/">{t("Back home")}</Link></nav>
  <LanguageSelector currentLocale={locale} label={t("Language")} />
 </article></main>;
}
