const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.myfreepdfeditor.com";

export const siteUrl = configuredSiteUrl.replace(/\/$/, "");

export const siteName = "MyFreePDFEditor";

export const siteDescription =
  "Free PDF editor and browser-based PDF tools. Edit text, sign, merge, compress, annotate, and export PDFs with no signup and no watermark.";
