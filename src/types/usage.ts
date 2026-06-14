export type UsageEventName =
  | "page_view"
  | "upload_started"
  | "upload_handoff_created"
  | "upload_handoff_failed"
  | "upload_consumed"
  | "pdf_uploaded"
  | "editor_opened"
  | "image_added"
  | "signature_added"
  | "export_started"
  | "export_success"
  | "export_failed";

export type UsageEvent = {
  id: string;
  name: UsageEventName;
  timestamp: string;
  sessionId: string;
  path: string;
  referrer?: string;
  locale?: string;
  userAgent?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type UsageSummary = {
  totalEvents: number;
  uniqueSessions: number;
  lastEventAt: string | null;
  countsByEvent: Record<string, number>;
  recentEvents: UsageEvent[];
  storage: "memory" | "supabase";
  storageNotice?: string;
};
