# MyFreePDFEditor — free online PDF tools

[MyFreePDFEditor](https://www.myfreepdfeditor.com/) offers free PDF editing, signing, merging, compression and page tools without an account or watermark. Document processing runs on your device.

Built with Next.js, TypeScript, Tailwind CSS, PDF.js, pdf-lib, Konva and Zustand.

## Features

- Landing page with drag-and-drop PDF upload
- Full-screen PDF editor layout
- PDF.js page rendering and thumbnails
- Page selection, deletion, duplication, and reorder controls
- Browser-local PDF merge with file reordering
- Adjustable PDF compression with lossless and image-based output selection
- Text, image, drawing, highlight, rectangle, circle, line, and signature overlays
- Move, resize, rotate, duplicate, delete, bring-forward, and send-backward controls
- Undo/redo and keyboard shortcuts
- Client-side export with pdf-lib into a real edited PDF
- SEO landing pages for active PDF tools, privacy, security, and local processing

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verify

```bash
npm run typecheck
npm run build
```

## Notes

The editor uses visual overlay editing. Existing PDF text is preserved in the original page content; new edits are added as exported PDF objects. Use the dedicated redaction tool to remove marked sensitive areas in a flattened copy. OCR recognizes printed text in English, Dutch, German, French, Spanish and Italian. Review exported files before sharing.

Files are processed in browser memory by default. No upload API route is required for the core editor workflow.

## Useful tools

- [Extract PDF pages](https://www.myfreepdfeditor.com/extract-pdf-pages) — keep selected pages in your chosen order.
- [OCR PDF](https://www.myfreepdfeditor.com/ocr-pdf) — make scanned pages searchable.
- [Scan to text](https://www.myfreepdfeditor.com/scanned-pdf-to-text) — download recognized text as TXT.
- [Redact PDF](https://www.myfreepdfeditor.com/redact-pdf) — remove marked sensitive areas in a flattened copy.
- [All PDF tools](https://www.myfreepdfeditor.com/all-tools).
