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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const targetCanvas = canvas;

    async function render() {
      setIsRendering(true);
      const pdfPage = await pdfDoc.getPage(page.sourcePageIndex + 1);
      const dpr = window.devicePixelRatio || 1;
      const viewport = pdfPage.getViewport({ scale: zoom * dpr });
      targetCanvas.width = viewport.width;
      targetCanvas.height = viewport.height;
      targetCanvas.style.width = `${page.width * zoom}px`;
      targetCanvas.style.height = `${page.height * zoom}px`;
      const context = targetCanvas.getContext("2d");
      if (!context || cancelled) return;
      context.setTransform(1, 0, 0, 1, 0, 0);
      await pdfPage.render({ canvasContext: context, viewport }).promise;
      if (!cancelled) setIsRendering(false);
    }

    void render().catch(() => {
      if (!cancelled) setIsRendering(false);
    });

    return () => {
      cancelled = true;
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
