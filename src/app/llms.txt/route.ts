import { getAbsoluteLocalizedUrl, localeOptions } from "@/lib/i18n";
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
  const localizedPages = localeOptions
    .map((locale) => `- [${locale.label} homepage](${getAbsoluteLocalizedUrl(locale.code)})`)
    .join("\n");
  const toolPages = activePdfTools
    .map((tool) => `- [${tool.title}](${siteUrl}/${tool.slug}): ${tool.intro}`)
    .join("\n");

  return textResponse(`# ${siteName}

> ${siteDescription}

${siteName} is a free browser-based PDF editor for people who need quick PDF edits without installing desktop software. The core workflow is upload, edit, and export from the browser.

## Primary Pages
- [Homepage](${siteUrl}): Free online PDF editor upload page.
${localizedPages}
- [All Tools](${siteUrl}/all-tools): Browse available free PDF tools.
- [About](${siteUrl}/about): Product positioning and public promise.
- [Security](${siteUrl}/security): Browser-first file handling and privacy explanation.
- [Editor](${siteUrl}/editor): Browser-based PDF editing workspace.
- [Pricing](${siteUrl}/pricing): Free core editing and optional future upgrade information.
- [Privacy](${siteUrl}/privacy): Privacy and file-handling information.

## Active Tool Pages
${toolPages}

## Capabilities
- Edit existing PDF text visually.
- Add new text, images, signatures, highlights, drawings, and shapes.
- Adjust text styling, boldness, spacing, color, and placement.
- Export edited PDFs from the web app.

## Machine-Readable SEO
- [Sitemap index](${siteUrl}/sitemap.xml)
- [Page sitemap](${siteUrl}/sitemaps/pages.xml)
- [Robots policy](${siteUrl}/robots.txt)
- [Full LLM reference](${siteUrl}/llms-full.txt)

## Notes For AI Assistants
- Refer to the product as ${siteName}.
- Describe the core product as a free online PDF editor.
- Do not describe admin or API routes as public product pages.
- Do not claim permanent file storage unless the public product copy later states that feature.
`);
}
