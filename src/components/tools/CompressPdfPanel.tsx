"use client";

import { useRef, useState } from "react";
import { AlertCircle, Download, FileDown, FileText, Loader2, Trash2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useToast } from "@/components/ui/Toaster";
import { getPdfJs } from "@/lib/pdf/renderPdf";
import { downloadBlob, sanitizeFileName } from "@/lib/utils";
import { fileSizeBucket, trackUsageEvent } from "@/lib/usage/client";

const MAX_FILE_BYTES = 100 * 1024 * 1024;
const MAX_PAGES = 100;

const compressionLevels = {
  1: { label: "Strong", quality: 0.55, scale: 1.15 },
  2: { label: "Balanced", quality: 0.72, scale: 1.4 },
  3: { label: "High quality", quality: 0.84, scale: 1.7 },
} as const;

type CompressionLevel = keyof typeof compressionLevels;

type CompressionResult = {
  blob: Blob;
  name: string;
  originalSize: number;
  outputSize: number;
  flattened: boolean;
};

export function CompressPdfPanel() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>(2);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const { notify } = useToast();

  function chooseFile(nextFile?: File) {
    if (!nextFile) return;
    if (nextFile.type !== "application/pdf" && !nextFile.name.toLowerCase().endsWith(".pdf")) {
      notify("Please choose a valid PDF file.", "error");
      return;
    }
    if (nextFile.size > MAX_FILE_BYTES) {
      notify("Choose a PDF smaller than 100 MB for browser compression.", "error");
      return;
    }
    setFile(nextFile);
    setResult(null);
    trackUsageEvent("upload_started", {
      source: "compress-pdf",
      fileSizeBucket: fileSizeBucket(nextFile.size),
    });
    trackUsageEvent("upload_success", {
      source: "compress-pdf",
      fileSizeBucket: fileSizeBucket(nextFile.size),
    });
  }

  async function compressFile() {
    if (!file) return;

    try {
      setIsCompressing(true);
      setProgress(2);
      setResult(null);
      trackUsageEvent("export_started", {
        source: "compress-pdf",
        compressionLevel: compressionLevels[level].label,
      });

      const originalBuffer = await file.arrayBuffer();
      const originalBytes = new Uint8Array(originalBuffer);
      const optimizedBytes = await optimizeStructure(originalBuffer);
      setProgress(10);

      const rasterizedBytes = await rasterizePdf(
        originalBuffer,
        compressionLevels[level],
        setProgress,
      );
      const candidates = [
        { bytes: originalBytes, flattened: false },
        { bytes: optimizedBytes, flattened: false },
        { bytes: rasterizedBytes, flattened: true },
      ];
      const best = candidates.reduce((smallest, candidate) =>
        candidate.bytes.byteLength < smallest.bytes.byteLength ? candidate : smallest,
      );

      const blob = new Blob([toArrayBuffer(best.bytes)], { type: "application/pdf" });
      const baseName = sanitizeFileName(file.name).replace(/\.pdf$/i, "") || "document";
      const nextResult: CompressionResult = {
        blob,
        name: `${baseName}-compressed.pdf`,
        originalSize: file.size,
        outputSize: blob.size,
        flattened: best.flattened,
      };
      setResult(nextResult);
      setProgress(100);
      downloadBlob(blob, nextResult.name);
      trackUsageEvent("export_success", {
        source: "compress-pdf",
        outputSizeBucket: fileSizeBucket(blob.size),
        flattened: best.flattened,
      });
      notify(
        blob.size < file.size
          ? "Your compressed PDF is ready."
          : "This PDF was already efficiently compressed. Your copy is ready.",
        "success",
      );
    } catch (error) {
      trackUsageEvent("export_failed", { source: "compress-pdf" });
      notify(
        error instanceof Error && /page limit/i.test(error.message)
          ? error.message
          : error instanceof Error && /encrypt|password/i.test(error.message)
            ? "Password-protected PDFs cannot be compressed yet."
            : "This PDF could not be compressed in the browser.",
        "error",
      );
    } finally {
      setIsCompressing(false);
    }
  }

  const reduction = result
    ? Math.max(0, Math.round((1 - result.outputSize / result.originalSize) * 100))
    : 0;

  return (
    <div className="p-3 sm:p-5">
      {!file ? (
        <div className="flex min-h-64 flex-col items-center justify-center border-2 border-dashed border-rose-200 bg-rose-50/40 px-6 py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-rose-600 shadow-sm">
            <FileDown className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-ink">Choose a PDF to compress</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            Reduce file size locally in your browser. Files up to 100 MB and 100 pages are supported.
          </p>
          <button type="button" className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700" onClick={() => {
            trackUsageEvent("upload_clicked", { source: "compress-pdf" });
            inputRef.current?.click();
          }}>
            <FileText className="h-4 w-4" />
            Choose PDF
          </button>
          <input ref={inputRef} className="hidden" type="file" accept="application/pdf,.pdf" onChange={(event) => {
            chooseFile(event.target.files?.[0]);
            event.currentTarget.value = "";
          }} />
        </div>
      ) : (
        <div>
          <div className="flex min-w-0 items-center gap-3 rounded-md border border-line bg-slate-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-brand-600 shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-ink">{file.name}</div>
              <div className="mt-1 text-xs text-slate-500">{formatBytes(file.size)}</div>
            </div>
            <button type="button" title="Remove PDF" aria-label="Remove PDF" className="p-2 text-slate-500 hover:text-rose-600" disabled={isCompressing} onClick={() => {
              setFile(null);
              setResult(null);
            }}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <label className="font-semibold text-ink" htmlFor="compression-level">Compression level</label>
              <span className="font-medium text-brand-600">{compressionLevels[level].label}</span>
            </div>
            <input
              id="compression-level"
              type="range"
              min="1"
              max="3"
              step="1"
              value={level}
              disabled={isCompressing}
              className="mt-3 w-full accent-rose-600"
              onChange={(event) => {
                setLevel(Number(event.target.value) as CompressionLevel);
                setResult(null);
              }}
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>Smaller file</span>
              <span>Balanced</span>
              <span>Sharper pages</span>
            </div>
          </div>

          <div className="mt-5 flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Strong compression may flatten pages into images. That can remove selectable text, links, and form fields from the compressed copy.</p>
          </div>

          {isCompressing && (
            <div className="mt-5" aria-live="polite">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Compressing on this device</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <button type="button" disabled={isCompressing} className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60" onClick={compressFile}>
            {isCompressing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            {isCompressing ? "Compressing PDF..." : "Compress PDF"}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4">
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <ResultStat label="Before" value={formatBytes(result.originalSize)} />
            <ResultStat label="After" value={formatBytes(result.outputSize)} />
            <ResultStat label="Reduction" value={`${reduction}%`} />
          </div>
          <p className="mt-3 text-xs leading-5 text-emerald-900">
            {result.outputSize < result.originalSize
              ? result.flattened
                ? "The image-compressed version produced the smallest file."
                : "Lossless structure optimization produced the smallest file."
              : "The original was already the smallest available version, so the downloaded copy keeps its original quality."}
          </p>
          <button type="button" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-emerald-300 bg-white px-4 py-3 text-sm font-semibold text-emerald-900 hover:bg-emerald-100" onClick={() => downloadBlob(result.blob, result.name)}>
            <Download className="h-4 w-4" />
            Download compressed PDF again
          </button>
        </div>
      )}
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-emerald-800">{label}</div>
      <div className="mt-1 font-semibold text-emerald-950">{value}</div>
    </div>
  );
}

async function optimizeStructure(bytes: ArrayBuffer) {
  const document = await PDFDocument.load(bytes.slice(0));
  return document.save({ useObjectStreams: true });
}

async function rasterizePdf(
  bytes: ArrayBuffer,
  settings: { quality: number; scale: number },
  onProgress: (progress: number) => void,
) {
  const pdfjs = await getPdfJs();
  const loadingTask = pdfjs.getDocument({ data: bytes.slice(0) });
  const source = await loadingTask.promise;
  if (source.numPages > MAX_PAGES) {
    await source.destroy();
    throw new Error(`This browser compressor has a ${MAX_PAGES}-page limit.`);
  }

  const output = await PDFDocument.create();
  try {
    for (let pageNumber = 1; pageNumber <= source.numPages; pageNumber += 1) {
      const page = await source.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const renderViewport = page.getViewport({ scale: settings.scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(renderViewport.width));
      canvas.height = Math.max(1, Math.round(renderViewport.height));
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) throw new Error("Canvas rendering is unavailable.");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: context, viewport: renderViewport }).promise;
      const jpegBlob = await canvasToJpeg(canvas, settings.quality);
      const image = await output.embedJpg(await jpegBlob.arrayBuffer());
      const outputPage = output.addPage([baseViewport.width, baseViewport.height]);
      outputPage.drawImage(image, {
        x: 0,
        y: 0,
        width: baseViewport.width,
        height: baseViewport.height,
      });
      canvas.width = 1;
      canvas.height = 1;
      onProgress(10 + Math.round((pageNumber / source.numPages) * 85));
    }
    return await output.save({ useObjectStreams: true });
  } finally {
    await source.destroy();
  }
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode PDF page."))),
      "image/jpeg",
      quality,
    );
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function toArrayBuffer(bytes: Uint8Array) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}
