"use client";

import type { PdfJsDocument } from "@/types/pdf";

let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;

export async function getPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url,
      ).toString();
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

export async function loadPdfFromBytes(bytes: ArrayBuffer): Promise<PdfJsDocument> {
  const pdfjs = await getPdfJs();
  const task = pdfjs.getDocument({ data: bytes.slice(0) });
  return task.promise as unknown as Promise<PdfJsDocument>;
}
