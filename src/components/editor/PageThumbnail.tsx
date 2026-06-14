"use client";

import { useEffect, useRef, useState } from "react";
import type { PageState } from "@/types/editor";
import type { PdfJsDocument } from "@/types/pdf";

export function PageThumbnail({ pdfDoc, page }: { pdfDoc: PdfJsDocument; page: PageState }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const targetCanvas = canvas;

    async function render() {
      try {
        const pdfPage = await pdfDoc.getPage(page.sourcePageIndex + 1);
        const width = 104;
        const scale = width / page.width;
        const dpr = window.devicePixelRatio || 1;
        const viewport = pdfPage.getViewport({ scale: scale * dpr });
        targetCanvas.width = viewport.width;
        targetCanvas.height = viewport.height;
        targetCanvas.style.width = `${width}px`;
        targetCanvas.style.height = `${page.height * scale}px`;
        const context = targetCanvas.getContext("2d");
        if (!context || cancelled) return;
        await pdfPage.render({ canvasContext: context, viewport }).promise;
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [page.height, page.sourcePageIndex, page.width, pdfDoc]);

  if (failed) {
    return <div className="flex h-32 w-24 items-center justify-center bg-slate-100 text-xs text-slate-500">Preview</div>;
  }

  return <canvas ref={canvasRef} className="rounded-sm bg-white shadow-sm" />;
}
