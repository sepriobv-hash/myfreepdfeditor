"use client";

import { getPdfJs } from "@/lib/pdf/renderPdf";
import type { PageState } from "@/types/editor";
import type { PdfJsDocument } from "@/types/pdf";

export type ExtractedPdfText = {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  fontWeight: number;
  italic: boolean;
  characterSpacing: number;
};

export async function extractPdfTextItems(pdfDoc: PdfJsDocument, page: PageState) {
  const [pdfjs, pdfPage] = await Promise.all([
    getPdfJs(),
    pdfDoc.getPage(page.sourcePageIndex + 1),
  ]);
  const viewport = pdfPage.getViewport({ scale: 1 });
  const textContent = await pdfPage.getTextContent();
  const viewportTransform = viewport.transform ?? [1, 0, 0, -1, 0, viewport.height];

  return textContent.items
    .map((item, index): ExtractedPdfText | null => {
      const text = item.str?.trim();
      if (!text || !item.transform) return null;

      const transform = pdfjs.Util.transform(viewportTransform, item.transform) as number[];
      const fontSize = Math.max(6, Math.hypot(transform[2], transform[3]));
      const width = Math.max(item.width ?? 0, text.length * fontSize * 0.45);
      const height = Math.max(item.height ?? 0, fontSize);
      const style = item.fontName ? textContent.styles?.[item.fontName] : undefined;
      const fontFamily = style?.fontFamily ?? item.fontName ?? "Helvetica";
      const fontSignature = `${item.fontName ?? ""} ${fontFamily}`;
      const fontWeight = estimateFontWeight(fontSignature);
      const bold = fontWeight >= 600;
      const italic = /\b(italic|oblique)\b/i.test(fontSignature);

      return {
        id: `${page.id}_${index}_${text.slice(0, 12)}`,
        text,
        x: transform[4],
        y: transform[5] - height,
        width,
        height,
        fontSize,
        fontFamily,
        bold,
        fontWeight,
        italic,
        characterSpacing: estimateCharacterSpacing(text, width, fontSize, fontFamily, fontWeight, italic),
      };
    })
    .filter((item): item is ExtractedPdfText => Boolean(item))
    .filter((item) => item.width > 2 && item.height > 2);
}

function estimateCharacterSpacing(
  text: string,
  targetWidth: number,
  fontSize: number,
  fontFamily: string,
  fontWeight: number,
  italic: boolean,
) {
  if (text.length < 2 || typeof document === "undefined") return 0;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 0;

  const fontStyle = italic ? "italic " : "";
  context.font = `${fontStyle}${fontWeight} ${fontSize}px ${fontFamily}, Helvetica, Arial, sans-serif`;
  const measuredWidth = context.measureText(text).width;
  const spacing = (targetWidth - measuredWidth) / Math.max(1, text.length - 1);

  if (!Number.isFinite(spacing)) return 0;
  return Math.max(-2, Math.min(12, Number(spacing.toFixed(2))));
}

function estimateFontWeight(fontSignature: string) {
  if (/\b(black|heavy|extrabold|ultrabold|poster)\b/i.test(fontSignature)) return 900;
  if (/\b(bold|demibold)\b/i.test(fontSignature)) return 700;
  if (/\b(semibold|medium)\b/i.test(fontSignature)) return 600;
  if (/\b(light|thin|hairline)\b/i.test(fontSignature)) return 300;
  return 400;
}
