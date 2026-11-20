import type { SupportedLocale } from "@/lib/i18n";
import { translators } from "@/lib/translations";

const corrections: Record<SupportedLocale, [string, string]> = {
  en: ["Invocie", "Invoice"],
  nl: ["Factur", "Factuur"],
  de: ["Rechnug", "Rechnung"],
  fr: ["Factre", "Facture"],
  es: ["Factra", "Factura"],
  it: ["Fattua", "Fattura"],
  "pt-BR": ["Fatuar", "Fatura"],
  id: ["Tagiahn", "Tagihan"],
  tr: ["Fatrua", "Fatura"],
  pl: ["Faktuar", "Faktura"],
  hi: ["इनवॉयस्स", "इनवॉयस"],
};

export function DocumentExample({ slug, locale }: { slug: string; locale: SupportedLocale }) {
  const t = translators[locale];
  if (slug === "edit-pdf-text") {
    return (
      <figure className="site-wrap mt-8 max-w-3xl rounded-lg border border-line bg-white p-5 sm:p-6">
        <figcaption className="font-semibold">{t("Sample correction")}</figcaption>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {corrections[locale].map((text, index) => (
            <div key={text} className="min-w-0 rounded-md border border-line bg-paper p-3">
              <span className="text-xs text-muted">{t(index === 0 ? "Before" : "After")}</span>
              <p className="mt-1 break-words font-mono text-sm">{text} #104</p>
            </div>
          ))}
        </div>
      </figure>
    );
  }
  if (!["extract-pdf-pages", "reorder-pdf-pages", "delete-pdf-pages"].includes(slug)) return null;
  const before = slug === "extract-pdf-pages" ? [1, 2, 3, 4, 5] : [1, 2, 3];
  const after = slug === "extract-pdf-pages" ? [5, 1, 2] : slug === "reorder-pdf-pages" ? [3, 1, 2] : [1, 3];
  return (
    <figure className="site-wrap mt-8 max-w-3xl rounded-lg border border-line bg-white p-5 sm:p-6">
      <figcaption className="font-semibold">{t("Sample page order")}</figcaption>
      <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-3">
        <div>
          <p className="mb-1 text-xs text-muted">{t("Before")}</p>
          <div className="flex gap-1.5">
            {before.map(page => <span key={page} className="grid h-10 w-7 place-items-center rounded-sm border border-line bg-paper font-mono text-sm">{page}</span>)}
          </div>
        </div>
        {slug === "extract-pdf-pages" && <code className="mb-2 text-xs font-semibold text-brand-700">5,1-2 →</code>}
        <div>
          <p className="mb-1 text-xs text-muted">{t("After")}</p>
          <div className="flex gap-1.5">
            {after.map(page => <span key={page} className="grid h-10 w-7 place-items-center rounded-sm border border-brand-100 bg-brand-50 font-mono text-sm text-brand-700">{page}</span>)}
          </div>
        </div>
      </div>
    </figure>
  );
}

const measurements = [
  { file: "Text sample", settings: "Strong", before: 1304, after: 888 },
  { file: "Text sample", settings: "Balanced", before: 1304, after: 888 },
  { file: "Text sample", settings: "High quality", before: 1304, after: 888 },
  { file: "Generated image sample", settings: "Strong", before: 1205231, after: 44502 },
  { file: "Generated image sample", settings: "Balanced", before: 1205231, after: 75116 },
  { file: "Generated image sample", settings: "High quality", before: 1205231, after: 169061 },
] as const;

function readableBytes(bytes: number, locale: SupportedLocale) {
  const unit = bytes >= 1_000_000 ? "MB" : "KB";
  return `${(bytes / (unit === "MB" ? 1_000_000 : 1_000)).toLocaleString(locale, { maximumFractionDigits: 1 })} ${unit}`;
}

export function CompressionExamples({ locale }: { locale: SupportedLocale }) {
  const t = translators[locale];
  return (
    <section className="site-wrap border-b border-line py-8 sm:py-11">
      <h2 className="site-title text-3xl">{t("Measured compression examples")}</h2>
      <p className="mt-3 max-w-[70ch] text-sm leading-6 text-muted">{t("One-page samples measured in Chromium: a short text invoice and a generated 1200 × 1600 RGB gradient embedded as a PNG. Results depend on the document and browser; these are examples, not expected savings.")}</p>
      <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">{t("Measured compression examples")}</caption>
          <thead className="bg-mist">
            <tr>{["Sample", "Compression level", "File size"].map(label => <th key={label} scope="col" className="border-b border-line p-3">{t(label)}</th>)}</tr>
          </thead>
          <tbody>
            {measurements.map(({ file, settings, before, after }) => (
              <tr key={`${file}-${settings}`} className="border-b border-line last:border-b-0">
                <td className="p-3">{t(file)}</td>
                <td className="p-3">{t(settings)}</td>
                <td className="whitespace-nowrap p-3 tabular-nums">{readableBytes(before, locale)} → {readableBytes(after, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a href="/examples/compression-sample.pdf" download className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 hover:underline">
        {t("Download sample PDF")}
      </a>
    </section>
  );
}
