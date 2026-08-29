"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { clearPendingUploads } from "@/lib/editor/uploadHandoff";
import { clearAnalyticsConsent } from "@/lib/privacy";
import { clearUsageSession } from "@/lib/usage/client";

export function PrivacyControls() {
  const [status, setStatus] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  async function clearLocalData() {
    try {
      setIsClearing(true);
      clearUsageSession();
      clearAnalyticsConsent();
      await clearPendingUploads();
      setStatus("Temporary PDF data, analytics preference, and this tab's usage session were cleared.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Local data could not be cleared.");
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <div className="mt-5 border-t border-line pt-5">
      <Button variant="secondary" disabled={isClearing} onClick={() => void clearLocalData()}>
        <Trash2 className="h-4 w-4" />
        {isClearing ? "Clearing..." : "Clear local app data"}
      </Button>
      {status && <p className="mt-3 text-sm leading-6 text-slate-600" role="status">{status}</p>}
    </div>
  );
}
