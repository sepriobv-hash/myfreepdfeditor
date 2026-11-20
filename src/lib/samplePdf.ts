import type { SupportedLocale } from "@/lib/i18n";

const sampleLabels: Record<SupportedLocale, readonly [button: string, error: string]> = {
  en: ["Try a sample PDF", "The sample PDF could not be opened."],
  nl: ["Probeer een voorbeeld-PDF", "De voorbeeld-PDF kon niet worden geopend."],
  de: ["Beispiel-PDF ausprobieren", "Die Beispiel-PDF konnte nicht geöffnet werden."],
  fr: ["Essayer avec un PDF d’exemple", "Impossible d’ouvrir le PDF d’exemple."],
  es: ["Probar con un PDF de ejemplo", "No se pudo abrir el PDF de ejemplo."],
  it: ["Prova con un PDF di esempio", "Impossibile aprire il PDF di esempio."],
  "pt-BR": ["Testar com um PDF de exemplo", "Não foi possível abrir o PDF de exemplo."],
  id: ["Coba dengan PDF contoh", "PDF contoh tidak dapat dibuka."],
  tr: ["Örnek PDF ile dene", "Örnek PDF açılamadı."],
  pl: ["Wypróbuj przykładowy PDF", "Nie udało się otworzyć przykładowego PDF-a."],
  hi: ["नमूना PDF आज़माएँ", "नमूना PDF नहीं खुल सकी।"],
};

export function getSampleLabels(locale: SupportedLocale) {
  return sampleLabels[locale];
}

export async function fetchSamplePdf() {
  const response = await fetch("/examples/editing-sample.pdf");
  if (!response.ok) throw new Error("Sample PDF unavailable");
  return new File([await response.blob()], "editing-sample.pdf", { type: "application/pdf" });
}
