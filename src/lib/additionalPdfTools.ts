import type { PdfTool } from "./pdfTools";
export const additionalToolContent = [
  {
    slug: "split-pdf",
    example:
      "Separate a scanned bundle of receipts into individual PDF files for your bookkeeping.",
    workflow: "split",
    category: "Organize",
    name: "Split PDF",
    intro:
      "Save each selected PDF page as a separate file. Download multiple pages together in one ZIP.",
    limit:
      "Up to 100 pages and 100 MB. A single selected page downloads as a PDF; multiple pages download as a ZIP.",
    action: "Choose the pages you need, then create the separate PDF files.",
  },
  {
    slug: "extract-pdf-pages",
    example:
      "Send only the relevant pages of a long contract or report, in the order the recipient needs.",
    workflow: "extract",
    category: "Organize",
    name: "Extract PDF pages",
    intro:
      "Create one new PDF containing only the pages you need, in the order you choose.",
    limit:
      "Up to 100 pages and 100 MB. Page numbers start at 1. Your original PDF is unchanged.",
    action:
      "Enter page numbers or ranges, check their order and create your PDF.",
  },
  {
    slug: "jpg-to-pdf",
    example:
      "Combine phone photos of receipts into one PDF for an expense claim.",
    workflow: "images-to-pdf",
    category: "Convert",
    name: "JPG to PDF",
    intro:
      "Turn JPG photos into a single PDF. Arrange the photos and choose A4 pages or a page size that fits each image.",
    limit:
      "Up to 50 JPG or PNG images and 100 MB in total. Large images are resized to a maximum of 3000 pixels per side.",
    action: "Choose your images, reorder them and select the page size.",
  },
  {
    slug: "pdf-to-jpg",
    example:
      "Save a product sheet as a JPG for a website that accepts photos.",
    workflow: "pdf-to-images",
    category: "Convert",
    name: "PDF to JPG",
    intro:
      "Save selected PDF pages as JPG photos. Download a single image or a ZIP containing one image per page.",
    limit:
      "Up to 100 pages and 100 MB. Multiple images download as a ZIP. Large pages are capped at 3000 pixels per side.",
    action:
      "Choose the pages, image format and resolution, then create the images.",
  },
  {
    slug: "rotate-pdf",
    example:
      "Correct one sideways scan while leaving the other pages at their current orientation.",
    workflow: "rotate",
    category: "Organize",
    name: "Rotate PDF",
    intro:
      "Fix sideways or upside-down PDF pages. Rotate selected pages by 90, 180 or 270 degrees.",
    limit:
      "Up to 100 pages and 100 MB. Rotation preserves existing page content and selectable text.",
    action:
      "Choose the pages and rotation angle, then download the corrected PDF.",
  },
  {
    slug: "crop-pdf",
    example:
      "Trim scanner borders or excess white margins before presenting a document.",
    workflow: "crop",
    category: "Organize",
    name: "Crop PDF",
    intro:
      "Trim visible margins from a PDF. Select a crop area on the preview and apply it to your chosen pages.",
    limit:
      "Cropping changes the visible page area. Hidden content remains in the file; use redaction to remove sensitive information.",
    action:
      "Select the pages, draw the area to keep and review the exported PDF.",
  },
  {
    slug: "ocr-pdf",
    example:
      "Make a scanned invoice searchable and copy its recognized text into another document.",
    workflow: "ocr",
    category: "Convert",
    name: "OCR PDF",
    intro:
      "Turn scanned PDF pages into a searchable PDF and downloadable text, using recognition on your device.",
    limit:
      "Up to 20 pages and 100 MB. English, Dutch, German, French, Spanish and Italian are supported. Review recognition errors.",
    action:
      "Choose the document language and pages, then recognize and review the text.",
  },
  {
    slug: "fill-pdf",
    example:
      "Complete a registration form with a name, checked options and dropdown choices.",
    workflow: "forms",
    category: "Edit",
    name: "Fill PDF forms",
    intro:
      "Complete interactive text fields, checkboxes and choices. Keep the fields editable or flatten the finished form.",
    limit:
      "Standard AcroForm fields are supported. XFA and certificate signing are not supported. Use the editor for flat forms.",
    action:
      "Fill the detected fields, choose whether to flatten them and download your form.",
  },
  {
    slug: "redact-pdf",
    example:
      "Hide addresses or account numbers before sharing a contract. Check every page for other sensitive information.",
    workflow: "redact",
    category: "Protect",
    name: "Redact PDF",
    intro:
      "Mark sensitive areas and create a new flattened PDF that excludes the original text layers and attachments.",
    limit:
      "Up to 50 pages and 100 MB. All output pages become images, so selectable text, links and interactive forms are removed.",
    action:
      "Mark every sensitive area, review the masks and create the redacted copy.",
  },
  {
    slug: "pdf-to-word",
    example:
      "Reuse the text of an old proposal in Word, or place its page images in a DOCX for visual reference.",
    workflow: "pdf-to-word",
    category: "Convert",
    name: "PDF to Word",
    intro:
      "Convert a PDF to DOCX with reconstructed editable text, or preserve the page appearance as images in Word.",
    limit:
      "Up to 50 pages and 100 MB. Editable conversion can change layout and does not reconstruct complex tables. Scans need OCR first.",
    action:
      "Choose editable text or page images, convert and review the Word document.",
  },
  {
    slug: "word-to-pdf",
    example:
      "Export a simple Word letter or invoice as a PDF, then check the text, table and image placement.",
    workflow: "word-to-pdf",
    category: "Convert",
    name: "Word to PDF",
    intro:
      "Convert a DOCX document to PDF locally, including text, basic tables and embedded PNG or JPEG images.",
    limit:
      "DOCX files up to 30 MB. Headers, footers and floating layout are not preserved. Review complex documents carefully. Older DOC files are not supported.",
    action:
      "Choose a DOCX file, create the PDF and review the output before sharing.",
  },
  {
    slug: "png-to-pdf",
    workflow: "images-to-pdf",
    category: "Convert",
    name: "PNG to PDF",
    intro: "Combine PNG screenshots or graphics into one PDF, with one image per page and a white background behind transparent areas.",
    example: "Put a sequence of screenshots into a PDF to illustrate a support request.",
    limit: "Choose up to 50 PNG files, with a total size of up to 100 MB. The longest image edge is limited to 3000 pixels.",
    action: "Choose your images, reorder them and select the page size.",
  },
  {
    slug: "pdf-to-png",
    workflow: "pdf-to-images",
    category: "Convert",
    name: "PDF to PNG",
    intro: "Export PDF pages as PNG images to keep small text and line drawings clear. Choose the pages and resolution before downloading.",
    example: "Export a diagram from a report as a PNG for a slide.",
    limit: "Up to 100 pages and 100 MB. Multiple images download as a ZIP. Large pages are capped at 3000 pixels per side.",
    action: "Choose the pages, image format and resolution, then create the images.",
  },
  {
    slug: "duplicate-pdf-pages",
    workflow: "editor",
    category: "Organize",
    name: "Duplicate PDF pages",
    intro: "Make a copy of a page inside the same PDF and move it into position before exporting.",
    example: "Repeat a worksheet for several participants in one handout.",
    limit: "The copy appears directly after the original page. Use the arrows to move it.",
    action: "Use Duplicate page below the thumbnail, then check the order and download the PDF.",
  },
  {
    slug: "add-shapes-to-pdf",
    workflow: "editor",
    category: "Annotate",
    name: "Add shapes to PDF",
    intro: "Place rectangles, circles and lines on a PDF page. Adjust their position and appearance before downloading.",
    example: "Circle a detail on a floor plan or draw a box around a figure in a report.",
    limit: "Shapes sit over the original content. Use the redaction tool to remove sensitive information.",
    action: "Choose a shape and drag across the page to draw it.",
  },
  {
    slug: "flatten-pdf-form",
    workflow: "forms",
    category: "Edit",
    name: "Flatten PDF form fields",
    intro: "Save a copy of a completed PDF form with its field values fixed on the page.",
    example: "Keep a fixed copy of a completed registration form for your records.",
    limit: "Standard AcroForm fields are supported. XFA and certificate signing are not supported. Use the editor for flat forms.",
    action: "Check the field values, then download a flattened copy.",
  },
  {
    slug: "scanned-pdf-to-text",
    workflow: "ocr",
    category: "Convert",
    name: "Convert scanned PDF to text",
    intro: "Recognize the text on scanned pages and download a plain TXT file for copying, searching or editing.",
    example: "Copy a paragraph from a scanned letter into a message.",
    limit: "Up to 20 pages and 100 MB. English, Dutch, German, French, Spanish and Italian are supported. Review recognition errors.",
    action: "Choose the document language and pages, then recognize and review the text.",
  },
] as const;
const relatedTools: Record<string, string[]> = {
  "png-to-pdf": ["jpg-to-pdf", "pdf-to-png", "merge-pdf"],
  "pdf-to-png": ["png-to-pdf", "pdf-to-jpg", "crop-pdf"],
  "duplicate-pdf-pages": ["reorder-pdf-pages", "extract-pdf-pages", "delete-pdf-pages"],
  "add-shapes-to-pdf": ["annotate-pdf", "draw-on-pdf", "highlight-pdf"],
  "flatten-pdf-form": ["fill-pdf", "sign-pdf", "edit-pdf"],
  "scanned-pdf-to-text": ["ocr-pdf", "pdf-to-word", "edit-pdf-text"],
  "split-pdf": ["merge-pdf", "extract-pdf-pages", "reorder-pdf-pages"],
  "extract-pdf-pages": ["split-pdf", "delete-pdf-pages", "merge-pdf"],
  "jpg-to-pdf": ["png-to-pdf", "pdf-to-jpg", "merge-pdf"],
  "pdf-to-jpg": ["pdf-to-png", "jpg-to-pdf", "crop-pdf"],
  "rotate-pdf": ["crop-pdf", "reorder-pdf-pages", "extract-pdf-pages"],
  "crop-pdf": ["redact-pdf", "rotate-pdf", "compress-pdf"],
  "ocr-pdf": ["scanned-pdf-to-text", "pdf-to-word", "edit-pdf-text", "compress-pdf"],
  "fill-pdf": ["flatten-pdf-form", "sign-pdf", "add-text-to-pdf", "edit-pdf"],
  "redact-pdf": ["compress-pdf", "edit-pdf", "extract-pdf-pages"],
  "pdf-to-word": ["ocr-pdf", "word-to-pdf", "edit-pdf-text"],
  "word-to-pdf": ["pdf-to-word", "merge-pdf", "compress-pdf"],
};
export const additionalPdfTools: PdfTool[] = additionalToolContent.map(
  (tool) => ({
    slug: tool.slug,
    workflow: tool.workflow,
    category: tool.category,
    title: tool.name,
    h1: tool.name,
    shortTitle: tool.name,
    description: tool.intro,
    intro: tool.intro,
    uploadTitle: tool.name,
    uploadDescription: tool.intro,
    priority: "0.8",
    related: relatedTools[tool.slug],
    steps: [
      "Choose files",
      tool.action,
      "Check the result and download your PDF.",
    ],
    faqs: [],
    useCase: tool.example,
    limitation: tool.limit,
  }),
);
