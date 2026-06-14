"use client";

import type { UsageEventName } from "@/types/usage";

const SESSION_KEY = "pdf_studio_session_id";

export function trackUsageEvent(
  name: UsageEventName,
  metadata: Record<string, string | number | boolean | null> = {},
) {
  if (typeof window === "undefined") return;

  const event = {
    name,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    path: window.location.pathname,
    referrer: document.referrer || undefined,
    locale: navigator.language,
    userAgent: navigator.userAgent,
    metadata,
  };

  const body = JSON.stringify(event);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/usage", blob);
    return;
  }

  void fetch("/api/usage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export function fileSizeBucket(bytes: number) {
  if (bytes < 1024 * 1024) return "under_1mb";
  if (bytes < 5 * 1024 * 1024) return "1mb_5mb";
  if (bytes < 20 * 1024 * 1024) return "5mb_20mb";
  if (bytes < 60 * 1024 * 1024) return "20mb_60mb";
  return "over_60mb";
}

function getSessionId() {
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const next = crypto.randomUUID();
  window.localStorage.setItem(SESSION_KEY, next);
  return next;
}
