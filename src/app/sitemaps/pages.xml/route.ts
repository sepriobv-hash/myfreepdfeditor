import { publicRoutes } from "@/lib/routeRegistry";
import { getAbsoluteLocalizedUrl, getLanguageAlternates } from "@/lib/i18n";
const escapeXml = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&apos;");

export function GET() {
 const entries = publicRoutes.filter(route => route.indexable).flatMap(route => route.locales.map(locale => {
  const alternates = Object.entries(getLanguageAlternates(route.path)).map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(href)}" />`).join("\n");
  // No build-time timestamps: dates are omitted until maintained content provenance exists.
  return `  <url>\n    <loc>${escapeXml(getAbsoluteLocalizedUrl(locale, route.path))}</loc>\n${alternates}\n  </url>`;
 }));
 return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
