"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/Button";
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/privacy";

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(getAnalyticsConsent());
    setReady(true);

    function handleConsentChange(event: Event) {
      setConsent((event as CustomEvent<AnalyticsConsent | null>).detail);
    }

    window.addEventListener("analytics-consent-changed", handleConsentChange);
    return () => window.removeEventListener("analytics-consent-changed", handleConsentChange);
  }, []);

  if (!measurementId || !ready) return null;

  return (
    <>
      {consent === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${measurementId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      {consent === null && (
        <aside
          aria-label="Analytics preference"
          className="fixed inset-x-3 bottom-3 z-[110] mx-auto max-w-3xl rounded-lg border border-line bg-white p-4 shadow-panel sm:flex sm:items-center sm:justify-between sm:gap-5"
        >
          <p className="text-sm leading-6 text-slate-700">
            We use optional Google Analytics to understand which pages help users. PDF files and
            document contents are never sent to analytics. <Link className="font-semibold text-brand-700 hover:underline" href="/privacy">Privacy details</Link>
          </p>
          <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
            <Button
              variant="secondary"
              onClick={() => {
                setAnalyticsConsent("denied");
                setConsent("denied");
              }}
            >
              Decline
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setAnalyticsConsent("granted");
                setConsent("granted");
              }}
            >
              Allow analytics
            </Button>
          </div>
        </aside>
      )}
    </>
  );
}
