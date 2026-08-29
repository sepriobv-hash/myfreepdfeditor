"use client";

import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  FilePlus2,
  Files,
  Loader2,
  Trash2,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useToast } from "@/components/ui/Toaster";
import { downloadBlob } from "@/lib/utils";
import { fileSizeBucket, trackUsageEvent } from "@/lib/usage/client";

const MAX_FILES = 30;
const MAX_TOTAL_BYTES = 250 * 1024 * 1024;

export function MergePdfPanel() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const { notify } = useToast();

  function addFiles(selectedFiles: File[]) {
    const pdfFiles = selectedFiles.filter(isPdfFile);
    if (pdfFiles.length !== selectedFiles.length) {
      notify("Only PDF files can be merged.", "error");
    }
    if (pdfFiles.length === 0) return;

    const existingKeys = new Set(files.map(fileKey));
    const nextFiles = [
      ...files,
      ...pdfFiles.filter((file) => !existingKeys.has(fileKey(file))),
    ].slice(0, MAX_FILES);
    const totalBytes = nextFiles.reduce((total, file) => total + file.size, 0);

    if (totalBytes > MAX_TOTAL_BYTES) {
      notify("Choose PDFs with a combined size below 250 MB.", "error");
      return;
    }

    if (nextFiles.length === MAX_FILES && files.length + pdfFiles.length > MAX_FILES) {
      notify(`You can merge up to ${MAX_FILES} PDFs at once.`, "error");
    }

    setFiles(nextFiles);
    setResult(null);
    trackUsageEvent("upload_started", {
      source: "merge-pdf",
      fileCount: nextFiles.length,
      fileSizeBucket: fileSizeBucket(totalBytes),
    });
  }

  function moveFile(index: number, direction: -1 | 1) {
    const destination = index + direction;
    if (destination < 0 || destination >= files.length) return;
    setFiles((current) => {
      const reordered = [...current];
      [reordered[index], reordered[destination]] = [reordered[destination], reordered[index]];
      return reordered;
    });
    setResult(null);
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
    setResult(null);
  }

  async function mergeFiles() {
    if (files.length < 2) {
      notify("Choose at least two PDF files to merge.", "error");
      return;
    }

    try {
      setIsMerging(true);
      setResult(null);
      trackUsageEvent("export_started", { source: "merge-pdf", fileCount: files.length });
      const output = await PDFDocument.create();

      for (const file of files) {
        const source = await PDFDocument.load(await file.arrayBuffer());
        const copiedPages = await output.copyPages(source, source.getPageIndices());
        copiedPages.forEach((page) => output.addPage(page));
      }

      const bytes = await output.save({ useObjectStreams: true });
      const blob = new Blob([toArrayBuffer(bytes)], { type: "application/pdf" });
      const name = "merged-pdf.pdf";
      const nextResult = { blob, name };
      setResult(nextResult);
      downloadBlob(blob, name);
      trackUsageEvent("export_success", {
        source: "merge-pdf",
        fileCount: files.length,
        outputSizeBucket: fileSizeBucket(blob.size),
      });
      notify("Your merged PDF is ready.", "success");
    } catch (error) {
      trackUsageEvent("export_failed", { source: "merge-pdf" });
      notify(
        error instanceof Error && /encrypt|password/i.test(error.message)
          ? "One of these PDFs is password protected and cannot be merged."
          : "These PDF files could not be merged.",
        "error",
      );
    } finally {
      setIsMerging(false);
    }
  }

  return (
    <div className="p-3 sm:p-5">
      <div
        className={`flex min-h-52 flex-col items-center justify-center border-2 border-dashed px-6 py-8 text-center transition ${
          isDragging ? "border-rose-500 bg-rose-50" : "border-rose-200 bg-rose-50/40"
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          addFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-rose-600 shadow-sm">
          <Files className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-ink">Choose PDF files to merge</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
          Add two or more PDFs. Your files stay on this device while they are combined.
        </p>
        <button
          type="button"
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700"
          onClick={() => inputRef.current?.click()}
        >
          <FilePlus2 className="h-4 w-4" />
          Choose PDFs
        </button>
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          accept="application/pdf,.pdf"
          multiple
          onChange={(event) => {
            addFiles(Array.from(event.target.files ?? []));
            event.currentTarget.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-ink">PDF order</span>
            <span className="text-slate-500">
              {files.length} {files.length === 1 ? "file" : "files"} · {formatBytes(files.reduce((sum, file) => sum + file.size, 0))}
            </span>
          </div>
          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
            {files.map((file, index) => (
              <div key={fileKey(file)} className="flex min-w-0 items-center gap-3 rounded-md border border-line bg-slate-50 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-xs font-semibold text-brand-600 shadow-sm">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-ink">{file.name}</div>
                  <div className="text-xs text-slate-500">{formatBytes(file.size)}</div>
                </div>
                <button type="button" title="Move up" aria-label={`Move ${file.name} up`} className="p-2 text-slate-500 hover:text-ink disabled:opacity-30" disabled={index === 0} onClick={() => moveFile(index, -1)}>
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" title="Move down" aria-label={`Move ${file.name} down`} className="p-2 text-slate-500 hover:text-ink disabled:opacity-30" disabled={index === files.length - 1} onClick={() => moveFile(index, 1)}>
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" title="Remove" aria-label={`Remove ${file.name}`} className="p-2 text-slate-500 hover:text-rose-600" onClick={() => removeFile(index)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            disabled={files.length < 2 || isMerging}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={mergeFiles}
          >
            {isMerging ? <Loader2 className="h-4 w-4 animate-spin" /> : <Files className="h-4 w-4" />}
            {isMerging ? "Merging PDFs..." : "Merge PDFs"}
          </button>
        </div>
      )}

      {result && (
        <button type="button" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-3 text-sm font-semibold text-ink hover:bg-slate-50" onClick={() => downloadBlob(result.blob, result.name)}>
          <Download className="h-4 w-4" />
          Download merged PDF again
        </button>
      )}
    </div>
  );
}

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function toArrayBuffer(bytes: Uint8Array) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}
