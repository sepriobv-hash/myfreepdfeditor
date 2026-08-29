import { getAbsoluteLocalizedUrl, getLanguageAlternates, localeOptions } from "@/lib/i18n";
import { activePdfTools } from "@/lib/pdfTools";
import { siteUrl } from "@/lib/site";

type SitemapEntry = {
  url: string;
  changeFrequency: "weekly" | "monthly";
  priority: string;
  lastModified: string;
  alternates?: Record<string, string>;
};

const lastContentUpdate = "2026-08-28";

function xmlResponse(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function renderAlternateLinks(alternates?: Record<string, string>) {
  if (!alternates) return "";

  return Object.entries(alternates)
    .map(
      ([hreflang, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />`,
    )
    .join("\n");
}

function renderUrl(entry: SitemapEntry) {
  const alternateLinks = renderAlternateLinks(entry.alternates);

  return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastModified}</lastmod>${alternateLinks ? `\n${alternateLinks}` : ""}
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
}

export function GET() {
  const homeAlternates = getLanguageAlternates();
  const entries: SitemapEntry[] = [
    ...localeOptions.map((locale) => ({
      url: getAbsoluteLocalizedUrl(locale.code),
      changeFrequency: "weekly" as const,
      priority: locale.code === "en" ? "1.0" : "0.9",
      lastModified: lastContentUpdate,
      alternates: homeAlternates,
    })),
    {
      url: `${siteUrl}/all-tools`,
      changeFrequency: "weekly",
      priority: "0.9",
      lastModified: lastContentUpdate,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: "0.6",
      lastModified: lastContentUpdate,
    },
    {
      url: `${siteUrl}/security`,
      changeFrequency: "monthly",
      priority: "0.7",
      lastModified: lastContentUpdate,
    },
    {
      url: `${siteUrl}/how-it-works`,
      changeFrequency: "monthly",
      priority: "0.75",
      lastModified: lastContentUpdate,
    },
    ...activePdfTools.map((tool) => ({
      url: `${siteUrl}/${tool.slug}`,
      changeFrequency: "weekly" as const,
      priority: tool.priority,
      lastModified: lastContentUpdate,
    })),
    {
      url: `${siteUrl}/privacy`,
      changeFrequency: "monthly",
      priority: "0.5",
      lastModified: lastContentUpdate,
    },
  ];

  return xmlResponse(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map((entry) => renderUrl(entry)).join("\n")}
</urlset>
`);
}
