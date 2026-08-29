"use client";

import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import { Activity, BarChart3, Clock, KeyRound, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { UsageSummary } from "@/types/usage";

const funnelSteps = [
  "landing_view",
  "upload_clicked",
  "upload_success",
  "editor_ready",
  "first_edit",
  "export_started",
  "export_success",
] as const;

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function loadUsage() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/usage", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not load usage data.");
      }
      setSummary(data);
    } catch (caught) {
      setSummary(null);
      setError(caught instanceof Error ? caught.message : "Could not load usage data.");
    } finally {
      setIsLoading(false);
    }
  }

  const topEvents = useMemo(
    () =>
      Object.entries(summary?.countsByEvent ?? {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8),
    [summary],
  );

  return (
    <main className="min-h-screen bg-mist px-5 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-brand-600">
              Admin
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-ink">Usage dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Privacy-minimized product events with a fixed upload-to-export funnel and a 90-day
              maximum retention period.
            </p>
            {summary && (
              <p className="mt-2 text-sm font-medium text-slate-500">
                Storage: {summary.storage === "supabase" ? "Supabase persistent logs" : "runtime memory"}
              </p>
            )}
            {summary?.storageNotice && (
              <p className="mt-2 max-w-2xl rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {summary.storageNotice}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col gap-2 rounded-lg border border-line bg-white p-3 shadow-soft md:w-[420px]">
            <label className="text-xs font-semibold uppercase tracking-normal text-slate-500">
              Admin token
            </label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-10 w-full rounded-md border border-line pl-9 pr-3 text-sm outline-none focus:border-brand-500"
                  type="password"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void loadUsage();
                  }}
                  placeholder="ADMIN_TOKEN"
                />
              </div>
              <Button variant="primary" disabled={!token || isLoading} onClick={() => void loadUsage()}>
                <RefreshCw className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                Load
              </Button>
            </div>
            {error && <div className="text-sm text-rose-700">{error}</div>}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <MetricCard
            icon={Activity}
            label="Total events"
            value={summary?.totalEvents ?? 0}
          />
          <MetricCard
            icon={Users}
            label="Unique sessions"
            value={summary?.uniqueSessions ?? 0}
          />
          <MetricCard
            icon={Clock}
            label="Last event"
            value={summary?.lastEventAt ? new Date(summary.lastEventAt).toLocaleString() : "-"}
          />
        </div>

        <section className="mt-8 rounded-lg border border-line bg-white p-5 shadow-soft">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-brand-600" />
            <div>
              <h2 className="text-lg font-semibold text-ink">Core funnel</h2>
              <p className="text-sm text-slate-500">Event completion relative to landing views.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
            {funnelSteps.map((step, index) => {
              const count = summary?.countsByEvent[step] ?? 0;
              const landingViews = summary?.countsByEvent.landing_view ?? 0;
              const percentage = landingViews ? Math.min(100, Math.round((count / landingViews) * 100)) : 0;
              return (
                <div key={step} className="rounded-md border border-line bg-mist p-3">
                  <div className="text-xs font-semibold text-slate-500">{index + 1}. {step}</div>
                  <div className="mt-2 text-2xl font-semibold text-ink">{count}</div>
                  <div className="mt-1 text-xs text-slate-500">{percentage}% of landings</div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <div className="mb-5 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-ink">Top events</h2>
            </div>
            <div className="space-y-3">
              {topEvents.length ? (
                topEvents.map(([name, count]) => (
                  <div key={name}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{name}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-brand-600"
                        style={{
                          width: `${Math.max(
                            6,
                            (count / Math.max(...topEvents.map(([, value]) => value))) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No events loaded yet.</p>
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
            <div className="border-b border-line p-5">
              <h2 className="text-lg font-semibold text-ink">Recent events</h2>
            </div>
            <div className="max-h-[560px] overflow-auto editor-scrollbar">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-normal text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">Path</th>
                    <th className="px-4 py-3">Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {summary?.recentEvents.length ? (
                    summary.recentEvents.map((event) => (
                      <tr key={event.id}>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                          {new Date(event.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-medium text-ink">{event.name}</td>
                        <td className="px-4 py-3 text-slate-600">{event.path}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {event.metadata ? JSON.stringify(event.metadata) : "{}"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-8 text-center text-slate-500" colSpan={4}>
                        No events loaded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-ink">{value}</div>
    </div>
  );
}
