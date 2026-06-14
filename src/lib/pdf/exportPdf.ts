import {
  degrees,
  PDFDocument,
  rgb,
  StandardFonts,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "pdf-lib";
import type { EditorObject, PageState, TextObject } from "@/types/editor";
import { canvasPointToPdf, canvasRectToPdf, hexToRgb01 } from "@/lib/pdf/coordinateUtils";
import { sanitizeFileName } from "@/lib/utils";

type FontCache = {
  regular: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
  boldItalic: PDFFont;
};

export async function exportEditedPdf({
  originalBytes,
  pages,
  fileName,
}: {
  originalBytes: ArrayBuffer;
  pages: PageState[];
  fileName: string;
}) {
  const source = await PDFDocument.load(originalBytes.slice(0));
  const output = await PDFDocument.create();
  const fontCache = {
    regular: await output.embedFont(StandardFonts.Helvetica),
    bold: await output.embedFont(StandardFonts.HelveticaBold),
    italic: await output.embedFont(StandardFonts.HelveticaOblique),
    boldItalic: await output.embedFont(StandardFonts.HelveticaBoldOblique),
  };

  const copiedPages = await output.copyPages(
    source,
    pages.map((page) => page.sourcePageIndex),
  );

  for (let index = 0; index < pages.length; index += 1) {
    const pageState = pages[index];
    const page = copiedPages[index];
    output.addPage(page);
    const objects = [...pageState.objects].sort((a, b) => a.zIndex - b.zIndex);
    for (const object of objects) {
      await drawEditorObject(page, object, fontCache);
    }
  }

  const bytes = await output.save();
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  const baseName = sanitizeFileName(fileName).replace(/\.pdf$/i, "");
  return {
    blob: new Blob([arrayBuffer], { type: "application/pdf" }),
    fileName: `${baseName || "document"}-edited.pdf`,
  };
}

async function drawEditorObject(
  page: PDFPage,
  object: EditorObject,
  fonts: FontCache,
) {
  if (object.type === "text") {
    drawTextObject(page, object, fonts);
    return;
  }

  if (object.type === "image" || object.type === "signature") {
    const image = await embedImage(page.doc, object.src, object.mimeType);
    if (!image) return;
    const rect = canvasRectToPdf(object, page.getSize());
    page.drawImage(image, {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      rotate: degrees(object.rotation),
      opacity: object.opacity,
    });
    return;
  }

  if (object.type === "highlight") {
    const rect = canvasRectToPdf(object, page.getSize());
    const color = hexToRgb01(object.fillColor);
    page.drawRectangle({
      ...rect,
      color: rgb(color.r, color.g, color.b),
      opacity: object.opacity,
    });
    return;
  }

  if (object.type === "rectangle") {
    const rect = canvasRectToPdf(object, page.getSize());
    const fill = hexToRgb01(object.fillColor);
    const stroke = hexToRgb01(object.strokeColor);
    page.drawRectangle({
      ...rect,
      color: object.fillColor.endsWith("00") ? undefined : rgb(fill.r, fill.g, fill.b),
      borderColor: rgb(stroke.r, stroke.g, stroke.b),
      borderWidth: object.strokeWidth,
      opacity: object.opacity,
      borderOpacity: object.opacity,
      rotate: degrees(object.rotation),
    });
    return;
  }

  if (object.type === "circle") {
    const center = canvasPointToPdf(
      { x: object.x + object.width / 2, y: object.y + object.height / 2 },
      page.getSize(),
    );
    const fill = hexToRgb01(object.fillColor);
    const stroke = hexToRgb01(object.strokeColor);
    page.drawEllipse({
      x: center.x,
      y: center.y,
      xScale: object.width / 2,
      yScale: object.height / 2,
      color: object.fillColor.endsWith("00") ? undefined : rgb(fill.r, fill.g, fill.b),
      borderColor: rgb(stroke.r, stroke.g, stroke.b),
      borderWidth: object.strokeWidth,
      opacity: object.opacity,
      borderOpacity: object.opacity,
      rotate: degrees(object.rotation),
    });
    return;
  }

  if (object.type === "line") {
    const [x1, y1, x2, y2] = object.points;
    const start = canvasPointToPdf({ x: object.x + x1, y: object.y + y1 }, page.getSize());
    const end = canvasPointToPdf({ x: object.x + x2, y: object.y + y2 }, page.getSize());
    const color = hexToRgb01(object.strokeColor);
    page.drawLine({
      start,
      end,
      thickness: object.strokeWidth,
      color: rgb(color.r, color.g, color.b),
      opacity: object.opacity,
    });
    return;
  }

  if (object.type === "drawing") {
    const color = hexToRgb01(object.strokeColor);
    for (let index = 1; index < object.points.length; index += 1) {
      const previous = object.points[index - 1];
      const current = object.points[index];
      page.drawLine({
        start: canvasPointToPdf(
          { x: object.x + previous.x, y: object.y + previous.y },
          page.getSize(),
        ),
        end: canvasPointToPdf({ x: object.x + current.x, y: object.y + current.y }, page.getSize()),
        thickness: object.strokeWidth,
        color: rgb(color.r, color.g, color.b),
        opacity: object.opacity,
      });
    }
  }
}

function drawTextObject(
  page: PDFPage,
  object: TextObject,
  fonts: FontCache,
) {
  const fontWeight = object.fontWeight ?? (object.bold ? 700 : 400);
  const font =
    fontWeight >= 600 && object.italic
      ? fonts.boldItalic
      : fontWeight >= 600
        ? fonts.bold
        : object.italic
          ? fonts.italic
          : fonts.regular;
  const color = hexToRgb01(object.color);
  const lines = object.text.split(/\r?\n/);
  const lineHeight = object.fontSize * 1.2;
  lines.forEach((line, index) => {
    const textWidth = getTextWidth(font, line, object.fontSize, object.characterSpacing);
    const alignedX =
      object.alignment === "center"
        ? object.x + Math.max(0, (object.width - textWidth) / 2)
        : object.alignment === "right"
          ? object.x + Math.max(0, object.width - textWidth)
          : object.x;
    const y = page.getHeight() - object.y - object.fontSize - index * lineHeight;
    if (Math.abs(object.characterSpacing) < 0.01 || line.length < 2) {
      page.drawText(line, {
        x: alignedX,
        y,
        size: object.fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
        opacity: object.opacity,
        maxWidth: object.width,
        rotate: degrees(object.rotation),
      });
      return;
    }

    let cursorX = alignedX;
    for (const character of line) {
      page.drawText(character, {
        x: cursorX,
        y,
        size: object.fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
        opacity: object.opacity,
        rotate: degrees(object.rotation),
      });
      cursorX += font.widthOfTextAtSize(character, object.fontSize) + object.characterSpacing;
    }
  });
}

function getTextWidth(font: PDFFont, text: string, fontSize: number, characterSpacing: number) {
  return font.widthOfTextAtSize(text, fontSize) + Math.max(0, text.length - 1) * characterSpacing;
}

async function embedImage(doc: PDFDocument, dataUrl: string, mimeType: string): Promise<PDFImage | null> {
  const bytes = dataUrlToUint8Array(dataUrl);
  if (mimeType === "image/png" || mimeType === "image/webp") {
    return doc.embedPng(bytes);
  }
  if (mimeType === "image/jpeg") {
    return doc.embedJpg(bytes);
  }
  return null;
}

function dataUrlToUint8Array(dataUrl: string) {
  const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}
