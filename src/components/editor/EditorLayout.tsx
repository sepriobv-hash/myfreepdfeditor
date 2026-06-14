"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FileText, Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
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
import { consumePendingUpload } from "@/lib/editor/uploadHandoff";
import { exportEditedPdf } from "@/lib/pdf/exportPdf";
import { fileSizeBucket, trackUsageEvent } from "@/lib/usage/client";
import { downloadBlob } from "@/lib/utils";
import { useEditorStore } from "@/store/editorStore";

export function EditorLayout() {
  const searchParams = useSearchParams();
  const [signatureOpen, setSignatureOpen] = useState(false);
  const trackedDocumentIdRef = useRef<string | null>(null);
  const document = useEditorStore((state) => state.document);
  const pdfDoc = useEditorStore((state) => state.pdfDoc);
  const pages = useEditorStore((state) => state.pages);
  const activePageId = useEditorStore((state) => state.activePageId);
  const zoom = useEditorStore((state) => state.zoom);
  const isLoading = useEditorStore((state) => state.isLoading);
  const loadPdf = useEditorStore((state) => state.loadPdf);
  const addObject = useEditorStore((state) => state.addObject);
  const setIsExporting = useEditorStore((state) => state.setIsExporting);
  const { notify } = useToast();

  useEffect(() => {
    const uploadId = searchParams.get("uploadId");
    if (!uploadId || document || isLoading) return;

    let cancelled = false;
    void consumePendingUpload(uploadId)
      .then(async (file) => {
        if (cancelled) return;
        if (!file) {
          notify("The uploaded PDF could not be found. Please upload it again.", "error");
          return;
        }
        await loadPdf(file);
        trackUsageEvent("upload_consumed", {
          source: "homepage",
          fileSizeBucket: fileSizeBucket(file.size),
        });
        trackUsageEvent("pdf_uploaded", {
          source: "homepage",
          fileSizeBucket: fileSizeBucket(file.size),
        });
        if (!cancelled) notify("PDF uploaded.", "success");
      })
      .catch((error) => {
        if (!cancelled) {
          notify(error instanceof Error ? error.message : "Could not load this PDF.", "error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [document, isLoading, loadPdf, notify, searchParams]);

  useEffect(() => {
    if (!document) return;
    const documentKey = `${document.fileName}:${document.pageCount}:${document.originalBytes.byteLength}`;
    if (trackedDocumentIdRef.current === documentKey) return;
    trackedDocumentIdRef.current = documentKey;
    trackUsageEvent("editor_opened", {
      pageCount: pages.length,
      fileSizeBucket: fileSizeBucket(document.originalBytes.byteLength),
    });
  }, [document, pages.length]);

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) ?? pages[0],
    [activePageId, pages],
  );

  const handleExport = useCallback(async () => {
    if (!document || !pages.length) {
      notify("Upload a PDF before exporting.", "error");
      return;
    }
    try {
      setIsExporting(true);
      const objectCount = pages.reduce((total, page) => total + page.objects.length, 0);
      trackUsageEvent("export_started", {
        pageCount: pages.length,
        objectCount,
      });
      const result = await exportEditedPdf({
        originalBytes: document.originalBytes,
        pages,
        fileName: document.fileName,
      });
      downloadBlob(result.blob, result.fileName);
      trackUsageEvent("export_success", {
        pageCount: pages.length,
        objectCount,
      });
      notify("Export successful. Your edited PDF is downloading.", "success");
    } catch (error) {
      trackUsageEvent("export_failed", {
        pageCount: pages.length,
        reason: error instanceof Error ? error.message.slice(0, 120) : "unknown",
      });
      notify(error instanceof Error ? error.message : "Could not export this PDF.", "error");
    } finally {
      setIsExporting(false);
    }
  }, [document, notify, pages, setIsExporting]);

  useKeyboardShortcuts(handleExport);

  async function handleUpload(file: File) {
    try {
      trackUsageEvent("upload_started", {
        source: "editor",
        fileSizeBucket: fileSizeBucket(file.size),
      });
      await loadPdf(file);
      trackUsageEvent("pdf_uploaded", {
        source: "editor",
        fileSizeBucket: fileSizeBucket(file.size),
      });
      notify("PDF uploaded.", "success");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not load this PDF.", "error");
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
      trackUsageEvent("image_added", { pageCount: pages.length });
      notify("Image added.", "success");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not add this image.", "error");
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
    trackUsageEvent("signature_added", { pageCount: pages.length });
    notify("Signature added.", "success");
  }

  if (!document || !pdfDoc || !activePage) {
    return (
      <main className="min-h-screen bg-mist">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link className="flex items-center gap-3" href="/">
            <BrandLogo compact />
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-line bg-white px-3 text-sm font-medium text-ink transition hover:bg-slate-50"
            href="/"
          >
            Home
          </Link>
        </nav>
        <section className="mx-auto max-w-2xl px-5 py-12">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-white text-brand-600 shadow-soft">
              {isLoading ? <Loader2 className="h-7 w-7 animate-spin" /> : <FileText className="h-7 w-7" />}
            </div>
          </div>
          <UploadDropzone onFile={handleUpload} isLoading={isLoading} />
        </section>
      </main>
    );
  }

  return (
    <main className="flex h-screen min-h-0 flex-col bg-mist">
      <TopToolbar
        onUploadPdf={(file) => void handleUpload(file)}
        onAddImage={(file) => void handleAddImage(file)}
        onOpenSignature={() => setSignatureOpen(true)}
        onExport={() => void handleExport()}
      />
      <div className="flex min-h-0 flex-1">
        <PageSidebar pdfDoc={pdfDoc} />
        <section className="relative min-w-0 flex-1 overflow-auto bg-[#e9edf3] p-4 editor-scrollbar">
          <div className="mx-auto flex min-h-full w-max items-start justify-center p-2">
            <PDFCanvas pdfDoc={pdfDoc} page={activePage} zoom={zoom} />
          </div>
        </section>
        <PropertiesPanel />
      </div>
      <footer className="flex min-h-10 items-center justify-between border-t border-line bg-white px-4 text-xs text-slate-600">
        <span>
          Page {pages.findIndex((page) => page.id === activePage.id) + 1} of {pages.length}
        </span>
        <span>{document.fileName}</span>
        <span>Zoom {Math.round(zoom * 100)}%</span>
      </footer>
      <SignatureModal
        open={signatureOpen}
        onClose={() => setSignatureOpen(false)}
        onCreate={handleAddSignature}
      />
    </main>
  );
}
