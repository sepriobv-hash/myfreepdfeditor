import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

export async function createDigitalPdf(pageCount = 1) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let index = 0; index < pageCount; index += 1) {
    const page = pdf.addPage([612, 792]);
    page.drawText(`Editable invoice page ${index + 1}`, {
      x: 72,
      y: 700,
      size: 18,
      font,
      color: rgb(0.12, 0.16, 0.21),
    });
  }
  return Buffer.from(await pdf.save());
}

export async function createRotatedPdf() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  page.setRotation(degrees(90));
  page.drawText("Rotated page", { x: 72, y: 700, size: 18 });
  return Buffer.from(await pdf.save());
}

export async function createFormPdf() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const field = pdf.getForm().createTextField("full_name");
  field.setText("Example User");
  field.addToPage(page, { x: 72, y: 650, width: 240, height: 32 });
  return Buffer.from(await pdf.save());
}

export async function createScannedLikePdf() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  page.drawRectangle({ x: 48, y: 80, width: 516, height: 640, color: rgb(0.94, 0.94, 0.94) });
  page.drawRectangle({ x: 90, y: 620, width: 320, height: 18, color: rgb(0.35, 0.35, 0.35) });
  return Buffer.from(await pdf.save());
}
