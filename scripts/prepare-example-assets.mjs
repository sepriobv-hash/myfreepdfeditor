// Reproduce the synthetic image used by the measured compression examples.
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const directory = fileURLToPath(new URL('../public/examples/', import.meta.url));
const pdf = await PDFDocument.create();
pdf.setCreationDate(new Date('2026-01-01T00:00:00Z'));
pdf.setModificationDate(new Date('2026-01-01T00:00:00Z'));
const pixels = Buffer.alloc(1200 * 1600 * 3);
for (let y = 0; y < 1600; y++) for (let x = 0; x < 1200; x++) {
 const i = (y * 1200 + x) * 3;
 pixels[i] = x % 256; pixels[i + 1] = y % 256; pixels[i + 2] = (x + y) % 256;
}
const png = await sharp(pixels, {raw: {width: 1200, height: 1600, channels: 3}}).png().toBuffer();
const image = await pdf.embedPng(png);
pdf.addPage([612, 792]).drawImage(image, {x: 0, y: 0, width: 612, height: 792});
await mkdir(directory, {recursive: true});
await writeFile(directory + 'compression-sample.pdf', await pdf.save({useObjectStreams: false}));

const sample = await PDFDocument.create();
sample.setTitle("Project handoff checklist");
sample.setAuthor("MyFreePDFEditor");
sample.setCreationDate(new Date("2026-01-01T00:00:00Z"));
sample.setModificationDate(new Date("2026-01-01T00:00:00Z"));
const serif = await sample.embedFont(StandardFonts.TimesRoman);
const sans = await sample.embedFont(StandardFonts.Helvetica);
const bold = await sample.embedFont(StandardFonts.HelveticaBold);
const ink = rgb(0.16, 0.14, 0.13);
const grey = rgb(0.38, 0.34, 0.31);
const line = rgb(0.87, 0.83, 0.78);
const red = rgb(0.65, 0.18, 0.13);

function samplePage(number, title, subtitle) {
  const page = sample.addPage([595, 842]);
  page.drawText("PROJECT FILE  /  SAMPLE DOCUMENT", { x: 55, y: 777, size: 10, font: bold, color: red });
  page.drawText(title, { x: 55, y: 719, size: 37, font: serif, color: ink });
  page.drawText(subtitle, { x: 55, y: 681, size: 12, font: sans, color: grey });
  page.drawLine({ start: { x: 55, y: 650 }, end: { x: 540, y: 650 }, thickness: 1, color: line });
  page.drawLine({ start: { x: 55, y: 73 }, end: { x: 540, y: 73 }, thickness: 1, color: line });
  page.drawText("MyFreePDFEditor", { x: 55, y: 52, size: 10, font: bold, color: grey });
  page.drawText(`${number} / 2`, { x: 514, y: 52, size: 10, font: sans, color: grey });
  return page;
}

const checklist = samplePage(1, "Project handoff checklist", "A two-page document you can edit, sign or rearrange.");
checklist.drawText("Workspace update", { x: 55, y: 609, size: 20, font: serif, color: ink });
checklist.drawText("Project owner: Jamie Morgan", { x: 55, y: 574, size: 12, font: sans, color: ink });
checklist.drawText("Review date: 26 November 2026", { x: 55, y: 550, size: 12, font: sans, color: ink });
const tasks = [
  "Check the project details and record any corrections.",
  "Confirm final files are in the shared project folder.",
  "Review the notes and sign the approval page.",
];
tasks.forEach((task, index) => {
  const y = 477 - index * 44;
  checklist.drawRectangle({ x: 55, y: y - 2, width: 13, height: 13, borderWidth: 1, borderColor: grey });
  checklist.drawText(task, { x: 83, y, size: 12, font: sans, color: ink });
});
checklist.drawText("Notes", { x: 55, y: 294, size: 20, font: serif, color: ink });
for (const y of [263, 222, 181]) {
  checklist.drawLine({ start: { x: 55, y }, end: { x: 540, y }, thickness: 1, color: line });
}

const approval = samplePage(2, "Approval", "Sign below to confirm the project handoff.");
for (const [label, y] of [["Reviewed by", 540], ["Signature", 412], ["Date", 316]]) {
  approval.drawText(label, { x: 55, y: y + 35, size: 12, font: bold, color: ink });
  approval.drawLine({ start: { x: 55, y }, end: { x: 400, y }, thickness: 1, color: line });
}
await writeFile(directory + "editing-sample.pdf", await sample.save());
