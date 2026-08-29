export type UsageEventName =
  | "landing_view"
  | "upload_clicked"
  | "upload_success"
  | "upload_failed"
  | "editor_ready"
  | "first_edit"
  | "upload_started"
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

export type ExportErrorCode =
  | "password_protected"
  | "invalid_pdf"
  | "font_or_encoding"
  | "resource_limit"
  | "download_failed"
  | "unexpected";
