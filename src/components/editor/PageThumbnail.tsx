"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/components/i18n/LocaleProvider";
import type { PageState } from "@/types/editor";
import type { PdfJsDocument } from "@/types/pdf";

export function PageThumbnail({ pdfDoc, page }: { pdfDoc: PdfJsDocument; page: PageState }) {
  const t = useTranslation();
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (visible || !container.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { rootMargin: "120px" });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    const target = canvas.current;
    if (!visible || !target) return;
    let cancelled = false;
    let task: { promise: Promise<void>; cancel?: () => void } | undefined;

    async function render(targetCanvas: HTMLCanvasElement) {
      try {
        const pdfPage = await pdfDoc.getPage(page.sourcePageIndex + 1);
        if (cancelled) return;
        const scale = 124 / page.width;
        const viewport = pdfPage.getViewport({ scale: scale * Math.min(window.devicePixelRatio || 1, 2) });
        targetCanvas.width = Math.ceil(viewport.width);
        targetCanvas.height = Math.ceil(viewport.height);
        const context = targetCanvas.getContext("2d");
        if (!context) return;
        task = pdfPage.render({ canvasContext: context, viewport });
        await task.promise;
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    void render(target);
    return () => {
      cancelled = true;
      task?.cancel?.();
    };
  }, [page.sourcePageIndex, page.width, pdfDoc, visible]);

  return (
    <div
      ref={container}
      className="relative mx-auto w-full max-w-[7.75rem] overflow-hidden rounded-sm border border-line bg-white shadow-sm"
      style={{ aspectRatio: `${page.width} / ${page.height}` }}
    >
      {failed
        ? <span className="absolute inset-0 grid place-items-center text-xs text-muted">{t("Preview")}</span>
        : <canvas ref={canvas} className="absolute inset-0 size-full" aria-hidden="true" />}
    </div>
  );
}
