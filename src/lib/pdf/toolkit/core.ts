import { getPdfJs } from "@/lib/pdf/renderPdf";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

export type Rect = { x: number; y: number; width: number; height: number };
export type Job = { signal: AbortSignal; progress: (value: number) => void };
export type Output = {
  blob: Blob;
  name: string;
  message?: string;
  text?: string;
};
export const MAX_BYTES = 100 * 1024 * 1024;
export function checkCancelled(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
}
export function errorKey(error: unknown) {
  if (error instanceof Error && /encrypt|password/i.test(error.message))
    return "Unlock password-protected PDFs before using this tool.";
  if (
    error instanceof Error &&
    [
      "INVALID_PAGES",
      "LIMIT",
      "NO_TEXT",
      "UNSUPPORTED_FONT",
      "INVALID_DOCX",
      "UNSUPPORTED_FORM",
    ].includes(error.message)
  )
    return (
      {
        INVALID_PAGES:
          "Enter valid page numbers, for example 1-3, 5. Pages cannot be repeated.",
        LIMIT: "This file exceeds the browser processing limits.",
        NO_TEXT:
          "No selectable text was found. Run OCR first, or choose the page-image Word format.",
        UNSUPPORTED_FONT:
          "This document contains characters the export font cannot render. Use the page-image Word format where available.",
        INVALID_DOCX:
          "Choose a valid DOCX file. Older DOC files, encrypted documents and oversized archives are not supported.",
        UNSUPPORTED_FORM:
          "This form uses unsupported fields. Use the PDF editor to add visible text instead.",
      } as Record<string, string>
    )[error.message];
  return "The file could not be processed. Try a smaller or different file.";
}
export async function pdfBytes(file: File) {
  if (file.size > MAX_BYTES) throw new Error("LIMIT");
  const bytes = await file.arrayBuffer();
  if (!new TextDecoder().decode(bytes.slice(0, 1024)).includes("%PDF-"))
    throw new Error("Invalid PDF");
  return bytes;
}
export async function openPdf(
  bytes: ArrayBuffer,
  maxPages = 100,
): Promise<PDFDocumentProxy> {
  const pdfjs = await getPdfJs();
  const doc = await pdfjs.getDocument({
    data: bytes.slice(0),
    isEvalSupported: false,
  }).promise;
  if (doc.numPages > maxPages) {
    await doc.destroy();
    throw new Error("LIMIT");
  }
  return doc;
}
export function parsePages(input: string, count: number): number[] {
  if (!input.trim()) return Array.from({ length: count }, (_, i) => i);
  const result: number[] = [];
  for (const part of input.split(",")) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw new Error("INVALID_PAGES");
    const first = Number(match[1]),
      last = Number(match[2] ?? match[1]);
    if (first < 1 || last > count || last < first)
      throw new Error("INVALID_PAGES");
    for (let i = first; i <= last; i++) {
      if (result.includes(i - 1)) throw new Error("INVALID_PAGES");
      result.push(i - 1);
    }
  }
  return result;
}
export function fileBase(name: string) {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
      .slice(0, 100) || "document"
  );
}
export function pdfOutput(bytes: Uint8Array, name: string): Output {
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    name,
  };
}
export async function renderPage(page: PDFPageProxy, scale = 1.5) {
  const natural = page.getViewport({ scale: 1 });
  const safeScale = Math.min(
    scale,
    Math.sqrt(6_000_000 / (natural.width * natural.height)),
    3000 / Math.max(natural.width, natural.height),
  );
  const viewport = page.getViewport({ scale: safeScale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Canvas unavailable");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: context, viewport, background: "#ffffff" })
    .promise;
  return { canvas, context, viewport, natural };
}
export async function canvasBytes(
  canvas: HTMLCanvasElement,
  type = "image/png",
  quality = 0.9,
) {
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Image export failed"))),
      type,
      quality,
    ),
  );
  return new Uint8Array(await blob.arrayBuffer());
}
export function releaseCanvas(canvas: HTMLCanvasElement) {
  canvas.width = 1;
  canvas.height = 1;
}
export async function zipOutputs(
  files: Output[],
  name: string,
): Promise<Output> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  for (const file of files) zip.file(file.name, await file.blob.arrayBuffer());
  return {
    blob: await zip.generateAsync({ type: "blob", compression: "STORE" }),
    name,
  };
}
export async function documentFont(
  pdf: import("pdf-lib").PDFDocument,
  bold = false,
) {
  const { default: fontkit } = await import("@pdf-lib/fontkit");
  pdf.registerFontkit(fontkit);
  const response = await fetch(
    `/tool-assets/fonts/noto-${bold ? 700 : 400}.woff`,
  );
  if (!response.ok) throw new Error("Font unavailable");
  return pdf.embedFont(await response.arrayBuffer(), { subset: true });
}
export function checkFont(font: import("pdf-lib").PDFFont, text: string) {
  const supported = new Set(font.getCharacterSet());
  if ([...text].some((c) => !supported.has(c.codePointAt(0)!) && !/\s/.test(c)))
    throw new Error("UNSUPPORTED_FONT");
}
