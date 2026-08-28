import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { getLandingFaqs } from "@/components/landing/faqData";
import { getLanguageAlternates } from "@/lib/i18n";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: getLanguageAlternates(),
  },
};

export default function HomePage() {
  const faqs = getLandingFaqs("en");
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
    url: siteUrl,
    description: siteDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Free online PDF editor",
      "Edit PDF text",
      "Add signatures to PDF",
      "Annotate and highlight PDFs",
      "No signup required",
      "No watermark on exported PDFs",
      "Export edited PDF files",
    ],
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
      <LandingPage locale="en" />
    </>
  );
}
