import {
  canvasBytes,
  checkCancelled,
  checkFont,
  documentFont,
  fileBase,
  openPdf,
  pdfOutput,
  releaseCanvas,
  renderPage,
  type Job,
  type Output,
} from "./core";
import type { PDFPage } from "pdf-lib";
import type { JSZipObject, JSZipStreamHelper } from "jszip";

export async function pdfToWord(
  bytes: ArrayBuffer,
  name: string,
  mode: "text" | "images",
  job: Job,
): Promise<Output> {
  const source = await openPdf(bytes, 50);
  const docx = await import("docx");
  const sections: ConstructorParameters<
    typeof docx.Document
  >[0]["sections"][number][] = [];
  let totalText = 0;
  try {
    for (let i = 1; i <= source.numPages; i++) {
      checkCancelled(job.signal);
      const page = await source.getPage(i);
      const viewport = page.getViewport({ scale: 1 });
      const children: InstanceType<typeof docx.Paragraph>[] = [];
      if (mode === "images") {
        const { canvas } = await renderPage(page, 1.5);
        try {
          children.push(
            new docx.Paragraph({
              spacing: { after: 0, line: 1 },
              children: [
                new docx.ImageRun({
                  type: "png",
                  data: await canvasBytes(canvas),
                  transformation: {
                    width: viewport.width / 0.75,
                    height: (viewport.height - 2) / 0.75,
                  },
                }),
              ],
            }),
          );
        } finally {
          releaseCanvas(canvas);
        }
      } else {
        const content = await page.getTextContent();
        const lines = new Map<
          number,
          { x: number; text: string; size: number }[]
        >();
        for (const item of content.items) {
          if (!("str" in item) || !item.str.trim()) continue;
          const [a, b] = viewport.convertToViewportPoint(
            item.transform[4],
            item.transform[5],
          );
          const y = Math.round(b / 3) * 3;
          const row = lines.get(y) ?? [];
          row.push({
            x: a,
            text: item.str,
            size: Math.max(8, Math.min(36, Math.abs(item.transform[3]) || 12)),
          });
          lines.set(y, row);
          totalText += item.str.length;
        }
        for (const [, runs] of [...lines.entries()].sort((a, b) => a[0] - b[0]))
          children.push(
            new docx.Paragraph({
              spacing: { after: 100 },
              children: runs
                .sort((a, b) => a.x - b.x)
                .map(
                  (run, index) =>
                    new docx.TextRun({
                      text: (index ? " " : "") + run.text,
                      size: Math.round(run.size * 2),
                    }),
                ),
            }),
          );
        if (children.length === 0) children.push(new docx.Paragraph(""));
      }
      sections.push({
        properties: {
          page: {
            size: {
              width: Math.round(viewport.width * 20),
              height: Math.round(viewport.height * 20),
            },
            margin: {
              top: mode === "images" ? 0 : 720,
              bottom: mode === "images" ? 0 : 720,
              left: mode === "images" ? 0 : 720,
              right: mode === "images" ? 0 : 720,
            },
          },
        },
        children,
      });
      job.progress((i / source.numPages) * 95);
    }
  } finally {
    await source.destroy();
  }
  if (mode === "text" && !totalText) throw new Error("NO_TEXT");
  checkCancelled(job.signal);
  const blob = await docx.Packer.toBlob(
    new docx.Document({ creator: "", title: "", sections }),
  );
  job.progress(100);
  return {
    blob,
    name: `${fileBase(name)}.docx`,
    message:
      mode === "text"
        ? "Editable text is reconstructed. Images are omitted; columns, tables and exact fonts are not preserved."
        : "Word contains page images. The appearance is preserved; text is not editable.",
  };
}

// Limit archive expansion before asking JSZip to inflate untrusted DOCX parts.
export function checkDocxArchive(buffer: ArrayBuffer) {
  const v = new DataView(buffer);
  let end = -1;
  for (let i = v.byteLength - 22; i >= Math.max(0, v.byteLength - 65557); i--)
    if (v.getUint32(i, true) === 0x06054b50) {
      end = i;
      break;
    }
  if (end < 0) throw new Error("INVALID_DOCX");
  const count = v.getUint16(end + 10, true);
  let offset = v.getUint32(end + 16, true),
    total = 0;
  if (count > 2000 || count === 65535) throw new Error("LIMIT");
  for (let i = 0; i < count; i++) {
    if (offset + 46 > v.byteLength || v.getUint32(offset, true) !== 0x02014b50)
      throw new Error("INVALID_DOCX");
    const size = v.getUint32(offset + 24, true);
    total += size;
    if (size > 30 * 1024 * 1024 || total > 150 * 1024 * 1024)
      throw new Error("LIMIT");
    offset +=
      46 +
      v.getUint16(offset + 28, true) +
      v.getUint16(offset + 30, true) +
      v.getUint16(offset + 32, true);
  }
}
const ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
function attr(element: Element | undefined | null, name: string) {
  return (
    element?.getAttributeNS(ns, name) ??
    element?.getAttribute(`w:${name}`) ??
    ""
  );
}
function xmlDocument(value: string) {
  if (/<!DOCTYPE|<!ENTITY/i.test(value)) throw new Error("INVALID_DOCX");
  const xml = new DOMParser().parseFromString(value, "application/xml");
  if (xml.getElementsByTagName("parsererror").length)
    throw new Error("INVALID_DOCX");
  return xml;
}
function elements(node: Element | Document, tag: string) {
  return Array.from(node.getElementsByTagNameNS(ns, tag));
}
type Run = { text: string; bold: boolean; size: number };
function paragraphRuns(p: Element): Run[] {
  const heading = attr(elements(p, "pStyle")[0], "val");
  const defaultSize = /heading1/i.test(heading)
    ? 22
    : /heading2/i.test(heading)
      ? 17
      : 11;
  const runs = elements(p, "r").map((r) => ({
    text: Array.from(r.children)
      .map((n) =>
        n.localName === "t"
          ? (n.textContent ?? "")
          : n.localName === "tab"
            ? "    "
            : n.localName === "br"
              ? "\n"
              : "",
      )
      .join(""),
    bold:
      elements(r, "b").some((b) => !["0", "false"].includes(attr(b, "val"))) ||
      /heading/i.test(heading),
    size: Math.max(
      6,
      Math.min(
        72,
        Number(attr(elements(r, "sz")[0], "val")) / 2 || defaultSize,
      ),
    ),
  }));
  if (elements(p, "numPr").length)
    runs.unshift({ text: "• ", bold: false, size: defaultSize });
  return runs;
}

export async function wordToPdf(
  bytes: ArrayBuffer,
  name: string,
  job: Job,
): Promise<Output> {
  if (bytes.byteLength > 30 * 1024 * 1024) throw new Error("LIMIT");
  checkDocxArchive(bytes);
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(bytes);
  // Bound actual inflated bytes, even when an archive lies about its directory sizes.
  let expandedBytes = 0;
  function readPart(entry: JSZipObject): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      let length = 0,
        failed = false;
      // JSZip exposes this streaming method at runtime but omits it from JSZipObject types.
      const stream = (
        entry as JSZipObject & {
          internalStream(type: "uint8array"): JSZipStreamHelper<Uint8Array>;
        }
      ).internalStream("uint8array");
      stream.on("data", (chunk) => {
        if (failed) return;
        length += chunk.length;
        expandedBytes += chunk.length;
        if (
          length > 30 * 1024 * 1024 ||
          expandedBytes > 150 * 1024 * 1024 ||
          job.signal.aborted
        ) {
          failed = true;
          stream.pause();
          reject(
            job.signal.aborted
              ? new DOMException("Cancelled", "AbortError")
              : new Error("LIMIT"),
          );
          return;
        }
        chunks.push(chunk);
      });
      stream.on("error", reject);
      stream.on("end", () => {
        if (failed) return;
        const result = new Uint8Array(length);
        let offset = 0;
        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.length;
        }
        resolve(result);
      });
      stream.resume();
    });
  }
  const entry = zip.file("word/document.xml");
  if (!entry) throw new Error("INVALID_DOCX");
  const document = xmlDocument(new TextDecoder().decode(await readPart(entry)));
  const body = elements(document, "body")[0];
  if (!body) throw new Error("INVALID_DOCX");
  const { PDFDocument, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const normal = await documentFont(pdf),
    bold = await documentFont(pdf, true);
  const size = elements(document, "pgSz")[0];
  const width = Math.min(
      1600,
      Math.max(200, Number(attr(size, "w")) / 20 || 595.28),
    ),
    height = Math.min(
      2000,
      Math.max(200, Number(attr(size, "h")) / 20 || 841.89),
    );
  const margins = elements(document, "pgMar")[0];
  const left = Math.min(width / 3, Number(attr(margins, "left")) / 20 || 48),
    right = Math.min(width / 3, Number(attr(margins, "right")) / 20 || 48),
    top = Math.min(height / 3, Number(attr(margins, "top")) / 20 || 48),
    bottom = Math.min(height / 3, Number(attr(margins, "bottom")) / 20 || 48);
  let page: PDFPage = pdf.addPage([width, height]),
    y = height - top;
  const newPage = () => {
    if (pdf.getPageCount() >= 100) throw new Error("LIMIT");
    page = pdf.addPage([width, height]);
    y = height - top;
  };
  function ensure(h: number) {
    if (y - h < bottom) newPage();
  }
  const fontFor = (run: Run) => (run.bold ? bold : normal);
  function drawRuns(
    runs: Run[],
    x: number,
    maxWidth: number,
    measure = false,
  ): number {
    let dx = 0,
      used = 0;
    const lineHeight = Math.max(14, ...runs.map((r) => r.size * 1.35));
    for (const run of runs) {
      const font = fontFor(run);
      checkFont(font, run.text);
      for (const word of run.text.split(/(\s+)/)) {
        if (!word) continue;
        let parts = [word];
        if (font.widthOfTextAtSize(word, run.size) > maxWidth)
          parts = [...word];
        for (const part of parts) {
          const lineBreak = part.includes("\n");
          const w = font.widthOfTextAtSize(part.replace(/\s/g, " "), run.size);
          if (lineBreak || dx + w > maxWidth) {
            used += lineHeight;
            dx = 0;
            if (!measure) {
              y -= lineHeight;
              ensure(lineHeight);
            }
            if (lineBreak) continue;
          }
          if (!measure) {
            ensure(lineHeight);
            page.drawText(part.replace(/\s/g, " "), {
              x: x + dx,
              y: y - run.size,
              size: run.size,
              font,
              color: rgb(0.06, 0.08, 0.12),
            });
          }
          dx += w;
        }
      }
    }
    return used + lineHeight;
  }
  const relEntry = zip.file("word/_rels/document.xml.rels");
  const rels = relEntry
    ? xmlDocument(new TextDecoder().decode(await readPart(relEntry)))
    : undefined;
  async function drawImages(p: Element) {
    for (const blip of Array.from(
      p.getElementsByTagNameNS(
        "http://schemas.openxmlformats.org/drawingml/2006/main",
        "blip",
      ),
    )) {
      const id = blip.getAttributeNS(
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        "embed",
      );
      const rel = rels
        ? Array.from(rels.documentElement.children).find(
            (r) => r.getAttribute("Id") === id,
          )
        : undefined;
      const target = rel?.getAttribute("Target");
      if (
        !target ||
        rel?.getAttribute("TargetMode") === "External" ||
        !/^media\/[\w .()%-]+\.(png|jpe?g)$/i.test(target)
      )
        continue;
      const imageEntry = zip.file("word/" + target);
      if (!imageEntry) continue;
      const imageBytes = await readPart(imageEntry);
      const img = /\.png$/i.test(target)
        ? await pdf.embedPng(imageBytes)
        : await pdf.embedJpg(imageBytes);
      const scale = Math.min(
        1,
        (width - left - right) / img.width,
        (height - top - bottom - 20) / img.height,
      );
      ensure(img.height * scale + 10);
      page.drawImage(img, {
        x: left,
        y: y - img.height * scale,
        width: img.width * scale,
        height: img.height * scale,
      });
      y -= img.height * scale + 10;
    }
  }
  for (let i = 0; i < body.children.length; i++) {
    checkCancelled(job.signal);
    const block = body.children[i];
    if (block.localName === "p") {
      if (
        elements(block, "br").some((br) => attr(br, "type") === "page") &&
        y !== height - top
      )
        newPage();
      const runs = paragraphRuns(block);
      const consumed = drawRuns(runs, left, width - left - right);
      y -= Math.max(14, ...runs.map((r) => r.size * 1.35)) + 6;
      if (!consumed) y -= 14;
      await drawImages(block);
    } else if (block.localName === "tbl") {
      for (const row of Array.from(block.children).filter(
        (n) => n.localName === "tr",
      )) {
        const cells = Array.from(row.children).filter(
          (n) => n.localName === "tc",
        );
        if (!cells.length) continue;
        const cellWidth = (width - left - right) / cells.length;
        const runs = cells.map((cell) =>
          elements(cell, "p").flatMap((p, index) => [
            ...(index ? [{ text: "\n", size: 11, bold: false }] : []),
            ...paragraphRuns(p),
          ]),
        );
        const h =
          Math.max(
            ...runs.map((r) => drawRuns(r, left, cellWidth - 12, true)),
          ) + 12;
        if (h > height - top - bottom) throw new Error("LIMIT");
        ensure(h);
        const rowY = y;
        for (let c = 0; c < cells.length; c++) {
          page.drawRectangle({
            x: left + c * cellWidth,
            y: rowY - h,
            width: cellWidth,
            height: h,
            borderWidth: 0.5,
            borderColor: rgb(0.7, 0.72, 0.75),
          });
          y = rowY - 6;
          drawRuns(runs[c], left + c * cellWidth + 6, cellWidth - 12);
        }
        y = rowY - h;
      }
      y -= 8;
    }
    job.progress(((i + 1) / body.children.length) * 95);
  }
  checkCancelled(job.signal);
  job.progress(100);
  return {
    ...pdfOutput(await pdf.save(), `${fileBase(name)}.pdf`),
    message:
      "Text, basic tables and inline PNG/JPEG images are converted. Headers, footers and exact Word layout are not preserved. Review the PDF before sharing.",
  };
}
