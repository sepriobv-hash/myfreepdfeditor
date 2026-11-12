// Reproduce the synthetic image used by the measured compression examples.
import { PDFDocument } from 'pdf-lib';
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
