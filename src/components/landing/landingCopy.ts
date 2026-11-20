import type { SupportedLocale } from "@/lib/i18n";
import { extraLocalePacks, type AddedLocale } from "@/lib/extraLocalePacks";

const titles = {
  en: "Free PDF Editor Online",
  nl: "Gratis PDF bewerken en downloaden",
  de: "Kostenloser PDF-Editor online",
  fr: "Éditeur PDF gratuit en ligne",
  es: "Editor PDF gratis online",
  it: "Editor PDF gratis online",
} as const;

const descriptions: Record<SupportedLocale, string> = {
  en: "Edit text, sign documents, and rearrange pages. Download your PDF for free, without an account or watermark.",
  nl: "Pas tekst aan, zet een handtekening of wijzig de volgorde van pagina’s. Download je PDF gratis, zonder account of watermerk.",
  de: "Bearbeite Text, unterschreibe Dokumente und sortiere Seiten. Lade deine PDF kostenlos herunter, ohne Konto oder Wasserzeichen.",
  fr: "Modifiez le texte, signez des documents et réorganisez les pages. Téléchargez votre PDF gratuitement, sans compte ni filigrane.",
  es: "Edita texto, firma documentos y cambia el orden de las páginas. Descarga tu PDF gratis, sin cuenta ni marca de agua.",
  it: "Modifica il testo, firma documenti e riordina le pagine. Scarica il PDF gratis, senza account né filigrana.",
  "pt-BR": "Edite textos, assine documentos e reorganize páginas. Baixe seu PDF grátis, sem cadastro nem marca-d’água.",
  id: "Edit teks, tanda tangani dokumen, dan atur urutan halaman. Unduh PDF gratis tanpa akun atau tanda air.",
  tr: "Metinleri düzenleyin, belgeleri imzalayın ve sayfaları sıralayın. PDF’nizi hesap açmadan ve filigransız, ücretsiz indirin.",
  pl: "Edytuj tekst, podpisuj dokumenty i zmieniaj kolejność stron. Pobierz PDF za darmo, bez konta i znaku wodnego.",
  hi: "टेक्स्ट संपादित करें, दस्तावेज़ पर हस्ताक्षर करें और पेजों का क्रम बदलें। बिना खाते या वॉटरमार्क के PDF मुफ़्त डाउनलोड करें।",
};

export function getLandingCopy(locale: SupportedLocale) {
  return {
    title: locale in titles ? titles[locale as keyof typeof titles] : extraLocalePacks[locale as AddedLocale].hero[1],
    description: descriptions[locale],
  };
}
