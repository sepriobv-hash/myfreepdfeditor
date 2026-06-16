const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfreepdfeditor.com";

export const siteUrl = configuredSiteUrl.replace(/\/$/, "");

export const siteName = "MyFreePDFEditor";

export const siteDescription =
  "Free PDF editor for editing PDFs online. Upload a PDF, edit text, add signatures, images, highlights, annotations, and export securely from your browser.";
