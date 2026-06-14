import { NextResponse } from "next/server";
import { appendUsageEvent } from "@/lib/usage/serverStore";
import type { UsageEvent, UsageEventName } from "@/types/usage";

const allowedEvents = new Set<UsageEventName>([
  "page_view",
  "upload_started",
  "upload_handoff_created",
  "upload_handoff_failed",
  "upload_consumed",
  "pdf_uploaded",
  "editor_opened",
  "image_added",
  "signature_added",
  "export_started",
  "export_success",
  "export_failed",
]);

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!allowedEvents.has(body.name)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const event: UsageEvent = {
      id: crypto.randomUUID(),
      name: body.name,
      timestamp: typeof body.timestamp === "string" ? body.timestamp : new Date().toISOString(),
      sessionId: String(body.sessionId ?? "unknown").slice(0, 80),
      path: String(body.path ?? "/").slice(0, 200),
      referrer: body.referrer ? String(body.referrer).slice(0, 500) : undefined,
      locale: body.locale ? String(body.locale).slice(0, 40) : undefined,
      userAgent: body.userAgent ? String(body.userAgent).slice(0, 300) : undefined,
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
      .slice(0, 20)
      .map(([key, value]) => {
        if (typeof value === "string") return [key.slice(0, 60), value.slice(0, 200)];
        if (typeof value === "number" || typeof value === "boolean" || value === null) {
          return [key.slice(0, 60), value];
        }
        return [key.slice(0, 60), String(value).slice(0, 200)];
      }),
  );
}
