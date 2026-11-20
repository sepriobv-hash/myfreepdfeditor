"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, FileText } from "lucide-react";
import { useTranslation } from "@/components/i18n/LocaleProvider";
import { UploadDropzone } from "@/components/editor/UploadDropzone";
import { useToast } from "@/components/ui/Toaster";
import { storePendingUpload } from "@/lib/editor/uploadHandoff";
import { getLocalizedPath, type SupportedLocale } from "@/lib/i18n";
import { fetchSamplePdf, getSampleLabels } from "@/lib/samplePdf";
import { fileSizeBucket, trackUsageEvent } from "@/lib/usage/client";

export function LandingUpload({ locale }: { locale: SupportedLocale }) {
  const t = useTranslation();
  const { notify } = useToast();
  const [isOpening, setIsOpening] = useState(false);
  const busy = useRef(false);
  const [sampleLabel, sampleError] = getSampleLabels(locale);

  useEffect(() => {
    trackUsageEvent("landing_view", { page: "home", locale });
  }, [locale]);

  async function openPdf(choice: File | "sample") {
    if (busy.current) return;
    if (choice !== "sample" && choice.type !== "application/pdf" && !choice.name.toLowerCase().endsWith(".pdf")) {
      notify(t("Please choose a valid PDF file."), "error");
      return;
    }

    busy.current = true;
    setIsOpening(true);
    try {
      const file = choice === "sample" ? await fetchSamplePdf() : choice;
      const source = choice === "sample" ? "sample" : "homepage";
      const fileSize = fileSizeBucket(file.size);
      trackUsageEvent("upload_started", { source, fileSizeBucket: fileSize });
      const uploadId = await storePendingUpload(file);
      trackUsageEvent("upload_success", { source, fileSizeBucket: fileSize });
      window.location.assign(getLocalizedPath(locale, `/editor?uploadId=${encodeURIComponent(uploadId)}`));
    } catch {
      busy.current = false;
      setIsOpening(false);
      trackUsageEvent("upload_failed", { source: choice === "sample" ? "sample" : "homepage" });
      notify(choice === "sample" ? sampleError : t("Could not prepare this PDF."), "error");
    }
  }

  return (
    <div className="rounded-xl border border-[#d6cbbd] bg-[#efe9df] p-2.5 shadow-panel sm:p-3">
      <UploadDropzone
        onFile={openPdf}
        isLoading={isOpening}
        onChoose={() => trackUsageEvent("upload_clicked", { source: "homepage", locale })}
        wide
        illustrated
        copy={{ title: "Drop your PDF here", button: "Choose PDF" }}
      />
      <div className="flex justify-center py-1.5">
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm px-1.5 text-sm font-medium text-ink hover:text-brand-700 hover:underline disabled:opacity-50"
          onClick={() => void openPdf("sample")}
          disabled={isOpening}
        >
          <FileText aria-hidden="true" size={16} />
          {sampleLabel}
          <ArrowUpRight aria-hidden="true" size={14} className="shrink-0 text-muted" />
        </button>
      </div>
    </div>
  );
}
