import {
  canvasBytes,
  checkCancelled,
  fileBase,
  openPdf,
  parsePages,
  pdfOutput,
  releaseCanvas,
  renderPage,
  zipOutputs,
  type Rect,
  type Job,
  type Output,
} from "./core";

export async function pageOperation(
  bytes: ArrayBuffer,
  name: string,
  mode: "extract" | "split" | "rotate" | "crop",
  selection: string,
  angle: number,
  rect: Rect | undefined,
  job: Job,
): Promise<Output> {
  const { PDFDocument, degrees } = await import("pdf-lib");
  const source = await PDFDocument.load(bytes.slice(0));
  if (source.getPageCount() > 100) throw new Error("LIMIT");
  const pages = parsePages(selection, source.getPageCount());
  checkCancelled(job.signal);
  if (mode === "extract" || mode === "split") {
    const groups = mode === "extract" ? [pages] : pages.map((page) => [page]);
    const results: Output[] = [];
    for (let i = 0; i < groups.length; i++) {
      checkCancelled(job.signal);
      const out = await PDFDocument.create();
      for (const page of await out.copyPages(source, groups[i]))
        out.addPage(page);
      results.push(
        pdfOutput(
          await out.save(),
          `${fileBase(name)}-${mode === "extract" ? "extracted" : `page-${groups[i][0] + 1}`}.pdf`,
        ),
      );
      job.progress(((i + 1) / groups.length) * 100);
    }
    return results.length === 1
      ? results[0]
      : zipOutputs(results, `${fileBase(name)}-pages.zip`);
  }
  if (mode === "rotate")
    for (const index of pages) {
      const p = source.getPage(index);
      p.setRotation(
        degrees((((p.getRotation().angle + angle) % 360) + 360) % 360),
      );
    }
  if (mode === "crop") {
    if (!rect || rect.width < 0.005 || rect.height < 0.005)
      throw new Error("Draw a crop area");
    const doc = await openPdf(bytes);
    try {
      for (const index of pages) {
        checkCancelled(job.signal);
        const view = (await doc.getPage(index + 1)).getViewport({ scale: 1 });
        const [x1, y1] = view.convertToPdfPoint(
          rect.x * view.width,
          rect.y * view.height,
        );
        const [x2, y2] = view.convertToPdfPoint(
          (rect.x + rect.width) * view.width,
          (rect.y + rect.height) * view.height,
        );
        source
          .getPage(index)
          .setCropBox(
            Math.min(x1, x2),
            Math.min(y1, y2),
            Math.abs(x2 - x1),
            Math.abs(y2 - y1),
          );
      }
    } finally {
      await doc.destroy();
    }
  }
  job.progress(100);
  return pdfOutput(
    await source.save(),
    `${fileBase(name)}-${mode === "rotate" ? "rotated" : "cropped"}.pdf`,
  );
}

export async function pdfToImages(
  bytes: ArrayBuffer,
  name: string,
  selection: string,
  format: "png" | "jpeg",
  scale: number,
  job: Job,
): Promise<Output> {
  const source = await openPdf(bytes);
  const files: Output[] = [];
  try {
    const pages = parsePages(selection, source.numPages);
    for (let i = 0; i < pages.length; i++) {
      checkCancelled(job.signal);
      const { canvas } = await renderPage(
        await source.getPage(pages[i] + 1),
        scale,
      );
      try {
        files.push({
          blob: new Blob(
            [new Uint8Array(await canvasBytes(canvas, `image/${format}`))],
            { type: `image/${format}` },
          ),
          name: `${fileBase(name)}-page-${pages[i] + 1}.${format === "jpeg" ? "jpg" : "png"}`,
        });
      } finally {
        releaseCanvas(canvas);
      }
      job.progress(((i + 1) / pages.length) * 100);
    }
  } finally {
    await source.destroy();
  }
  return files.length === 1
    ? files[0]
    : zipOutputs(files, `${fileBase(name)}-images.zip`);
}

export async function imagesToPdf(
  files: File[],
  size: "fit" | "a4",
  job: Job,
): Promise<Output> {
  if (
    !files.length ||
    files.length > 50 ||
    files.reduce((n, f) => n + f.size, 0) > 100 * 1024 * 1024
  )
    throw new Error("LIMIT");
  const { PDFDocument } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    checkCancelled(job.signal);
    const bitmap = await createImageBitmap(files[i]);
    if (bitmap.width * bitmap.height > 40_000_000) {
      bitmap.close();
      throw new Error("LIMIT");
    }
    const factor = Math.min(1, 3000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * factor);
    canvas.height = Math.round(bitmap.height * factor);
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    try {
      const image = await pdf.embedPng(await canvasBytes(canvas));
      const landscape = image.width > image.height;
      const dims: sizeDims =
        size === "a4"
          ? landscape
            ? [841.89, 595.28]
            : [595.28, 841.89]
          : [image.width * 0.75, image.height * 0.75];
      const page = pdf.addPage(dims);
      const margin = size === "a4" ? 24 : 0;
      const scale = Math.min(
        (dims[0] - margin * 2) / image.width,
        (dims[1] - margin * 2) / image.height,
      );
      page.drawImage(image, {
        x: (dims[0] - image.width * scale) / 2,
        y: (dims[1] - image.height * scale) / 2,
        width: image.width * scale,
        height: image.height * scale,
      });
    } finally {
      releaseCanvas(canvas);
    }
    job.progress(((i + 1) / files.length) * 100);
  }
  return pdfOutput(await pdf.save(), "images.pdf");
}
type sizeDims = [number, number];

// Build a new raster-only PDF. Never copy source PDF objects, metadata, fields,
// attachments or hidden text into a redacted result. PNG avoids JPEG edge bleed.
export async function redactPdf(
  bytes: ArrayBuffer,
  name: string,
  masks: Record<number, Rect[]>,
  job: Job,
): Promise<Output> {
  if (!Object.values(masks).some((list) => list.length))
    throw new Error("No redaction selected");
  const source = await openPdf(bytes, 50);
  const { PDFDocument } = await import("pdf-lib");
  const out = await PDFDocument.create();
  try {
    for (let i = 1; i <= source.numPages; i++) {
      checkCancelled(job.signal);
      const { canvas, context, natural } = await renderPage(
        await source.getPage(i),
        2,
      );
      try {
        for (const r of masks[i] ?? []) {
          context.fillStyle = "#000";
          context.fillRect(
            Math.floor(r.x * canvas.width) - 2,
            Math.floor(r.y * canvas.height) - 2,
            Math.ceil(r.width * canvas.width) + 4,
            Math.ceil(r.height * canvas.height) + 4,
          );
        }
        const image = await out.embedPng(await canvasBytes(canvas));
        const page = out.addPage([natural.width, natural.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: natural.width,
          height: natural.height,
        });
      } finally {
        releaseCanvas(canvas);
      }
      job.progress((i / source.numPages) * 100);
    }
  } finally {
    await source.destroy();
  }
  out.setTitle("");
  out.setAuthor("");
  out.setSubject("");
  out.setKeywords([]);
  return pdfOutput(await out.save(), `${fileBase(name)}-redacted.pdf`);
}
