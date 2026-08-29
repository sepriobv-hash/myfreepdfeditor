import { NextResponse } from "next/server";
import { appendUsageEvent } from "@/lib/usage/serverStore";
import type { UsageEvent, UsageEventName } from "@/types/usage";

const allowedEvents = new Set<UsageEventName>([
  "landing_view",
  "upload_clicked",
  "upload_success",
  "upload_failed",
  "editor_ready",
  "first_edit",
  "upload_started",
  "image_added",
  "signature_added",
  "export_started",
  "export_success",
  "export_failed",
]);

const MAX_BODY_BYTES = 4 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_REQUESTS = 60;
const metadataKeys = new Set([
  "page",
  "source",
  "locale",
  "fileSizeBucket",
  "pageCountBucket",
  "objectCountBucket",
  "durationBucket",
  "errorCode",
  "compressionLevel",
  "flattened",
  "fileCountBucket",
  "outputSizeBucket",
]);

type RateLimitEntry = { count: number; resetAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __pdfUsageRateLimits: Map<string, RateLimitEntry> | undefined;
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (isRateLimited(request)) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }
    const declaredLength = Number(request.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false }, { status: 413 });
    }
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false }, { status: 413 });
    }
    const body = JSON.parse(rawBody);
    if (!allowedEvents.has(body.name)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const event: UsageEvent = {
      id: crypto.randomUUID(),
      name: body.name,
      timestamp: new Date().toISOString(),
      sessionId: sanitizeSessionId(body.sessionId),
      path: sanitizePath(body.path),
      referrer: sanitizeDomain(body.referrer),
      locale: sanitizeLocale(body.locale),
      userAgent: sanitizeClientCategory(body.userAgent),
      metadata: sanitizeMetadata(body.metadata),
    };

    await appendUsageEvent(event);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

function sanitizeMetadata(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return {};

  return Object.fromEntries(
    Object.entries(metadata as Record<string, unknown>)
      .filter(([key]) => metadataKeys.has(key))
      .slice(0, 12)
      .map(([key, value]) => {
        if (typeof value === "string") return [key.slice(0, 60), value.slice(0, 200)];
        if (typeof value === "number" || typeof value === "boolean" || value === null) {
          return [key.slice(0, 60), value];
        }
        return [key.slice(0, 60), String(value).slice(0, 200)];
      }),
  );
}

function sanitizeSessionId(value: unknown) {
  const sessionId = String(value ?? "");
  return /^[0-9a-f-]{20,80}$/i.test(sessionId) ? sessionId : "unknown";
}

function sanitizePath(value: unknown) {
  const path = String(value ?? "/").split(/[?#]/)[0];
  return path.startsWith("/") ? path.slice(0, 160) : "/";
}

function sanitizeDomain(value: unknown) {
  const domain = String(value ?? "").toLowerCase();
  return /^[a-z0-9.-]{1,120}$/.test(domain) ? domain : undefined;
}

function sanitizeLocale(value: unknown) {
  const locale = String(value ?? "").toLowerCase();
  return /^[a-z]{2,3}$/.test(locale) ? locale : undefined;
}

function sanitizeClientCategory(value: unknown) {
  const category = String(value ?? "").toLowerCase();
  return /^(desktop|tablet|mobile)\/(chrome|edge|firefox|safari|other)$/.test(category)
    ? category
    : "other/other";
}

function isRateLimited(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwardedFor || "unknown";
  const now = Date.now();
  globalThis.__pdfUsageRateLimits ??= new Map();
  const limits = globalThis.__pdfUsageRateLimits;
  if (limits.size > 5_000) {
    for (const [entryKey, entry] of limits) {
      if (entry.resetAt <= now) limits.delete(entryKey);
    }
  }
  const existing = limits.get(key);
  if (!existing || existing.resetAt <= now) {
    limits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  existing.count += 1;
  return existing.count > RATE_LIMIT_REQUESTS;
}
