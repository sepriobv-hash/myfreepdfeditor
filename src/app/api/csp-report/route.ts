const MAX_BODY_BYTES = 4 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_REQUESTS = 30;

type RateLimitEntry = { count: number; resetAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __pdfCspRateLimits: Map<string, RateLimitEntry> | undefined;
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (isRateLimited(request)) return new Response(null, { status: 429 });

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return new Response(null, { status: 413 });

  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
      return new Response(null, { status: 413 });
    }

    const parsed = JSON.parse(body) as Record<string, unknown>;
    const report = (parsed["csp-report"] ?? parsed.body ?? parsed) as Record<string, unknown>;
    console.warn("CSP report", {
      directive: sanitizeToken(report["effective-directive"] ?? report.effectiveDirective),
      blockedOrigin: sanitizeBlockedOrigin(report["blocked-uri"] ?? report.blockedURL),
      documentPath: sanitizeDocumentPath(report["document-uri"] ?? report.documentURL),
    });
  } catch {
    return new Response(null, { status: 400 });
  }

  return new Response(null, { status: 204 });
}

function sanitizeToken(value: unknown) {
  return String(value ?? "unknown").replace(/[^a-z0-9-]/gi, "").slice(0, 80) || "unknown";
}

function sanitizeBlockedOrigin(value: unknown) {
  const raw = String(value ?? "").slice(0, 300);
  if (/^(inline|eval|data|blob|self)$/i.test(raw)) return raw.toLowerCase();
  try {
    return new URL(raw).origin.slice(0, 160);
  } catch {
    return "unknown";
  }
}

function sanitizeDocumentPath(value: unknown) {
  try {
    return new URL(String(value ?? "")).pathname.slice(0, 160) || "/";
  } catch {
    return "/";
  }
}

function isRateLimited(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwardedFor || "unknown";
  const now = Date.now();
  globalThis.__pdfCspRateLimits ??= new Map();
  const limits = globalThis.__pdfCspRateLimits;
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
