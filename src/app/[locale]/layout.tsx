import { dictionaries } from "@/lib/translations";
import { notFound } from "next/navigation";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
import { ToastProvider } from "@/components/ui/Toaster";
import { isSupportedLocale } from "@/lib/i18n";
import { rootMetadata } from "@/lib/rootMetadata";
import "../globals.css";

export const metadata = rootMetadata;

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale) || locale === "en") notFound();
  const documentLanguage = locale;

  return (
    <html lang={documentLanguage}>
      <body>
        <LocaleProvider locale={documentLanguage} messages={dictionaries[documentLanguage]}>
        <GoogleAnalytics />
        <ToastProvider>{children}</ToastProvider>
        <Analytics />
        <SpeedInsights />
        </LocaleProvider>
      </body>
    </html>
  );
}
