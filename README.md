# PDF Studio Web

A browser-first PDF editor MVP built with Next.js, TypeScript, Tailwind CSS, PDF.js, pdf-lib, Konva, and Zustand.

## Features

- Landing page with drag-and-drop PDF upload
- Full-screen PDF editor layout
- PDF.js page rendering and thumbnails
- Page selection, deletion, duplication, and reorder controls
- Text, image, drawing, highlight, rectangle, circle, line, and signature overlays
- Move, resize, rotate, duplicate, delete, bring-forward, and send-backward controls
- Undo/redo and keyboard shortcuts
- Client-side export with pdf-lib into a real edited PDF
- Privacy and pricing placeholder pages for SaaS expansion

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

The MVP uses visual overlay editing. Existing PDF text is preserved in the original page content; new edits are added as exported PDF objects. Direct editing of existing PDF text, OCR, compression, cloud storage, authentication, Stripe subscriptions, and team workspaces are prepared as future product areas.

Files are processed in browser memory by default. No upload API route is required for the MVP.
