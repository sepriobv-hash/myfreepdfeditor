import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toaster";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free PDF Editor Online - Edit PDFs in Your Browser",
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "free PDF editor",
    "free PDF editor online",
    "edit PDF online",
    "PDF editor",
    "online PDF editor",
    "add text to PDF",
    "sign PDF",
    "annotate PDF",
  ],
  openGraph: {
    title: "Free PDF Editor Online - MyFreePDFEditor",
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    images: [
      {
        url: "/brand/myfreepdfeditor-logo.png",
        width: 2048,
        height: 512,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Editor Online - MyFreePDFEditor",
    description: siteDescription,
    images: ["/brand/myfreepdfeditor-logo.png"],
  },
  icons: {
    icon: "/brand/favicon.png",
    apple: "/brand/favicon.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
