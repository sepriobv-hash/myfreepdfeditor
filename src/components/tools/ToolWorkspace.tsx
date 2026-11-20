"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { UploadDropzone } from "@/components/editor/UploadDropzone";
import { useLocale, useTranslation } from "@/components/i18n/LocaleProvider";
import { useToast } from "@/components/ui/Toaster";
import { storePendingUpload } from "@/lib/editor/uploadHandoff";
import { getLocalizedPath } from "@/lib/i18n";
import type { PdfTool } from "@/lib/pdfTools";
import { fileSizeBucket, trackUsageEvent } from "@/lib/usage/client";

function WorkspaceLoading() {
  const t = useTranslation();
  return <p className="grid min-h-52 place-items-center px-5 text-sm text-muted" role="status">{t("Loading PDF tool…")}</p>;
}

const MergePdfPanel = dynamic(
  () => import("./MergePdfPanel").then(module => module.MergePdfPanel),
  { ssr: false, loading: WorkspaceLoading },
);
const CompressPdfPanel = dynamic(
  () => import("./CompressPdfPanel").then(module => module.CompressPdfPanel),
  { ssr: false, loading: WorkspaceLoading },
);
const ToolkitPanel = dynamic(
  () => import("./workflows/ToolkitPanel").then(module => module.ToolkitPanel),
  { ssr: false, loading: WorkspaceLoading },
);

export function ToolWorkspace({ slug, workflow, uploadTitle }: Pick<PdfTool, "slug" | "workflow" | "uploadTitle">) {
  const t = useTranslation();
  const locale = useLocale();
  const { notify } = useToast();
  const [isOpening, setIsOpening] = useState(false);
  const busy = useRef(false);

  useEffect(() => {
    trackUsageEvent("landing_view", { page: slug });
  }, [slug]);

  async function openEditor(file: File) {
    if (busy.current) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      notify(t("Please choose a valid PDF file."), "error");
      return;
    }
    busy.current = true;
    setIsOpening(true);
    try {
      const fileSize = fileSizeBucket(file.size);
      trackUsageEvent("upload_started", { source: slug, fileSizeBucket: fileSize });
      const uploadId = await storePendingUpload(file);
      trackUsageEvent("upload_success", { source: slug, fileSizeBucket: fileSize });
      window.location.assign(getLocalizedPath(locale, `/editor?uploadId=${encodeURIComponent(uploadId)}&tool=${slug}`));
    } catch {
      busy.current = false;
      setIsOpening(false);
      trackUsageEvent("upload_failed", { source: slug });
      notify(t("Could not prepare this PDF."), "error");
    }
  }

  return (
    <div className="min-w-0 rounded-xl border border-[#d6cbbd] bg-white p-2.5 shadow-panel sm:p-3">
      {workflow === "merge" ? <MergePdfPanel />
        : workflow === "compress" ? <CompressPdfPanel />
        : workflow && workflow !== "editor" ? <ToolkitPanel workflow={workflow} slug={slug} />
        : (
          <UploadDropzone
            onFile={openEditor}
            isLoading={isOpening}
            onChoose={() => trackUsageEvent("upload_clicked", { source: slug })}
            wide
            copy={{
              title: uploadTitle,
              button: "Choose PDF",
            }}
          />
        )}
    </div>
  );
}
