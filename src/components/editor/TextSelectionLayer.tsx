"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { createTextReplacementObjects } from "@/lib/editor/objectUtils";
import { extractPdfTextItems, type ExtractedPdfText } from "@/lib/pdf/textExtraction";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editorStore";
import type { PageState } from "@/types/editor";
import type { PdfJsDocument } from "@/types/pdf";

export function TextSelectionLayer({
  pdfDoc,
  page,
  zoom,
  canvasRef,
}: {
  pdfDoc: PdfJsDocument;
  page: PageState;
  zoom: number;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}) {
  const tool = useEditorStore((state) => state.tool);
  const addObjects = useEditorStore((state) => state.addObjects);
  const [items, setItems] = useState<ExtractedPdfText[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (tool !== "text") {
      setItems([]);
      return;
    }

    setIsLoading(true);
    void extractPdfTextItems(pdfDoc, page)
      .then((nextItems) => {
        if (!cancelled) setItems(nextItems);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, pdfDoc, tool]);

  if (tool !== "text") return null;

  return (
    <div
      className="pointer-events-none absolute left-0 top-0 z-10"
      style={{ width: page.width * zoom, height: page.height * zoom }}
    >
      <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-brand-200 bg-white/95 px-3 py-2 text-xs font-medium text-brand-700 shadow-soft">
        {isLoading ? "Finding editable text..." : "Click existing text, then edit it in Properties"}
      </div>
      {items.map((item) => (
        <button
          key={item.id}
          className={cn(
            "pointer-events-auto absolute rounded-sm border border-transparent bg-brand-500/0 transition",
            "hover:border-brand-500 hover:bg-brand-500/10 focus:border-brand-500 focus:bg-brand-500/10 focus:outline-none",
          )}
          style={{
            left: item.x * zoom,
            top: item.y * zoom,
            width: Math.max(8, item.width * zoom),
            height: Math.max(8, item.height * zoom),
          }}
          title={`Edit: ${item.text}`}
          onClick={() => {
            const { cover, replacement } = createTextReplacementObjects({
              page,
              x: item.x,
              y: item.y,
              width: item.width,
              height: item.height,
              text: item.text,
              fontSize: item.fontSize,
              fontFamily: item.fontFamily,
              color: sampleTextColor(canvasRef.current, item, page),
              bold: item.bold,
              fontWeight: item.fontWeight,
              italic: item.italic,
              characterSpacing: item.characterSpacing,
            });
            addObjects([cover, replacement], replacement.id);
          }}
        />
      ))}
    </div>
  );
}

function sampleTextColor(
  canvas: HTMLCanvasElement | null,
  item: ExtractedPdfText,
  page: PageState,
) {
  const context = canvas?.getContext("2d", { willReadFrequently: true });
  if (!canvas || !context) return "#111827";

  const scaleX = canvas.width / page.width;
  const scaleY = canvas.height / page.height;
  const x = clamp(Math.floor(item.x * scaleX), 0, canvas.width - 1);
  const y = clamp(Math.floor(item.y * scaleY), 0, canvas.height - 1);
  const width = clamp(Math.ceil(item.width * scaleX), 1, canvas.width - x);
  const height = clamp(Math.ceil(item.height * scaleY), 1, canvas.height - y);

  try {
    const image = context.getImageData(x, y, width, height);
    const candidates: Array<{ r: number; g: number; b: number; luma: number }> = [];

    for (let index = 0; index < image.data.length; index += 16) {
      const r = image.data[index];
      const g = image.data[index + 1];
      const b = image.data[index + 2];
      const alpha = image.data[index + 3];
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (alpha > 128 && luma < 242) {
        candidates.push({ r, g, b, luma });
      }
    }

    if (!candidates.length) return "#111827";
    candidates.sort((a, b) => a.luma - b.luma);
    const sample = candidates.slice(0, Math.min(80, Math.max(8, Math.floor(candidates.length * 0.25))));
    const average = sample.reduce(
      (sum, color) => ({
        r: sum.r + color.r,
        g: sum.g + color.g,
        b: sum.b + color.b,
      }),
      { r: 0, g: 0, b: 0 },
    );
    return rgbToHex(
      Math.round(average.r / sample.length),
      Math.round(average.g / sample.length),
      Math.round(average.b / sample.length),
    );
  } catch {
    return "#111827";
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}
