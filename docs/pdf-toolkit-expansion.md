# PDF toolkit expansion

This release expands MyFreePDFEditor from 12 to 23 tools. The focus is finishing common document tasks locally, with a consistent upload, options, review, download and continuation flow. It adds 66 localized tool URLs to the existing 114 public URLs, for 180 indexable pages. The editor stays noindex.

## Delivered workflows

| Tool | Output and important behavior |
| --- | --- |
| Split PDF | One PDF per selected page; ZIP for multiple files |
| Extract PDF pages | A single PDF in the exact entered page order |
| JPG/PNG to PDF | Reorder images; fit-image or A4 pages; white transparency background |
| PDF to JPG/PNG | Selected pages and resolution; ZIP for multiple images |
| Rotate PDF | 90°, 180° or 270° on selected pages; preserves page content |
| Crop PDF | Visual crop plus keyboard percentage controls; understands rotated pages |
| OCR PDF | Searchable PDF and TXT; English, Dutch, German, French, Spanish and Italian |
| Fill PDF forms | AcroForm text, checkbox, dropdown, list and radio fields; optional flattening |
| Redact PDF | Fresh raster-only PDF with opaque masks; never copies original PDF objects |
| PDF to Word | Reconstructed editable text, or page images inside DOCX |
| Word to PDF | Local DOCX paragraphs, basic tables, bold text and inline PNG/JPEG images |
| Target compression | 100 KB, 500 KB, 1 MB, 2 MB and 5 MB targets; explicit reached/not-reached result; lossless-only option |

Every new tool has English, Dutch, German, French, Spanish and Italian UI, server-rendered content, metadata, canonical URLs and hreflang. Shared route registration includes them in the sitemap and directory. Homepage discovery links and related tools retain the current locale. Outputs can continue into another tool via temporary, single-use IndexedDB handoff.

## Deliberate product limits

- PDF operations generally accept up to 100 pages / 100 MiB. OCR is limited to 20 pages; redaction and PDF-to-Word to 50. Image input accepts 50 files / 100 MiB total, with a 40-million-pixel per-image guard and 3000-pixel maximum export edge. DOCX input is limited to 30 MiB.
- Cropping changes the visible page box. It does **not** remove hidden content. Its UI directs sensitive-data removal to redaction.
- Redaction flattens **every** output page. Selectable text, original metadata, forms, links and attachments are excluded. Only areas the user marks are masked. Users must inspect every page, including visible headers or footers, before sharing. This is region-based redaction, not automatic sensitive-information detection.
- OCR may misread names and numbers. All language models and worker/WASM files are served from this site; recognition uses a local worker. Cancellation returns control without exposing a partial result.
- AcroForms are supported; XFA and certificate signatures are not. Flat forms can continue directly into the editor. Read-only fields remain read-only. Fonts cover the supported Western European languages; unsupported glyphs produce a clear error.
- Word conversion is intentionally bounded. It is suitable for basic document reuse and simple letters/invoices. It does not reproduce complex Word layouts, headers/footers, floating objects, or PDF tables. Image mode preserves PDF appearance but does not make text editable. Image-only PDFs require OCR before editable conversion.
- Target compression tries progressively smaller raster settings, retaining the smallest result found and never returning a larger copy than the input. The chosen target is not guaranteed. The lossless option preserves text and forms and may miss a tight target. Raster compression trades those features for size; the result identifies flattening.
- Input files remain unchanged. Memory, malformed files or unsupported features can still cause an explicit error within the documented limits. This release does not claim every possible PDF/Word file is supported.

## Implementation and privacy

`ToolkitPanel` shares upload validation, generation tokens, progress, cancellation, localized errors, output review and file handoff. Processing lives in independent page, OCR, form and office modules. PDF previews prevent area selection until the correct page is rendered. Output preview supports every page.

DOCX conversion reads ZIP/XML directly and does not inject document HTML. External relationships are not fetched, DTD/entity declarations are rejected, and both declared archive sizes and actual streamed inflation are bounded (30 MiB per entry, 150 MiB total, 2000 entries). Only embedded supported raster images are read.

The new analytics events use existing size buckets and tool slugs; they exclude names, file bytes, form values and recognized text. Synthetic OCR testing also checks for external requests and accidental document content in POST bodies.

`scripts/prepare-tool-assets.mjs` creates ignored runtime files from exact npm dependencies before development/build. Vercel serves them as static assets. No 55 MB binary bundle is committed to Git. Worker and language files are downloaded on demand, not with the homepage. OCR public language models may be cached locally; document images and text are not stored in that model cache.

## Verification

Browser coverage is in `tests/e2e/toolkit.spec.ts`; translation coverage in `tests/e2e/toolkit-translations.spec.ts`. Existing SEO, editor, compression and six-language navigation tests remain in the regression suite. CI installs Poppler for independent exported-PDF text inspection and tests the production build.

- `npm run build`: passes, including lint and TypeScript validation, on Next.js 15.5.29.
- `PLAYWRIGHT_PRODUCTION=1 npm run test:e2e:chromium -- --retries=0`: **45 passed** (2.6 minutes).
- Export checks include page order/count/rotation, image formats and colors, Unicode form values and flattening without stale widget references, removal of text/metadata/attachments during redaction, opaque redaction pixels, searchable OCR and TXT, OCR-to-Word handoff, DOCX text/tables/images, invalid XML/archives, bounded actual ZIP inflation, and reached/unreached compression targets.
- Locale checks cover every published tool/information route in all five non-English languages, native language navigation/back-forward/reload, and Dutch mobile completion. New visible strings, error messages and result messages are checked against every translation catalog.
- Visual review covers Dutch mobile controls, redaction page review, and Word conversion. Production tests assert the primary action is visibly colored and narrow screens do not overflow.
- `npm audit`: **0 high / 0 critical** findings after patching existing dependencies. Six moderate findings remain in development-only TypeScript ESLint/minimatch dependencies; see `validation/toolkit-dependencies.json`.
- Generated OCR/font assets are verified as local responses. The synthetic OCR test observes no external requests and no document contents in POST bodies.

Production verification completed on the deployed merge commit `17dd55c38d059d316a5973e78993e8c724ce93d9` (PR #11): GitHub CI and Vercel succeeded. All **180** public URLs returned 200 with correct language, canonical, reciprocal alternates and one H1; no duplicate titles/descriptions were found. Sitemap and robots returned 200; invalid routes returned 404. Evidence: `validation/production-seo.json`.

Five additional browser tests passed against `https://www.myfreepdfeditor.com` (1.9 minutes): extraction/splitting downloads, redaction output, Word-to-PDF output, Dutch mobile continuation, and local OCR/font assets. The managed verification proxy's certificate was explicitly trusted in the temporary test configuration; application TLS settings were unchanged.
