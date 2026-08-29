import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
import { ToastProvider } from "@/components/ui/Toaster";
import { rootMetadata } from "@/lib/rootMetadata";
import "../globals.css";

export const metadata = rootMetadata;

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        <ToastProvider>{children}</ToastProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
