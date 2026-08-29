"use client";

import type { ExportErrorCode, UsageEventName } from "@/types/usage";

const SESSION_KEY = "pdf_studio_session_id";
const UPLOAD_STARTED_KEY = "pdf_studio_upload_started_at";

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
    referrer: getReferrerDomain(),
    locale: navigator.language.split("-")[0],
    userAgent: `${getDeviceCategory()}/${getBrowserFamily()}`,
    metadata,
  };

  const body = JSON.stringify(event);

  if (name === "upload_clicked" || name === "upload_started") {
    window.sessionStorage.setItem(UPLOAD_STARTED_KEY, String(Date.now()));
  }

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/usage", blob)) return;
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

export function pageCountBucket(pages: number) {
  if (pages <= 1) return "1";
  if (pages <= 5) return "2_5";
  if (pages <= 20) return "6_20";
  if (pages <= 100) return "21_100";
  return "over_100";
}

export function objectCountBucket(objects: number) {
  if (objects === 0) return "0";
  if (objects <= 3) return "1_3";
  if (objects <= 10) return "4_10";
  return "over_10";
}

export function fileCountBucket(files: number) {
  if (files <= 2) return "2";
  if (files <= 5) return "3_5";
  if (files <= 10) return "6_10";
  return "over_10";
}

export function durationBucket(milliseconds: number) {
  if (milliseconds < 5_000) return "under_5s";
  if (milliseconds < 15_000) return "5s_15s";
  if (milliseconds < 60_000) return "15s_60s";
  if (milliseconds < 300_000) return "1m_5m";
  return "over_5m";
}

export function consumeUploadDurationBucket() {
  const startedAt = Number(window.sessionStorage.getItem(UPLOAD_STARTED_KEY));
  window.sessionStorage.removeItem(UPLOAD_STARTED_KEY);
  return Number.isFinite(startedAt) && startedAt > 0
    ? durationBucket(Date.now() - startedAt)
    : "unknown";
}

export function getExportErrorCode(error: unknown): ExportErrorCode {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (/password|encrypt/.test(message)) return "password_protected";
  if (/invalid|corrupt|xref|parse/.test(message)) return "invalid_pdf";
  if (/font|encoding|unicode|character/.test(message)) return "font_or_encoding";
  if (/memory|allocation|too large|limit/.test(message)) return "resource_limit";
  if (/download|blob/.test(message)) return "download_failed";
  return "unexpected";
}

export function clearUsageSession() {
  window.sessionStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(UPLOAD_STARTED_KEY);
}

function getSessionId() {
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const next = crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_KEY, next);
  return next;
}

function getReferrerDomain() {
  if (!document.referrer) return undefined;
  try {
    return new URL(document.referrer).hostname.slice(0, 120) || undefined;
  } catch {
    return undefined;
  }
}

function getDeviceCategory() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/ipad|tablet/.test(userAgent)) return "tablet";
  if (/mobi|android|iphone/.test(userAgent)) return "mobile";
  return "desktop";
}

function getBrowserFamily() {
  const userAgent = navigator.userAgent;
  if (/Edg\//.test(userAgent)) return "edge";
  if (/Firefox\//.test(userAgent)) return "firefox";
  if (/Chrome\//.test(userAgent)) return "chrome";
  if (/Safari\//.test(userAgent)) return "safari";
  return "other";
}
