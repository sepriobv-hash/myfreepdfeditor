"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Copy,
  Download,
  FileUp,
  Loader2,
  X,
} from "lucide-react";
import { useLocale, useTranslation } from "@/components/i18n/LocaleProvider";
import { useFileDrop } from "@/hooks/useFileDrop";
import { usePendingToolUpload } from "@/hooks/usePendingToolUpload";
import { useToast } from "@/components/ui/Toaster";
import { getLocalizedPath } from "@/lib/i18n";
import { storePendingUpload } from "@/lib/editor/uploadHandoff";
import { cn, downloadBlob } from "@/lib/utils";
import type { PdfTool } from "@/lib/pdfTools";
import { fileSizeBucket, trackUsageEvent } from "@/lib/usage/client";
import {
  checkCancelled,
  errorKey,
  fileBase,
  openPdf,
  pdfBytes,
  type Job,
  type Output,
  type Rect,
} from "@/lib/pdf/toolkit/core";
import type { FormField } from "@/lib/pdf/toolkit/forms";
import type { OcrLanguage } from "@/lib/pdf/toolkit/ocr";
import { PdfPreview } from "./PdfPreview";

type ToolkitWorkflow = Exclude<PdfTool["workflow"], "editor" | "merge" | "compress" | undefined>;
const button =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";
const ocrLanguageLabels: Record<OcrLanguage, string> = {
  en: "English",
  nl: "Nederlands",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  "pt-BR": "Português",
};
const input =
  "min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm";
export function ToolkitPanel({
  workflow,
  slug,
}: {
  workflow: ToolkitWorkflow;
  slug: string;
}) {
  const t = useTranslation(),
    locale = useLocale();
  const { notify } = useToast();
  const pngInput = slug === "png-to-pdf";
  const flattenForm = slug === "flatten-pdf-form";
  const plainText = workflow === "pdf-to-text";
  const textOutput = plainText || slug === "scanned-pdf-to-text";
  const textLabel = t(plainText ? "Extracted text" : "Recognized text");
  const [files, setFiles] = useState<File[]>([]),
    [bytes, setBytes] = useState<ArrayBuffer | null>(null),
    [count, setCount] = useState(0),
    [selection, setSelection] = useState(""),
    [page, setPage] = useState(1),
    [angle, setAngle] = useState(90),
    [rect, setRect] = useState<Rect>(),
    [masks, setMasks] = useState<Record<number, Rect[]>>({}),
    [format, setFormat] = useState<"png" | "jpeg">(slug === "pdf-to-png" ? "png" : "jpeg"),
    [imageSize, setImageSize] = useState<"fit" | "a4">("a4"),
    [scale, setScale] = useState(1.5),
    [ocrLanguage, setOcrLanguage] = useState<OcrLanguage>(
      locale in ocrLanguageLabels ? (locale as OcrLanguage) : "en",
    ),
    [wordMode, setWordMode] = useState<"text" | "images">("text"),
    [fields, setFields] = useState<FormField[]>([]),
    [flatten, setFlatten] = useState(false),
    [confirmed, setConfirmed] = useState(false),
    [busy, setBusy] = useState(false),
    [reading, setReading] = useState(false),
    [progress, setProgress] = useState(0),
    [error, setError] = useState(""),
    [offerScan, setOfferScan] = useState(false),
    [result, setResult] = useState<Output | null>(null),
    [previewResult, setPreviewResult] = useState<ArrayBuffer | null>(null),
    [nextTool, setNextTool] = useState("/editor");
  const [outputPage, setOutputPage] = useState(1),
    [outputCount, setOutputCount] = useState(0),
    [continuing, setContinuing] = useState(false);
  const [manual, setManual] = useState({ x: 10, y: 10, width: 40, height: 15 });
  const abort = useRef<AbortController | null>(null),
    generation = useRef(0),
    mounted = useRef(true);
  const fileInput = useRef<HTMLInputElement>(null);
  const textPreview = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      abort.current?.abort();
    };
  }, []);
  const images = workflow === "images-to-pdf",
    wordInput = workflow === "word-to-pdf",
    editingArea = workflow === "crop" || workflow === "redact";
  const accept = pngInput ? "image/png,.png" : images
    ? "image/jpeg,image/png,.jpg,.jpeg,.png"
    : wordInput
      ? ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      : "application/pdf,.pdf";
  function invalidate() {
    setResult(null);
    setPreviewResult(null);
    setError("");
    setOfferScan(false);
  }
  async function choose(incoming: File[]) {
    const id = ++generation.current;
    invalidate();
    setReading(true);
    setBytes(null);
    setFiles([]);
    setCount(0);
    setPage(1);
    setSelection("");
    setRect(undefined);
    setMasks({});
    setConfirmed(false);
    setFields([]);
    try {
      if (!incoming.length) return;
      trackUsageEvent("upload_started", {
        source: slug,
        fileSizeBucket: fileSizeBucket(incoming[0].size),
      });
      if (
        incoming.reduce((n, f) => n + f.size, 0) > 100 * 1024 * 1024 ||
        incoming.length > (images ? 50 : 1)
      )
        throw new Error("LIMIT");
      if (images) {
        if (pngInput && incoming.some(file => file.type ? file.type !== "image/png" : !/\.png$/i.test(file.name)))
          throw new Error("PNG_REQUIRED");
        if (
          incoming.some(
            (f) =>
              !/^image\/(jpeg|png)$/.test(f.type) &&
              !/\.(jpe?g|png)$/i.test(f.name),
          )
        )
          throw new Error("Invalid image");
      } else if (wordInput) {
        if (!/\.docx$/i.test(incoming[0].name)) throw new Error("INVALID_DOCX");
        if (incoming[0].size > 30 * 1024 * 1024) throw new Error("LIMIT");
      } else {
        const b = await pdfBytes(incoming[0]);
        const source = await openPdf(
          b,
          workflow === "ocr"
            ? 20
            : workflow === "redact" || workflow === "pdf-to-word"
              ? 50
              : 100,
        );
        const n = source.numPages;
        await source.destroy();
        if (id !== generation.current || !mounted.current) return;
        setBytes(b);
        setCount(n);
        if (workflow === "forms") {
          const { inspectForm } = await import("@/lib/pdf/toolkit/forms");
          const f = await inspectForm(b);
          if (id !== generation.current || !mounted.current) return;
          setFields(f);
        }
      }
      if (id !== generation.current || !mounted.current) return;
      setFiles(incoming);
      trackUsageEvent("upload_success", {
        source: slug,
        fileSizeBucket: fileSizeBucket(incoming[0].size),
      });
    } catch (e) {
      if (id === generation.current && mounted.current) {
        trackUsageEvent("upload_failed", { source: slug });
        setError(t(errorKey(e)));
        setFiles([]);
        setBytes(null);
      }
    } finally {
      if (id === generation.current && mounted.current) setReading(false);
    }
  }
  usePendingToolUpload(
    file => { void choose([file]); },
    () => setError(t("The temporary file is no longer available. Choose it again.")),
    !images && !wordInput,
  );
  const { dragging, dropProps } = useFileDrop(incoming => void choose(incoming), busy || reading);

  function addRect(r: Rect) {
    invalidate();
    setConfirmed(false);
    if (workflow === "crop") setRect(r);
    else
      setMasks((current) => ({
        ...current,
        [page]: [...(current[page] ?? []), r],
      }));
  }
  async function run() {
    if (!files.length || abort.current) return;
    invalidate();
    setBusy(true);
    setProgress(0);
    const controller = new AbortController();
    abort.current = controller;
    const job: Job = {
      signal: controller.signal,
      progress: (p) => {
        if (mounted.current) setProgress(Math.round(p));
      },
    };
    trackUsageEvent("export_started", { source: slug });
    try {
      let output: Output;
      if (images) {
        const { imagesToPdf } = await import("@/lib/pdf/toolkit/pages");
        output = await imagesToPdf(files, imageSize, job);
      } else if (wordInput) {
        const { wordToPdf } = await import("@/lib/pdf/toolkit/office");
        output = await wordToPdf(
          await files[0].arrayBuffer(),
          files[0].name,
          job,
        );
      } else {
        if (!bytes) throw new Error("Missing PDF");
        if (["split", "extract", "rotate", "crop"].includes(workflow)) {
          const { pageOperation } = await import("@/lib/pdf/toolkit/pages");
          output = await pageOperation(
            bytes,
            files[0].name,
            workflow as "split" | "extract" | "rotate" | "crop",
            selection,
            angle,
            rect,
            job,
          );
        } else if (workflow === "pdf-to-images") {
          const { pdfToImages } = await import("@/lib/pdf/toolkit/pages");
          output = await pdfToImages(
            bytes,
            files[0].name,
            selection,
            format,
            scale,
            job,
          );
        } else if (workflow === "redact") {
          const { redactPdf } = await import("@/lib/pdf/toolkit/pages");
          output = await redactPdf(bytes, files[0].name, masks, job);
        } else if (workflow === "pdf-to-text") {
          const { pdfToText } = await import("@/lib/pdf/toolkit/text");
          output = await pdfToText(bytes, files[0].name, selection, job);
        } else if (workflow === "ocr") {
          const { recognizePdf } = await import("@/lib/pdf/toolkit/ocr");
          output = await recognizePdf(
            bytes,
            files[0].name,
            ocrLanguage,
            selection,
            job,
            textOutput,
          );
        } else if (workflow === "forms") {
          const { fillForm } = await import("@/lib/pdf/toolkit/forms");
          output = await fillForm(bytes, files[0].name, fields, flattenForm || flatten, job);
        } else {
          const { pdfToWord } = await import("@/lib/pdf/toolkit/office");
          output = await pdfToWord(bytes, files[0].name, wordMode, job);
        }
      }
      checkCancelled(controller.signal);
      if (!mounted.current) return;
      setResult(output);
      setProgress(100);
      trackUsageEvent("export_success", {
        source: slug,
        outputSizeBucket: fileSizeBucket(output.blob.size),
      });
    } catch (e) {
      if (mounted.current) {
        setError(
          controller.signal.aborted
            ? t("Processing cancelled. Your original file is unchanged.")
            : t(errorKey(e)),
        );
        setOfferScan(
          plainText && !controller.signal.aborted && e instanceof Error && e.message === "NO_SELECTABLE_TEXT",
        );
      }
      if (!controller.signal.aborted)
        trackUsageEvent("export_failed", { source: slug });
    } finally {
      if (mounted.current) setBusy(false);
      abort.current = null;
    }
  }

  async function continueTo(path: string, file: File) {
    setContinuing(true);
    try {
      const id = await storePendingUpload(file);
      window.location.assign(getLocalizedPath(locale, `${path}?uploadId=${encodeURIComponent(id)}`));
    } catch (e) {
      setError(t(errorKey(e)));
      setContinuing(false);
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      notify(t("Text copied."), "success");
    } catch {
      textPreview.current?.focus();
      textPreview.current?.select();
      notify(t("Select and copy the text manually."), "info");
    }
  }
  const hasArea =
    workflow === "crop"
      ? !!rect
      : workflow === "redact"
        ? Object.values(masks).some((r) => r.length) && confirmed
        : true;
  const ready =
    files.length > 0 &&
    !reading &&
    hasArea &&
    (workflow !== "forms" || (flattenForm ? fields.length > 0 : fields.some((f) => !f.readOnly)));
  return (
    <div className="p-1.5 sm:p-3">
      {!files.length && (
        <div
          {...dropProps}
          className={cn(
            "flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-[#b8ab9d] bg-paper px-4 py-6 text-center transition-colors sm:px-6 sm:py-8",
            dragging && "border-brand-500 bg-brand-50",
          )}
        >
          <FileUp aria-hidden="true" className="size-8 text-brand-700" />
          <h2 className="mt-4 text-xl font-semibold">
            {t(
              pngInput ? "Choose PNG images" : images
                ? "Choose JPG or PNG images"
                : wordInput
                  ? "Choose a Word document"
                  : "Drop your PDF here",
            )}
          </h2>
          {(images || wordInput) && (
            <p className="mt-2 max-w-md text-sm leading-6 text-muted">
              {t(images
                ? "Up to 50 images, 100 MB in total. Reorder before creating your PDF."
                : "DOCX files up to 30 MB. Conversion runs on this device.")}
            </p>
          )}
          <button
            className={`mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50`}
            disabled={reading}
            onClick={() => fileInput.current?.click()}
          >
            {reading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileUp className="h-4 w-4" />
            )}
            {t(reading ? "Reading document…" : images || wordInput ? "Choose files" : "Choose PDF")}
          </button>
        </div>
      )}
      <input
        ref={fileInput}
        type="file"
        accept={accept}
        multiple={images}
        aria-label={t("Choose files")}
        className="sr-only"
        disabled={busy || reading}
        onChange={(e) => {
          void choose(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      {files.length > 0 && (
        <fieldset disabled={busy || reading} className="min-w-0 space-y-5">
          <legend className="sr-only">{t("Tool options")}</legend>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="break-words text-sm font-semibold">
                {files.length === 1
                  ? files[0].name
                  : `${files.length} ${t("Images")}`}
              </p>
              {count > 0 && (
                <p className="mt-1 text-xs text-slate-600">
                  {count} {t("Pages")}
                </p>
              )}
            </div>
            <button
              className={button}
              title={t("Choose another file")}
              onClick={() => {
                generation.current++;
                setFiles([]);
                setBytes(null);
                invalidate();
              }}
            >
              <X className="h-4 w-4" />
              {t("Change file")}
            </button>
          </div>
          {images && (
            <>
              <ol className="max-h-64 space-y-2 overflow-y-auto">
                {files.map((f, i) => (
                  <li
                    key={`${f.name}-${i}`}
                    className="flex items-center gap-2 rounded border border-line p-2"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {i + 1}. {f.name}
                    </span>
                    <button
                      title={t("Move up")}
                      disabled={i === 0}
                      className={button}
                      onClick={() => {
                        const next = [...files];
                        [next[i - 1], next[i]] = [next[i], next[i - 1]];
                        setFiles(next);
                        invalidate();
                      }}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      title={t("Move down")}
                      disabled={i === files.length - 1}
                      className={button}
                      onClick={() => {
                        const next = [...files];
                        [next[i], next[i + 1]] = [next[i + 1], next[i]];
                        setFiles(next);
                        invalidate();
                      }}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      title={t("Remove image")}
                      className={button}
                      onClick={() => {
                        setFiles(files.filter((_, j) => i !== j));
                        invalidate();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ol>
              <label className="block text-sm font-semibold">
                {t("Page size")}
                <select
                  className={`${input} mt-2`}
                  value={imageSize}
                  onChange={(e) => {
                    setImageSize(e.target.value as "fit" | "a4");
                    invalidate();
                  }}
                >
                  <option value="a4">A4</option>
                  <option value="fit">{t("Fit image")}</option>
                </select>
              </label>
            </>
          )}
          {!images &&
            !wordInput &&
            workflow !== "redact" &&
            workflow !== "forms" &&
            workflow !== "pdf-to-word" && (
              <label className="block text-sm font-semibold">
                {t("Pages to process")}
                <input
                  className={`${input} mt-2`}
                  value={selection}
                  placeholder="1-3, 5"
                  onChange={(e) => {
                    setSelection(e.target.value);
                    invalidate();
                  }}
                />
                <span className="mt-1 block text-xs font-normal text-slate-600">
                  {t(
                    "Leave empty for all pages. Example: 1-3, 5. The entered order is preserved.",
                  )}
                </span>
              </label>
            )}
          {workflow === "rotate" && (
            <label className="block text-sm font-semibold">
              {t("Rotation")}
              <select
                className={`${input} mt-2`}
                value={angle}
                onChange={(e) => {
                  setAngle(Number(e.target.value));
                  invalidate();
                }}
              >
                {[90, 180, 270].map((a) => (
                  <option key={a} value={a}>
                    {a}°
                  </option>
                ))}
              </select>
            </label>
          )}
          {workflow === "pdf-to-images" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {t("Image format")}
                <select
                  className={`${input} mt-2`}
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value as "png" | "jpeg");
                    invalidate();
                  }}
                >
                  <option value="jpeg">JPG</option>
                  <option value="png">PNG</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {t("Resolution")}
                <select
                  className={`${input} mt-2`}
                  value={scale}
                  onChange={(e) => {
                    setScale(Number(e.target.value));
                    invalidate();
                  }}
                >
                  <option value={1.5}>108 DPI</option>
                  <option value={2}>144 DPI</option>
                  <option value={3}>216 DPI</option>
                </select>
              </label>
            </div>
          )}
          {workflow === "ocr" && (
            <label className="block text-sm font-semibold">
              {t("Document language")}
              <select
                className={`${input} mt-2`}
                value={ocrLanguage}
                onChange={(e) => {
                  setOcrLanguage(e.target.value as OcrLanguage);
                  invalidate();
                }}
              >
                {Object.entries(ocrLanguageLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <span className="mt-2 block text-xs font-normal text-slate-600">
                {t(
                  "Up to 20 pages. The language engine is downloaded from this site when needed. Recognition runs in a worker on your device.",
                )}
              </span>
            </label>
          )}
          {workflow === "pdf-to-word" && (
            <label className="block text-sm font-semibold">
              {t("Word format")}
              <select
                className={`${input} mt-2`}
                value={wordMode}
                onChange={(e) => {
                  setWordMode(e.target.value as "text" | "images");
                  invalidate();
                }}
              >
                <option value="text">{t("Editable text")}</option>
                <option value="images">
                  {t("Page images — preserve appearance")}
                </option>
              </select>
              <p className="mt-2 text-xs font-normal leading-5 text-slate-600">
                {t(
                  wordMode === "text"
                    ? "Editable text is reconstructed. Images are omitted; columns, tables and exact fonts are not preserved."
                    : "Word contains page images. The appearance is preserved; text is not editable.",
                )}
              </p>
            </label>
          )}
          {editingArea && bytes && (
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm font-semibold">
                {t("Preview page")}
                <select
                  className={input}
                  value={page}
                  onChange={(e) => setPage(Number(e.target.value))}
                >
                  {Array.from({ length: count }, (_, i) => (
                    <option value={i + 1} key={i}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </label>
              <PdfPreview
                bytes={bytes}
                page={page}
                mode={workflow as "crop" | "redact"}
                rects={
                  workflow === "crop"
                    ? rect
                      ? [rect]
                      : []
                    : (masks[page] ?? [])
                }
                onRect={addRect}
              />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(["x", "y", "width", "height"] as const).map((key) => (
                  <label key={key} className="text-xs font-semibold">
                    {t(
                      {
                        x: "Left (%)",
                        y: "Top (%)",
                        width: "Width (%)",
                        height: "Height (%)",
                      }[key],
                    )}
                    <input
                      className={`${input} mt-1`}
                      type="number"
                      min={0}
                      max={100}
                      value={manual[key]}
                      onChange={(e) =>
                        setManual({ ...manual, [key]: Number(e.target.value) })
                      }
                    />
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className={button}
                  onClick={() => {
                    const x = Math.max(0, Math.min(99, manual.x)),
                      y = Math.max(0, Math.min(99, manual.y));
                    addRect({
                      x: x / 100,
                      y: y / 100,
                      width: Math.max(1, Math.min(100 - x, manual.width)) / 100,
                      height:
                        Math.max(1, Math.min(100 - y, manual.height)) / 100,
                    });
                  }}
                >
                  {t("Add selected area")}
                </button>
                <button
                  className={button}
                  onClick={() => {
                    setConfirmed(false);
                    if (workflow === "crop") setRect(undefined);
                    else setMasks((current) => ({ ...current, [page]: [] }));
                    invalidate();
                  }}
                >
                  {t("Clear page selection")}
                </button>
              </div>
              {workflow === "redact" && (
                <>
                  <p className="text-sm font-semibold">
                    {t("Redaction areas")}:{" "}
                    {Object.values(masks).reduce(
                      (n, list) => n + list.length,
                      0,
                    )}
                  </p>
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6">
                    <p>
                      {t(
                        "Redaction creates a new image-only PDF. Original text layers, metadata, attachments, links and forms are not copied. Review every marked area before exporting.",
                      )}
                    </p>
                    <label className="mt-3 flex items-start gap-2 font-semibold">
                      <input
                        className="mt-1 h-5 w-5"
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                      />
                      {t(
                        "I reviewed the marked areas and understand the output is flattened.",
                      )}
                    </label>
                  </div>
                </>
              )}
              {workflow === "crop" && (
                <p className="text-xs leading-5 text-slate-600">
                  {t(
                    "The selected proportions apply to every chosen page. Cropping hides margins; it does not securely remove their contents.",
                  )}
                </p>
              )}
            </div>
          )}
          {workflow === "forms" && (
            <div className="space-y-4">
              {fields.length === 0 ? (
                <div className="rounded-md bg-amber-50 p-4 text-sm">
                  <p>
                    {t(
                      "No supported interactive fields were found. Use the editor to place text on a flat form.",
                    )}
                  </p>
                  <button
                    className={`${button} mt-3`}
                    disabled={continuing}
                    onClick={async () => {
                      setContinuing(true);
                      try {
                        const id = await storePendingUpload(files[0]);
                        window.location.assign(
                          getLocalizedPath(locale, `/editor?uploadId=${id}`),
                        );
                      } catch (e) {
                        setError(t(errorKey(e)));
                        setContinuing(false);
                      }
                    }}
                  >
                    {t("Open in editor")}
                  </button>
                </div>
              ) : (
                fields.map((field, index) => (
                  <label
                    key={field.name}
                    className="block text-sm font-semibold"
                  >
                    {field.name}
                    {field.kind === "check" ? (
                      <input
                        type="checkbox"
                        aria-label={field.name}
                        className="ml-3 h-5 w-5"
                        disabled={field.readOnly}
                        checked={Boolean(field.value)}
                        onChange={(e) => {
                          setFields(
                            fields.map((f, i) =>
                              i === index
                                ? { ...f, value: e.target.checked }
                                : f,
                            ),
                          );
                          invalidate();
                        }}
                      />
                    ) : field.kind === "choice" ? (
                      <select
                        aria-label={field.name}
                        className={`${input} mt-2`}
                        disabled={field.readOnly}
                        multiple={field.multiple}
                        value={
                          field.multiple
                            ? (field.value as string[])
                            : ((field.value as string[])[0] ?? "")
                        }
                        onChange={(e) => {
                          setFields(
                            fields.map((f, i) =>
                              i === index
                                ? {
                                    ...f,
                                    value: Array.from(e.target.selectedOptions)
                                      .map((o) => o.value)
                                      .filter(Boolean),
                                  }
                                : f,
                            ),
                          );
                          invalidate();
                        }}
                      >
                        {!field.multiple && (
                          <option value="">{t("Select an option")}</option>
                        )}
                        {field.options?.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <textarea
                        aria-label={field.name}
                        className={`${input} mt-2`}
                        rows={2}
                        disabled={field.readOnly}
                        maxLength={field.maxLength}
                        value={String(field.value)}
                        onChange={(e) => {
                          setFields(
                            fields.map((f, i) =>
                              i === index ? { ...f, value: e.target.value } : f,
                            ),
                          );
                          invalidate();
                        }}
                      />
                    )}
                  </label>
                ))
              )}
              {!flattenForm && fields.length > 0 && (
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={flatten}
                    onChange={(e) => {
                      setFlatten(e.target.checked);
                      invalidate();
                    }}
                  />
                  {t(
                    "Flatten completed fields so they are no longer interactive.",
                  )}
                </label>
              )}
            </div>
          )}
          <button
            className={cn(button, "w-full border-brand-600 bg-brand-600 text-white hover:bg-brand-700")}
            disabled={!ready}
            onClick={() => void run()}
          >
            {t(flattenForm ? "Flatten PDF form fields" : workflow === "redact" ? "Create redacted PDF" : "Create file")}
          </button>
        </fieldset>
      )}
      {busy && (
        <div role="status" className="mt-5 rounded-md bg-slate-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("Processing on your device…")} {progress}%
          </p>
          <progress
            className="mt-3 w-full"
            max={100}
            value={progress}
            aria-label={t("Processing progress")}
          />
          <button
            className={`${button} mt-3`}
            onClick={() => abort.current?.abort()}
          >
            {t("Cancel")}
          </button>
          <p className="mt-2 text-xs text-slate-600">
            {t("Cancellation may finish the current page before stopping.")}
          </p>
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-md border border-brand-100 bg-brand-50 p-3 text-sm leading-6 text-brand-700">
          <p role="alert">{error}</p>
          {offerScan && files[0] && (
            <button
              type="button"
              className="mt-2 min-h-10 text-left font-semibold underline"
              disabled={continuing}
              onClick={() => void continueTo(count > 20 ? "/extract-pdf-pages" : "/scanned-pdf-to-text", files[0])}
            >
              {t(count > 20 ? "Extract PDF pages" : "Convert scanned PDF to text")}
            </button>
          )}
        </div>
      )}
      {result && !busy && (
        <div className="mt-5 space-y-4 rounded-md border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="flex items-center gap-2 font-semibold text-emerald-950">
            <CheckCircle2 className="h-5 w-5" />
            {t("Ready to download")}
          </h3>
          <p className="break-all text-sm text-emerald-950">
            {result.name} ·{" "}
            {(result.blob.size / 1024).toLocaleString(locale, {
              maximumFractionDigits: 1,
            })}{" "}
            KB
          </p>
          {result.message && (
            <p className="text-sm leading-6 text-emerald-950">
              {t(result.message)}
            </p>
          )}
          <button
            className={`${button} w-full`}
            onClick={() => downloadBlob(result.blob, result.name)}
          >
            <Download className="h-4 w-4" />
            {t("Download file")}
          </button>
          {result.text !== undefined && (
            <>
              <details open={textOutput || undefined}>
                <summary className="cursor-pointer text-sm font-semibold">{textLabel}</summary>
                <textarea
                  ref={textPreview}
                  className={`${input} mt-3`}
                  readOnly
                  rows={8}
                  value={result.text}
                  aria-label={textLabel}
                />
                <button type="button" className={`${button} mt-2`} onClick={() => void copyText(result.text ?? "")}>
                  <Copy aria-hidden="true" size={16} />
                  {t("Copy text")}
                </button>
              </details>
              {!textOutput && <button
                className={button}
                onClick={() =>
                  downloadBlob(
                    new Blob([result.text!], {
                      type: "text/plain;charset=utf-8",
                    }),
                    `${fileBase(files[0].name)}.txt`,
                  )
                }
              >
                {t("Download text")}
              </button>}
            </>
          )}
          {result.blob.type === "application/pdf" && (
            <>
              <button
                className={button}
                onClick={async () => {
                  if (previewResult) {
                    setPreviewResult(null);
                    return;
                  }
                  try {
                    const data = await result.blob.arrayBuffer();
                    const pdf = await openPdf(data);
                    setOutputCount(pdf.numPages);
                    setOutputPage(1);
                    await pdf.destroy();
                    setPreviewResult(data);
                  } catch (e) {
                    setError(t(errorKey(e)));
                  }
                }}
              >
                {t("Preview output")}
              </button>
              {previewResult && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold">
                    {t("Preview page")}
                    <select
                      className={input}
                      value={outputPage}
                      onChange={(e) => setOutputPage(Number(e.target.value))}
                    >
                      {Array.from({ length: outputCount }, (_, i) => (
                        <option value={i + 1} key={i}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </label>
                  <PdfPreview bytes={previewResult} page={outputPage} />
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <select
                  className={`${input} flex-1`}
                  aria-label={t("Continue with another tool")}
                  value={nextTool}
                  onChange={(e) => setNextTool(e.target.value)}
                >
                  {[
                    ["/editor", "PDF Editor"],
                    ["/ocr-pdf", "OCR PDF"],
                    ["/pdf-to-text", "PDF to text"],
                    ["/pdf-to-word", "PDF to Word"],
                    ["/fill-pdf", "Fill PDF forms"],
                    ["/extract-pdf-pages", "Extract PDF pages"],
                    ["/merge-pdf", "Merge PDF"],
                    ["/compress-pdf", "Compress PDF"],
                  ]
                    .filter(([path]) => path !== `/${slug}`)
                    .map(([path, label]) => (
                      <option key={path} value={path}>
                        {t(label)}
                      </option>
                    ))}
                </select>
                <button
                  className={button}
                  disabled={continuing}
                  onClick={() => void continueTo(nextTool, new File([result.blob], result.name, { type: "application/pdf" }))}
                >
                  {t("Continue")}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
