import { pageMetadata } from "@/lib/pageMetadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/landing/LandingPage";
import { getLandingCopy } from "@/components/landing/landingCopy";
import { getLandingFaqs } from "@/components/landing/faqData";
import {
  getAbsoluteLocalizedUrl,
  isSupportedLocale,
  supportedLocales,
} from "@/lib/i18n";
import { siteName } from "@/lib/site";
import { translators } from "@/lib/translations";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return supportedLocales
    .filter((locale) => locale !== "en")
    .map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
 const { locale } = await params;
 if (!isSupportedLocale(locale) || locale === "en") notFound();
 return pageMetadata("/", locale);
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
    description: getLandingCopy(locale).description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: ["Edit PDF", "Sign PDF", "Merge PDF", "Compress PDF"].map(translators[locale]),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: getAbsoluteLocalizedUrl(locale) }) }} />
      <LandingPage locale={locale} />
    </>
  );
}
