import type { Metadata } from "next";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free PDF Editor Online - Edit PDFs in Your Browser",
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    title: "Free PDF Editor Online - MyFreePDFEditor",
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    images: [
      {
        url: "/brand/og-free-pdf-editor.jpg",
        width: 1200,
        height: 630,
        alt: "MyFreePDFEditor free online PDF editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Editor Online - MyFreePDFEditor",
    description: siteDescription,
    images: ["/brand/og-free-pdf-editor.jpg"],
  },
  icons: {
    icon: [
      { url: "/brand/favicon.ico", sizes: "16x16 32x32" },
      { url: "/brand/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/brand/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};
