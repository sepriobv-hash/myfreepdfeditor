"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  openPdf,
  releaseCanvas,
  renderPage,
  type Rect,
} from "@/lib/pdf/toolkit/core";
import { useTranslation } from "@/components/i18n/LocaleProvider";

type Props = {
  bytes: ArrayBuffer;
  page: number;
  rects?: Rect[];
  mode?: "crop" | "redact";
  onRect?: (rect: Rect) => void;
};
export function PdfPreview({ bytes, page, rects = [], mode, onRect }: Props) {
  const t = useTranslation();
  const canvas = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [draft, setDraft] = useState<Rect | null>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState<{
    bytes: ArrayBuffer;
    page: number;
  } | null>(null);
  const ready = loaded?.bytes === bytes && loaded?.page === page;
  useEffect(() => {
    let active = true;
    let source: PDFDocumentProxy | undefined;
    setDoc(null);
    setError(false);
    void openPdf(bytes)
      .then((pdf) => {
        source = pdf;
        if (active) setDoc(pdf);
        else void pdf.destroy();
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
      void source?.destroy();
    };
  }, [bytes]);
  useEffect(() => {
    let active = true;
    setDraft(null);
    if (!doc) return;
    void (async () => {
      const rendered = await renderPage(await doc.getPage(page), 1.3);
      try {
        if (active && canvas.current) {
          canvas.current.width = rendered.canvas.width;
          canvas.current.height = rendered.canvas.height;
          canvas.current.getContext("2d")!.drawImage(rendered.canvas, 0, 0);
          setLoaded({ bytes, page });
        }
      } finally {
        releaseCanvas(rendered.canvas);
      }
    })().catch(() => {
      if (active) setError(true);
    });
    return () => {
      active = false;
    };
  }, [doc, page, bytes]);
  function point(e: PointerEvent) {
    const b = box.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - b.left) / b.width)),
      y: Math.max(0, Math.min(1, (e.clientY - b.top) / b.height)),
    };
  }
  function move(e: PointerEvent) {
    if (!start.current) return;
    const p = point(e);
    const a = start.current;
    setDraft({
      x: Math.min(a.x, p.x),
      y: Math.min(a.y, p.y),
      width: Math.abs(p.x - a.x),
      height: Math.abs(p.y - a.y),
    });
  }
  if (error)
    return (
      <p role="alert" className="text-sm text-rose-800">
        {t("Preview could not be loaded. Try another PDF.")}
      </p>
    );
  return (
    <div>
      <div
        ref={box}
        aria-busy={!ready}
        role={mode ? "application" : undefined}
        aria-label={
          mode ? t("Drag on the page to select an area") : t("PDF preview")
        }
        tabIndex={mode ? 0 : undefined}
        className={`relative mx-auto w-full max-w-lg overflow-hidden border border-slate-300 bg-white ${mode ? "touch-none cursor-crosshair" : ""}`}
        onPointerDown={(e) => {
          if (!mode || !ready) return;
          start.current = point(e);
          e.currentTarget.setPointerCapture(e.pointerId);
          setDraft(null);
        }}
        onPointerMove={move}
        onPointerUp={(e) => {
          if (!start.current) return;
          const p = point(e),
            a = start.current;
          const r = {
            x: Math.min(a.x, p.x),
            y: Math.min(a.y, p.y),
            width: Math.abs(p.x - a.x),
            height: Math.abs(p.y - a.y),
          };
          if (r.width > 0.005 && r.height > 0.005) onRect?.(r);
          start.current = null;
          setDraft(null);
        }}
        onPointerCancel={() => {
          start.current = null;
          setDraft(null);
        }}
      >
        {!ready && (
          <p
            role="status"
            className="absolute inset-0 flex items-center justify-center bg-white p-4 text-sm"
          >
            {t("Loading preview…")}
          </p>
        )}
        <canvas
          ref={canvas}
          className={`block h-auto w-full ${ready ? "" : "invisible"}`}
          aria-label={t("PDF preview")}
        />
        {[...rects, ...(draft ? [draft] : [])].map((r, i) => (
          <div
            key={i}
            className={`pointer-events-none absolute ${mode === "redact" ? "bg-black" : "border-2 border-rose-600 bg-rose-500/15"}`}
            style={{
              left: `${r.x * 100}%`,
              top: `${r.y * 100}%`,
              width: `${r.width * 100}%`,
              height: `${r.height * 100}%`,
            }}
          />
        ))}
      </div>
      {mode && (
        <p className="mt-2 text-xs leading-5 text-slate-600">
          {t(
            "Drag with a mouse or finger. You can also enter exact percentages below.",
          )}
        </p>
      )}
    </div>
  );
}
