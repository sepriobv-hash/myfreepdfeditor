"use client";
import { useLocale, useTranslation } from "@/components/i18n/LocaleProvider";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { SiteHeader } from "@/components/brand/SiteHeader";
import { PageSidebar } from "@/components/editor/PageSidebar";
import { PDFCanvas } from "@/components/editor/PDFCanvas";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { SignatureModal } from "@/components/editor/SignatureModal";
import { TopToolbar } from "@/components/editor/TopToolbar";
import { UploadDropzone } from "@/components/editor/UploadDropzone";
import { useToast } from "@/components/ui/Toaster";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { imageFileToEditorData } from "@/lib/editor/fileUtils";
import { createImageObject } from "@/lib/editor/objectUtils";
import { clearUploadParameters, consumePendingUpload } from "@/lib/editor/uploadHandoff";
import { exportEditedPdf } from "@/lib/pdf/exportPdf";
import { fetchSamplePdf, getSampleLabels } from "@/lib/samplePdf";
import {
  consumeUploadDurationBucket,
  durationBucket,
  fileSizeBucket,
  getExportErrorCode,
  objectCountBucket,
  pageCountBucket,
  trackUsageEvent,
} from "@/lib/usage/client";
import { downloadBlob } from "@/lib/utils";
import { useEditorStore } from "@/store/editorStore";
import type { EditorTool, PageState } from "@/types/editor";

const landingTools: Partial<Record<string, EditorTool>> = {
  "add-text-to-pdf": "text",
  "highlight-pdf": "highlight",
  "draw-on-pdf": "draw",
  "add-shapes-to-pdf": "rectangle",
};

export function EditorLayout() {
  const t = useTranslation();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const uploadId = searchParams.get("uploadId");
  const requestedToolSlug = searchParams.get("tool") ?? "";
  const [signatureOpen, setSignatureOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [fitToWidth, setFitToWidth] = useState(true);
  const [isSampleLoading, setIsSampleLoading] = useState(false);
  const [sampleLabel, sampleError] = getSampleLabels(locale);
  const pendingUpload = useRef<{ id: string; file: Promise<File | null> } | null>(null);
  const canvasViewport = useRef<HTMLElement>(null);
  const trackedDocumentIdRef = useRef<string | null>(null);
  const initialEditSignatureRef = useRef<string | null>(null);
  const firstEditTrackedRef = useRef(false);
  const editorReadyAtRef = useRef<number | null>(null);
  const document = useEditorStore((state) => state.document);
  const pdfDoc = useEditorStore((state) => state.pdfDoc);
  const pages = useEditorStore((state) => state.pages);
  const activePageId = useEditorStore((state) => state.activePageId);
  const setActivePage = useEditorStore((state) => state.setActivePage);
  const zoom = useEditorStore((state) => state.zoom);
  const setZoom = useEditorStore((state) => state.setZoom);
  const isLoading = useEditorStore((state) => state.isLoading);
  const loadPdf = useEditorStore((state) => state.loadPdf);
  const addObject = useEditorStore((state) => state.addObject);
  const setIsExporting = useEditorStore((state) => state.setIsExporting);
  const { notify } = useToast();

  useEffect(() => {
    if (!uploadId) return;
    if (pendingUpload.current?.id !== uploadId) {
      pendingUpload.current = { id: uploadId, file: consumePendingUpload(uploadId) };
    }

    let active = true;
    void pendingUpload.current.file
      .then(async (file) => {
        if (!active) return;
        if (!file) {
          notify(t("The uploaded PDF could not be found. Please upload it again."), "error");
          return;
        }
        if (!(await loadPdf(file)) || !active) return;
        const requestedTool = landingTools[requestedToolSlug];
        if (requestedTool) useEditorStore.getState().setTool(requestedTool);
        trackUsageEvent("upload_success", {
          source: requestedToolSlug || "homepage",
          fileSizeBucket: fileSizeBucket(file.size),
        });
      })
      .catch(() => {
        if (active) notify(t("Could not load this PDF."), "error");
      })
      .finally(() => {
        if (active) clearUploadParameters(uploadId, true);
      });

    return () => { active = false; };
  }, [loadPdf, notify, requestedToolSlug, t, uploadId]);

  useEffect(() => {
    if (!document) return;
    const documentKey = `${document.fileName}:${document.pageCount}:${document.originalBytes.byteLength}`;
    if (trackedDocumentIdRef.current === documentKey) return;
    trackedDocumentIdRef.current = documentKey;
    const editSignature = getEditSignature(pages);
    initialEditSignatureRef.current = editSignature;
    firstEditTrackedRef.current = false;
    editorReadyAtRef.current = Date.now();
    trackUsageEvent("editor_ready", {
      pageCountBucket: pageCountBucket(pages.length),
      fileSizeBucket: fileSizeBucket(document.originalBytes.byteLength),
      durationBucket: consumeUploadDurationBucket(),
    });
  }, [document, pages]);

  useEffect(() => {
    if (!document || firstEditTrackedRef.current || !initialEditSignatureRef.current) return;
    if (getEditSignature(pages) === initialEditSignatureRef.current) return;
    firstEditTrackedRef.current = true;
    trackUsageEvent("first_edit", {
      pageCountBucket: pageCountBucket(pages.length),
      durationBucket: editorReadyAtRef.current
        ? durationBucket(Date.now() - editorReadyAtRef.current)
        : "unknown",
    });
  }, [document, pages]);

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) ?? pages[0],
    [activePageId, pages],
  );
  const pageWidth = activePage?.width;
  const pageIndex = pages.findIndex(page => page.id === activePage?.id);

  const fitPageWidth = useCallback(() => {
    const viewport = canvasViewport.current;
    if (!viewport || !pageWidth) return;
    const { paddingLeft, paddingRight } = window.getComputedStyle(viewport);
    const available = viewport.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
    setZoom(Math.min(1, Math.floor(available / pageWidth * 100) / 100));
  }, [pageWidth, setZoom]);

  useEffect(() => {
    setFitToWidth(true);
  }, [document]);

  useEffect(() => {
    const viewport = canvasViewport.current;
    if (!viewport || !fitToWidth) return;
    fitPageWidth();
    const observer = new ResizeObserver(fitPageWidth);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [fitPageWidth, fitToWidth]);

  useEffect(() => {
    canvasViewport.current?.scrollTo(0, 0);
  }, [activePageId]);

  function zoomManually(nextZoom: number) {
    setFitToWidth(false);
    setZoom(nextZoom);
  }

  const handleExport = useCallback(async () => {
    if (!document || !pages.length) {
      notify(t("Upload a PDF before exporting."), "error");
      return;
    }
    try {
      setIsExporting(true);
      const objectCount = pages.reduce((total, page) => total + page.objects.length, 0);
      trackUsageEvent("export_started", {
        pageCountBucket: pageCountBucket(pages.length),
        objectCountBucket: objectCountBucket(objectCount),
      });
      const result = await exportEditedPdf({
        originalBytes: document.originalBytes,
        pages,
        fileName: document.fileName,
      });
      downloadBlob(result.blob, result.fileName);
      trackUsageEvent("export_success", {
        pageCountBucket: pageCountBucket(pages.length),
        objectCountBucket: objectCountBucket(objectCount),
      });
      notify(t("Export successful. Your edited PDF is downloading."), "success");
    } catch (error) {
      trackUsageEvent("export_failed", {
        pageCountBucket: pageCountBucket(pages.length),
        errorCode: getExportErrorCode(error),
      });
      notify(t("Could not export this PDF."), "error");
    } finally {
      setIsExporting(false);
    }
  }, [document, notify, pages, setIsExporting, t]);

  useKeyboardShortcuts(handleExport);

  async function handleUpload(file: File) {
    try {
      trackUsageEvent("upload_started", {
        source: "editor",
        fileSizeBucket: fileSizeBucket(file.size),
      });
      if (!(await loadPdf(file))) return;
      trackUsageEvent("upload_success", {
        source: "editor",
        fileSizeBucket: fileSizeBucket(file.size),
      });
    } catch {
      notify(t("Could not load this PDF."), "error");
    }
  }

  async function openSample() {
    if (isSampleLoading || isLoading || uploadId) return;
    setIsSampleLoading(true);
    try {
      await handleUpload(await fetchSamplePdf());
    } catch {
      notify(sampleError, "error");
    } finally {
      setIsSampleLoading(false);
    }
  }

  async function handleAddImage(file: File) {
    if (!activePage) return;
    try {
      const image = await imageFileToEditorData(file);
      addObject(
        createImageObject({
          page: activePage,
          x: Math.max(24, activePage.width / 2 - 120),
          y: Math.max(24, activePage.height / 2 - 80),
          src: image.dataUrl,
          mimeType: image.mimeType,
        }),
      );
      trackUsageEvent("image_added", { pageCountBucket: pageCountBucket(pages.length) });
      notify(t("Image added."), "success");
    } catch {
      notify(t("Could not add this image."), "error");
    }
  }

  function handleAddSignature(signature: { dataUrl: string; mimeType: "image/png" | "image/jpeg" }) {
    if (!activePage) return;
    addObject(
      createImageObject({
        page: activePage,
        x: Math.max(24, activePage.width / 2 - 130),
        y: Math.max(24, activePage.height / 2 - 48),
        src: signature.dataUrl,
        mimeType: signature.mimeType,
        type: "signature",
      }),
    );
    trackUsageEvent("signature_added", { pageCountBucket: pageCountBucket(pages.length) });
    notify(t("Signature added."), "success");
  }

  if (!document || !pdfDoc || !activePage) {
    return (
      <main className="min-h-screen bg-paper text-ink">
        <SiteHeader locale={locale} path="/editor" t={t} />
        <section className="site-wrap max-w-xl py-10 text-center sm:py-14">
          <h1 className="site-title mb-5 text-4xl sm:mb-7 sm:text-6xl">{t("PDF Editor")}</h1>
          <div className="rounded-xl border border-[#d6cbbd] bg-[#efe9df] p-2.5 shadow-panel sm:p-3">
            <UploadDropzone
              onFile={handleUpload}
              isLoading={isLoading || isSampleLoading || Boolean(uploadId)}
              onChoose={() => trackUsageEvent("upload_clicked", { source: "editor" })}
              wide
              illustrated
              copy={{ title: "Drop your PDF here", button: "Choose PDF", privacy: "Files stay on your device" }}
            />
            <button
              type="button"
              className="mt-1 inline-flex min-h-11 items-center gap-2 rounded-sm px-2 text-sm font-medium hover:text-brand-700 hover:underline disabled:opacity-50"
              disabled={isLoading || isSampleLoading || Boolean(uploadId)}
              onClick={() => void openSample()}
            >
              <FileText aria-hidden="true" size={16} />
              {sampleLabel}
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex h-[100dvh] min-h-0 flex-col bg-mist" aria-busy={isLoading}>
      <TopToolbar
        fileName={document.fileName}
        isLoading={isLoading}
        pagesOpen={pagesOpen}
        fitToWidth={fitToWidth}
        onTogglePages={() => setPagesOpen(open => !open)}
        onFitWidth={() => {
          setFitToWidth(true);
          fitPageWidth();
          canvasViewport.current?.scrollTo(0, 0);
        }}
        onZoom={zoomManually}
        onUploadPdf={(file) => void handleUpload(file)}
        onAddImage={(file) => void handleAddImage(file)}
        onOpenSignature={() => setSignatureOpen(true)}
        onExport={() => void handleExport()}
      />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1">
          <PageSidebar pdfDoc={pdfDoc} openOnNarrow={pagesOpen} />
          <section ref={canvasViewport} aria-label={t("Preview page")} tabIndex={0} className="relative min-w-0 flex-1 overflow-auto bg-[#ece8e0] p-3 editor-scrollbar sm:p-5">
            <div className="mx-auto flex min-h-full w-max min-w-full items-start justify-center">
              <PDFCanvas pdfDoc={pdfDoc} page={activePage} zoom={zoom} />
            </div>
          </section>
        </div>
        <PropertiesPanel />
      </div>
      <footer className="flex min-h-10 shrink-0 items-center justify-between gap-3 border-t border-line bg-paper px-2.5 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={t("Previous page")}
            title={t("Previous page")}
            disabled={pageIndex <= 0}
            onClick={() => setActivePage(pages[pageIndex - 1].id)}
            className="grid size-9 place-items-center rounded-sm hover:bg-mist disabled:opacity-30"
          >
            <ChevronLeft aria-hidden="true" size={16} />
          </button>
          <span aria-live="polite">{t("Page")} {pageIndex + 1} {t("of")} {pages.length}</span>
          <button
            type="button"
            aria-label={t("Next page")}
            title={t("Next page")}
            disabled={pageIndex >= pages.length - 1}
            onClick={() => setActivePage(pages[pageIndex + 1].id)}
            className="grid size-9 place-items-center rounded-sm hover:bg-mist disabled:opacity-30"
          >
            <ChevronRight aria-hidden="true" size={16} />
          </button>
        </div>
        <span>{t("Zoom")} {Math.round(zoom * 100)}%</span>
      </footer>
      <SignatureModal
        open={signatureOpen}
        onClose={() => setSignatureOpen(false)}
        onCreate={handleAddSignature}
      />
    </main>
  );
}

function getEditSignature(pages: PageState[]) {
  return pages
    .map((page) => `${page.id}:${page.sourcePageIndex}:${page.objects.map((object) => object.id).join(",")}`)
    .join("|");
}
