import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLandingPage } from "@/components/tools/ToolLandingPage";
import { getToolBySlug } from "@/lib/pdfTools";
import { siteName, siteUrl } from "@/lib/site";

export function createToolMetadata(slug: string): Metadata {
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.description,
    alternates: {
      canonical: `/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.title} - ${siteName}`,
      description: tool.description,
      url: `${siteUrl}/${tool.slug}`,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} - ${siteName}`,
      description: tool.description,
    },
  };
}

export function ToolRoutePage({ slug }: { slug: string }) {
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

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
    url: `${siteUrl}/${tool.slug}`,
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
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All PDF Tools",
        item: `${siteUrl}/all-tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.shortTitle,
        item: `${siteUrl}/${tool.slug}`,
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
      <ToolLandingPage tool={tool} />
    </>
  );
}
