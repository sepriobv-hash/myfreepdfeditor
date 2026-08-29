import type { UsageEvent, UsageSummary } from "@/types/usage";

const MAX_EVENTS = 2000;
const DEFAULT_SUPABASE_TABLE = "usage_events";
const RETENTION_DAYS = 90;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

type UsageGlobal = {
  events: UsageEvent[];
  lastCleanupAt?: number;
};

type SupabaseUsageRow = {
  id: string;
  name: string;
  occurred_at: string;
  session_id: string;
  path: string;
  referrer?: string | null;
  locale?: string | null;
  user_agent?: string | null;
  metadata?: unknown;
};

declare global {
  // eslint-disable-next-line no-var
  var __pdfStudioUsage: UsageGlobal | undefined;
}

function getUsageGlobal() {
  globalThis.__pdfStudioUsage ??= { events: [] };
  return globalThis.__pdfStudioUsage;
}

export async function appendUsageEvent(event: UsageEvent) {
  const store = getUsageGlobal();
  pruneExpiredMemoryEvents(store);
  store.events.unshift(event);
  if (store.events.length > MAX_EVENTS) {
    store.events.length = MAX_EVENTS;
  }

  if (hasSupabaseConfig()) {
    await purgeExpiredSupabaseEvents(store).catch(() => undefined);
    await appendSupabaseUsageEvent(event).catch((error) => {
      console.error("Could not persist usage event.", error);
    });
  }
}

export async function getUsageSummary(): Promise<UsageSummary> {
  const memoryStore = getUsageGlobal();
  pruneExpiredMemoryEvents(memoryStore);
  if (hasSupabaseConfig()) {
    try {
      return summarizeUsageEvents(await readSupabaseUsageEvents(), "supabase");
    } catch (error) {
      console.error("Could not read persisted usage events.", error);
      return {
        ...summarizeUsageEvents(memoryStore.events, "memory"),
        storageNotice: "Supabase is configured, but the dashboard could not read it. Showing runtime fallback data.",
      };
    }
  }

  return summarizeUsageEvents(memoryStore.events, "memory");
}

function summarizeUsageEvents(events: UsageEvent[], storage: UsageSummary["storage"]): UsageSummary {
  const countsByEvent = events.reduce<Record<string, number>>((counts, event) => {
    counts[event.name] = (counts[event.name] ?? 0) + 1;
    return counts;
  }, {});

  return {
    totalEvents: events.length,
    uniqueSessions: new Set(events.map((event) => event.sessionId)).size,
    lastEventAt: events[0]?.timestamp ?? null,
    countsByEvent,
    recentEvents: events.slice(0, 200),
    storage,
  };
}

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseEndpoint() {
  const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const table = process.env.SUPABASE_USAGE_EVENTS_TABLE ?? DEFAULT_SUPABASE_TABLE;
  if (!baseUrl) throw new Error("SUPABASE_URL is missing.");
  return `${baseUrl}/rest/v1/${table}`;
}

function getSupabaseHeaders() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing.");
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };
}

async function appendSupabaseUsageEvent(event: UsageEvent) {
  const response = await fetch(getSupabaseEndpoint(), {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(),
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      id: event.id,
      name: event.name,
      occurred_at: event.timestamp,
      session_id: event.sessionId,
      path: event.path,
      referrer: event.referrer ?? null,
      locale: event.locale ?? null,
      user_agent: event.userAgent ?? null,
      metadata: event.metadata ?? {},
    }),
  });

  if (!response.ok) {
    throw new Error(`Supabase write failed with ${response.status}.`);
  }
}

async function readSupabaseUsageEvents() {
  const url = new URL(getSupabaseEndpoint());
  url.searchParams.set(
    "select",
    "id,name,occurred_at,session_id,path,referrer,locale,user_agent,metadata",
  );
  url.searchParams.set("order", "occurred_at.desc");
  url.searchParams.set("limit", String(MAX_EVENTS));
  url.searchParams.set("occurred_at", `gte.${new Date(Date.now() - RETENTION_MS).toISOString()}`);

  const response = await fetch(url, {
    headers: {
      ...getSupabaseHeaders(),
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase read failed with ${response.status}.`);
  }

  const rows = (await response.json()) as SupabaseUsageRow[];
  return rows.map(mapSupabaseRowToEvent);
}

function pruneExpiredMemoryEvents(store: UsageGlobal) {
  const cutoff = Date.now() - RETENTION_MS;
  store.events = store.events.filter((event) => Date.parse(event.timestamp) >= cutoff);
}

async function purgeExpiredSupabaseEvents(store: UsageGlobal) {
  const now = Date.now();
  if (store.lastCleanupAt && now - store.lastCleanupAt < 24 * 60 * 60 * 1000) return;
  store.lastCleanupAt = now;
  const url = new URL(getSupabaseEndpoint());
  url.searchParams.set("occurred_at", `lt.${new Date(now - RETENTION_MS).toISOString()}`);
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      ...getSupabaseHeaders(),
      Prefer: "return=minimal",
    },
  });
  if (!response.ok) throw new Error(`Supabase retention cleanup failed with ${response.status}.`);
}

function mapSupabaseRowToEvent(row: SupabaseUsageRow): UsageEvent {
  return {
    id: row.id,
    name: row.name as UsageEvent["name"],
    timestamp: row.occurred_at,
    sessionId: row.session_id,
    path: row.path,
    referrer: row.referrer ?? undefined,
    locale: row.locale ?? undefined,
    userAgent: row.user_agent ?? undefined,
    metadata: sanitizePersistedMetadata(row.metadata),
  };
}

function sanitizePersistedMetadata(metadata: unknown): UsageEvent["metadata"] {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return {};

  return Object.fromEntries(
    Object.entries(metadata as Record<string, unknown>).map(([key, value]) => {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null) {
        return [key, value];
      }
      return [key, String(value)];
    }),
  );
}
