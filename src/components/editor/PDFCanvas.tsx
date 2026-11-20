"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { TextSelectionLayer } from "@/components/editor/TextSelectionLayer";
import type { PageState } from "@/types/editor";
import type { PdfJsDocument } from "@/types/pdf";

const ObjectOverlay = dynamic(
  () => import("@/components/editor/ObjectOverlay").then((mod) => mod.ObjectOverlay),
  { ssr: false },
);

export function PDFCanvas({
  pdfDoc,
  page,
  zoom,
}: {
  pdfDoc: PdfJsDocument;
  page: PageState;
  zoom: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let task: { promise: Promise<void>; cancel?: () => void } | undefined;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const targetCanvas = canvas;

    async function render() {
      setIsRendering(true);
      const pdfPage = await pdfDoc.getPage(page.sourcePageIndex + 1);
      if (cancelled) return;
      const scale = Math.min(
        zoom * Math.min(window.devicePixelRatio || 1, 2),
        Math.sqrt(8_000_000 / (page.width * page.height)),
        4096 / Math.max(page.width, page.height),
      );
      const viewport = pdfPage.getViewport({ scale });
      targetCanvas.width = Math.ceil(viewport.width);
      targetCanvas.height = Math.ceil(viewport.height);
      targetCanvas.style.width = `${page.width * zoom}px`;
      targetCanvas.style.height = `${page.height * zoom}px`;
      const context = targetCanvas.getContext("2d");
      if (!context || cancelled) return;
      context.setTransform(1, 0, 0, 1, 0, 0);
      task = pdfPage.render({ canvasContext: context, viewport });
      await task.promise;
      if (!cancelled) setIsRendering(false);
    }

    void render().catch(() => {
      if (!cancelled) setIsRendering(false);
    });

    return () => {
      cancelled = true;
      task?.cancel?.();
    };
  }, [page.height, page.sourcePageIndex, page.width, pdfDoc, zoom]);

  return (
    <div
      className="relative bg-white shadow-panel"
      style={{ width: page.width * zoom, height: page.height * zoom }}
    >
      {isRendering && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
        </div>
      )}
      <canvas ref={canvasRef} className="absolute left-0 top-0" />
      <TextSelectionLayer pdfDoc={pdfDoc} page={page} zoom={zoom} canvasRef={canvasRef} />
      <ObjectOverlay page={page} zoom={zoom} />
    </div>
  );
}
