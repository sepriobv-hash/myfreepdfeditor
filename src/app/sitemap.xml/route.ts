import { siteUrl } from "@/lib/site";

const sitemapPaths = ["/sitemaps/pages.xml"];
const sitemapLastModified = "2026-06-16";

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

export function GET() {
  const sitemaps = sitemapPaths
    .map(
      (path) => `  <sitemap>
    <loc>${escapeXml(`${siteUrl}${path}`)}</loc>
    <lastmod>${sitemapLastModified}</lastmod>
  </sitemap>`,
    )
    .join("\n");

  return xmlResponse(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>
`);
}
