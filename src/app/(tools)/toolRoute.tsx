import { localizeTool } from "@/lib/localizedTools";
import { getAbsoluteLocalizedUrl, type SupportedLocale } from "@/lib/i18n";
import { translators } from "@/lib/translations";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLandingPage } from "@/components/tools/ToolLandingPage";
import { getToolBySlug, getRelatedTools } from "@/lib/pdfTools";
import { pageMetadata } from "@/lib/pageMetadata";

export function createToolMetadata(slug: string, locale: SupportedLocale = "en"): Metadata { return pageMetadata(`/${slug}`, locale); }

export function ToolRoutePage({ slug, locale = "en" }: { slug: string; locale?: SupportedLocale }) {
  const original = getToolBySlug(slug);
  const tool = original ? localizeTool(original, locale) : undefined;
  if (!tool) notFound();

  const t = translators[locale];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
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
    name: tool.title,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: getAbsoluteLocalizedUrl(locale, `/${tool.slug}`),
    description: tool.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("Home"),
        item: getAbsoluteLocalizedUrl(locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("All PDF tools"),
        item: getAbsoluteLocalizedUrl(locale, "/all-tools"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.shortTitle,
        item: getAbsoluteLocalizedUrl(locale, `/${tool.slug}`),
      },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ToolLandingPage tool={tool} relatedTools={getRelatedTools(tool).map(item => localizeTool(item, locale))} />
    </>
  );
}
