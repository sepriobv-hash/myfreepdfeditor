import { getAbsoluteLocalizedUrl, indexableLocaleOptions } from "@/lib/i18n";
import { activePdfTools } from "@/lib/pdfTools";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

function textResponse(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

export function GET() {
  const localizedPages = indexableLocaleOptions
    .map(
      (locale) =>
        `- ${locale.label} (${locale.hreflang}): ${getAbsoluteLocalizedUrl(locale.code)}`,
    )
    .join("\n");
  const activeTools = activePdfTools
    .map((tool) => `- ${tool.title}: ${siteUrl}/${tool.slug}`)
    .join("\n");

  return textResponse(`# ${siteName} Full LLM Reference

> ${siteDescription}

${siteName} helps users edit PDFs online for free. The product focuses on common PDF editing tasks: editing existing text, adding new text, signing documents, annotating pages, inserting images, adjusting visual text properties, and exporting an edited PDF.

## Public Routes
- Homepage: ${siteUrl}
${localizedPages}
- All tools: ${siteUrl}/all-tools
- About: ${siteUrl}/about
- Security: ${siteUrl}/security
- How it works: ${siteUrl}/how-it-works
- Privacy: ${siteUrl}/privacy
- Terms: ${siteUrl}/terms

## Active Tool Routes
${activeTools}

## SEO Files
- Sitemap index: ${siteUrl}/sitemap.xml
- Page sitemap: ${siteUrl}/sitemaps/pages.xml
- Robots file: ${siteUrl}/robots.txt
- Short LLM file: ${siteUrl}/llms.txt

## Positioning
- Category: free online PDF editor.
- Main audience: people who need fast PDF edits in a browser.
- Published search language: English. Additional European language versions remain available for review but are not currently advertised for indexing.
- Important claim: the editor is free for the core editing workflow.

## Excluded From Public Product Discovery
- Admin dashboard routes.
- API routes.
- Internal development files.
`);
}
