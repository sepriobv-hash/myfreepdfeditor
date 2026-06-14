import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/landing/LandingPage";
import { landingCopyByLocale } from "@/components/landing/landingCopy";
import { getLandingFaqs } from "@/components/landing/faqData";
import {
  getAbsoluteLocalizedUrl,
  getLanguageAlternates,
  isSupportedLocale,
  supportedLocales,
  type SupportedLocale,
} from "@/lib/i18n";
import { siteName } from "@/lib/site";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

const localizedMetadata: Record<SupportedLocale, { title: string; description: string }> = {
  en: {
    title: "Free PDF Editor Online - Edit PDFs in Your Browser",
    description:
      "Free PDF editor for editing PDFs online. Upload a PDF, edit text, add signatures, images, highlights, annotations, and export securely from your browser.",
  },
  nl: {
    title: "Gratis PDF Editor Online - PDF Bewerken in je Browser",
    description:
      "Gratis online PDF-editor. Upload een PDF, bewerk tekst, voeg handtekeningen, afbeeldingen, markeringen en annotaties toe en exporteer veilig vanuit je browser.",
  },
  de: {
    title: "Kostenloser PDF Editor Online - PDFs im Browser bearbeiten",
    description:
      "Kostenloser Online-PDF-Editor. PDF hochladen, Text bearbeiten, Unterschriften, Bilder, Markierungen und Anmerkungen hinzufuegen und sicher im Browser exportieren.",
  },
  fr: {
    title: "Editeur PDF Gratuit en Ligne - Modifier un PDF dans le Navigateur",
    description:
      "Editeur PDF en ligne gratuit. Importez un PDF, modifiez le texte, ajoutez signatures, images, surlignages et annotations, puis exportez depuis le navigateur.",
  },
  es: {
    title: "Editor PDF Gratis Online - Editar PDF en el Navegador",
    description:
      "Editor PDF online gratis. Sube un PDF, edita texto, agrega firmas, imagenes, resaltados y anotaciones, y exporta de forma segura desde el navegador.",
  },
  it: {
    title: "Editor PDF Gratis Online - Modifica PDF nel Browser",
    description:
      "Editor PDF online gratuito. Carica un PDF, modifica testo, aggiungi firme, immagini, evidenziazioni e annotazioni, poi esporta dal browser.",
  },
};

export function generateStaticParams() {
  return supportedLocales
    .filter((locale) => locale !== "en")
    .map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale) || locale === "en") return {};

  const copy = localizedMetadata[locale];
  const url = getAbsoluteLocalizedUrl(locale);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `/${locale}`,
      languages: getLanguageAlternates(),
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url,
      siteName,
      type: "website",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
    },
  };
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale) || locale === "en") notFound();
  const faqs = getLandingFaqs(locale);

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
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: getAbsoluteLocalizedUrl(locale),
    description: localizedMetadata[locale].description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: landingCopyByLocale[locale].workflow.features.slice(0, 6),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <LandingPage locale={locale} />
    </>
  );
}
