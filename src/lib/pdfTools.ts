export type ToolCategory = "Edit" | "Sign" | "Annotate" | "Organize";

export type PdfTool = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  h1: string;
  intro: string;
  uploadTitle: string;
  uploadDescription: string;
  category: ToolCategory;
  priority: string;
  related: string[];
  steps: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export const activePdfTools: PdfTool[] = [
  {
    slug: "edit-pdf",
    title: "Edit PDF Online Free",
    shortTitle: "Edit PDF",
    description:
      "Edit a PDF online for free. Add text, edit existing text visually, sign, highlight, draw, add images, organize pages, and download your PDF.",
    h1: "Edit PDF Online Free",
    intro:
      "Make quick PDF changes directly in your browser. No account, no watermark, and no desktop software needed.",
    uploadTitle: "Drop your PDF to edit it",
    uploadDescription:
      "Upload a PDF and open the editor with text, signature, image, annotation, and page tools ready.",
    category: "Edit",
    priority: "1.0",
    related: ["edit-pdf-text", "add-text-to-pdf", "sign-pdf", "annotate-pdf"],
    steps: [
      "Upload your PDF from the browser.",
      "Use the toolbar to edit text, add objects, sign, annotate, or organize pages.",
      "Download a clean edited PDF when you are finished.",
    ],
    faqs: [
      {
        question: "Can I edit a PDF online for free?",
        answer:
          "Yes. MyFreePDFEditor lets you upload, edit, and export a PDF without paying for the core editing workflow.",
      },
      {
        question: "Do I need to install anything?",
        answer:
          "No. The editor runs in your browser, so you do not need Adobe Acrobat or desktop PDF software for common edits.",
      },
      {
        question: "Will my PDF have a watermark?",
        answer:
          "No. The core editor is built around free PDF editing without adding a watermark to your exported file.",
      },
    ],
  },
  {
    slug: "edit-pdf-text",
    title: "Edit PDF Text Online Free",
    shortTitle: "Edit PDF Text",
    description:
      "Edit existing PDF text online for free. Replace detected text visually and adjust size, color, boldness, and spacing before export.",
    h1: "Edit PDF Text Online Free",
    intro:
      "Click detected text in your PDF, replace it visually, and tune the styling from the editor properties panel.",
    uploadTitle: "Drop your PDF to edit text",
    uploadDescription:
      "Open a PDF in the editor and select existing text to create a matching editable replacement layer.",
    category: "Edit",
    priority: "0.95",
    related: ["edit-pdf", "add-text-to-pdf", "highlight-pdf", "draw-on-pdf"],
    steps: [
      "Upload the PDF with the text you want to change.",
      "Select detected text and edit the replacement layer visually.",
      "Adjust font size, boldness, spacing, color, and placement before downloading.",
    ],
    faqs: [
      {
        question: "Can I change existing text in a PDF?",
        answer:
          "Yes. The editor detects text on the PDF page and lets you create a visual replacement layer that is exported into the final PDF.",
      },
      {
        question: "Can I match the original font style?",
        answer:
          "You can adjust size, color, boldness, spacing, and placement to closely match the original text appearance.",
      },
      {
        question: "Is this useful for scanned PDFs?",
        answer:
          "Scanned PDFs need OCR before text can be detected. OCR is planned as a separate tool, while visual overlays can still be added manually.",
      },
    ],
  },
  {
    slug: "add-text-to-pdf",
    title: "Add Text to PDF Online Free",
    shortTitle: "Add Text",
    description:
      "Add text to a PDF online for free. Place new text boxes, style them, move them, and export a real edited PDF.",
    h1: "Add Text to PDF Online Free",
    intro:
      "Add labels, notes, names, dates, corrections, and form-like text boxes to any PDF page.",
    uploadTitle: "Drop your PDF to add text",
    uploadDescription:
      "Upload your document, click where text should appear, style it, and export the final PDF.",
    category: "Edit",
    priority: "0.9",
    related: ["edit-pdf", "edit-pdf-text", "sign-pdf", "fill-pdf"],
    steps: [
      "Upload the PDF you want to add text to.",
      "Choose the text tool and click on the page.",
      "Style and position the text box, then export your edited PDF.",
    ],
    faqs: [
      {
        question: "Can I add text boxes to a PDF?",
        answer:
          "Yes. You can add new text boxes, move them around the page, change styling, and include them in the exported PDF.",
      },
      {
        question: "Can I fill out a PDF form?",
        answer:
          "You can place text visually on form fields even when the PDF does not contain interactive form inputs.",
      },
      {
        question: "Can I change text color?",
        answer:
          "Yes. Text color can be adjusted from the editor properties panel.",
      },
    ],
  },
  {
    slug: "sign-pdf",
    title: "Sign PDF Online Free",
    shortTitle: "Sign PDF",
    description:
      "Sign a PDF online for free. Draw a signature or upload a signature image, place it on the PDF, and download the signed file.",
    h1: "Sign PDF Online Free",
    intro:
      "Add a signature to a PDF without printing, scanning, creating an account, or installing software.",
    uploadTitle: "Drop your PDF to sign it",
    uploadDescription:
      "Upload your PDF, add a drawn or image signature, resize it, and download the signed PDF.",
    category: "Sign",
    priority: "0.95",
    related: ["edit-pdf", "add-text-to-pdf", "annotate-pdf", "draw-on-pdf"],
    steps: [
      "Upload the PDF that needs a signature.",
      "Draw your signature or upload a signature image.",
      "Place it on the page and download the signed PDF.",
    ],
    faqs: [
      {
        question: "Can I sign a PDF without an account?",
        answer:
          "Yes. You can open the signing tool, place a signature, and export the PDF without creating an account.",
      },
      {
        question: "Can I upload a signature image?",
        answer:
          "Yes. The editor supports image uploads, so you can place a saved signature image on the PDF.",
      },
      {
        question: "Do I need to print the PDF?",
        answer:
          "No. You can sign the document visually in the browser and download the signed PDF.",
      },
    ],
  },
  {
    slug: "annotate-pdf",
    title: "Annotate PDF Online Free",
    shortTitle: "Annotate PDF",
    description:
      "Annotate a PDF online for free with text, highlights, drawings, shapes, and review notes in your browser.",
    h1: "Annotate PDF Online Free",
    intro:
      "Review a PDF with notes, marks, highlights, shapes, and freehand drawing tools.",
    uploadTitle: "Drop your PDF to annotate it",
    uploadDescription:
      "Open your PDF in the editor and add review comments, highlights, shapes, and drawings.",
    category: "Annotate",
    priority: "0.9",
    related: ["highlight-pdf", "draw-on-pdf", "edit-pdf", "add-text-to-pdf"],
    steps: [
      "Upload the PDF you want to review.",
      "Add notes, highlights, shapes, lines, or drawings.",
      "Export the annotated PDF for sharing or archiving.",
    ],
    faqs: [
      {
        question: "Can I annotate a PDF in my browser?",
        answer:
          "Yes. You can add visual annotations directly on the PDF page and export them into a new PDF file.",
      },
      {
        question: "Can I add review notes?",
        answer:
          "Yes. Use text boxes, shapes, highlights, and drawings to mark up the document.",
      },
      {
        question: "Are annotations included in the download?",
        answer:
          "Yes. Your annotations are embedded into the exported PDF.",
      },
    ],
  },
  {
    slug: "highlight-pdf",
    title: "Highlight PDF Online Free",
    shortTitle: "Highlight PDF",
    description:
      "Highlight a PDF online for free. Mark important passages and export the highlighted PDF from your browser.",
    h1: "Highlight PDF Online Free",
    intro:
      "Mark important text, sections, clauses, or review areas with simple PDF highlighting tools.",
    uploadTitle: "Drop your PDF to highlight it",
    uploadDescription:
      "Upload your PDF, add highlights where needed, and download the marked-up PDF.",
    category: "Annotate",
    priority: "0.88",
    related: ["annotate-pdf", "draw-on-pdf", "edit-pdf-text", "edit-pdf"],
    steps: [
      "Upload your PDF.",
      "Choose the highlight tool and mark the page.",
      "Download the highlighted PDF.",
    ],
    faqs: [
      {
        question: "Can I highlight text in a PDF?",
        answer:
          "Yes. You can place highlight marks on the PDF page and include them in the exported file.",
      },
      {
        question: "Can I use highlighting for document review?",
        answer:
          "Yes. Highlighting works well for contracts, study notes, forms, and review drafts.",
      },
      {
        question: "Does highlighting require signup?",
        answer:
          "No. You can start highlighting without creating an account.",
      },
    ],
  },
  {
    slug: "draw-on-pdf",
    title: "Draw on PDF Online Free",
    shortTitle: "Draw on PDF",
    description:
      "Draw on a PDF online for free. Add freehand marks, lines, shapes, and handwritten notes in your browser.",
    h1: "Draw on PDF Online Free",
    intro:
      "Use freehand drawing for quick notes, circles, arrows, corrections, and visual feedback.",
    uploadTitle: "Drop your PDF to draw on it",
    uploadDescription:
      "Upload your PDF, draw or mark up the page, and export the edited document.",
    category: "Annotate",
    priority: "0.85",
    related: ["annotate-pdf", "highlight-pdf", "sign-pdf", "edit-pdf"],
    steps: [
      "Upload your PDF.",
      "Use drawing tools to mark up the page.",
      "Download a PDF with your drawing embedded.",
    ],
    faqs: [
      {
        question: "Can I draw freehand on a PDF?",
        answer:
          "Yes. The editor includes drawing tools for handwritten notes and visual marks.",
      },
      {
        question: "Can I add lines and shapes?",
        answer:
          "Yes. You can add lines, rectangles, circles, and other visual marks for review workflows.",
      },
      {
        question: "Will the drawing be saved in the PDF?",
        answer:
          "Yes. Drawings are exported into the final PDF file.",
      },
    ],
  },
  {
    slug: "add-image-to-pdf",
    title: "Add Image to PDF Online Free",
    shortTitle: "Add Image",
    description:
      "Add an image to a PDF online for free. Insert JPG, PNG, or WebP images, resize them, and export the edited PDF.",
    h1: "Add Image to PDF Online Free",
    intro:
      "Place images, logos, stamps, screenshots, or signature files onto any PDF page.",
    uploadTitle: "Drop your PDF to add images",
    uploadDescription:
      "Upload your PDF, insert an image, position it on the page, and download the edited file.",
    category: "Edit",
    priority: "0.88",
    related: ["edit-pdf", "sign-pdf", "add-text-to-pdf", "annotate-pdf"],
    steps: [
      "Upload the PDF that needs an image.",
      "Insert a JPG, PNG, or WebP image.",
      "Move, resize, rotate, and export the edited PDF.",
    ],
    faqs: [
      {
        question: "Can I add a logo to a PDF?",
        answer:
          "Yes. You can upload an image file and place it anywhere on the PDF page.",
      },
      {
        question: "Which image formats are supported?",
        answer:
          "The editor is designed for common web image formats such as PNG, JPG, and WebP.",
      },
      {
        question: "Can I resize the image?",
        answer:
          "Yes. Images can be moved, resized, rotated, and layered before export.",
      },
    ],
  },
  {
    slug: "reorder-pdf-pages",
    title: "Reorder PDF Pages Online Free",
    shortTitle: "Reorder Pages",
    description:
      "Reorder PDF pages online for free. Move pages into the right order and export the updated PDF from your browser.",
    h1: "Reorder PDF Pages Online Free",
    intro:
      "Fix page order before sending, printing, archiving, or sharing your PDF.",
    uploadTitle: "Drop your PDF to reorder pages",
    uploadDescription:
      "Upload your PDF, use page thumbnails to organize pages, and download the updated file.",
    category: "Organize",
    priority: "0.82",
    related: ["delete-pdf-pages", "edit-pdf", "annotate-pdf", "add-text-to-pdf"],
    steps: [
      "Upload your PDF.",
      "Use the page sidebar to move pages into the right order.",
      "Export the reorganized PDF.",
    ],
    faqs: [
      {
        question: "Can I change the order of PDF pages?",
        answer:
          "Yes. The editor includes page controls for organizing the pages before export.",
      },
      {
        question: "Can I preview pages first?",
        answer:
          "Yes. Page thumbnails help you identify the page you want to move or edit.",
      },
      {
        question: "Does page reordering require an account?",
        answer:
          "No. You can start organizing a PDF without creating an account.",
      },
    ],
  },
  {
    slug: "delete-pdf-pages",
    title: "Delete PDF Pages Online Free",
    shortTitle: "Delete Pages",
    description:
      "Delete pages from a PDF online for free. Remove unwanted pages and download a cleaned-up PDF from your browser.",
    h1: "Delete PDF Pages Online Free",
    intro:
      "Remove blank pages, duplicates, old attachments, or pages you no longer need.",
    uploadTitle: "Drop your PDF to delete pages",
    uploadDescription:
      "Upload your PDF, select unwanted pages, delete them, and export the cleaned document.",
    category: "Organize",
    priority: "0.82",
    related: ["reorder-pdf-pages", "edit-pdf", "annotate-pdf", "highlight-pdf"],
    steps: [
      "Upload your PDF.",
      "Select unwanted pages from the page thumbnails.",
      "Delete them and download the final PDF.",
    ],
    faqs: [
      {
        question: "Can I remove pages from a PDF?",
        answer:
          "Yes. You can delete unwanted pages before exporting the final PDF.",
      },
      {
        question: "Can I delete blank pages?",
        answer:
          "Yes. Use the page thumbnails to find blank pages and remove them.",
      },
      {
        question: "Will the original file be changed?",
        answer:
          "No. The editor exports a new PDF, so your original local file remains untouched.",
      },
    ],
  },
];

export const plannedPdfTools = [
  "Merge PDF",
  "Split PDF",
  "Compress PDF",
  "OCR PDF",
  "Redact PDF",
  "Watermark PDF",
  "PDF to JPG",
  "JPG to PDF",
  "PDF to Word",
  "Word to PDF",
  "Rotate PDF",
  "Protect PDF",
  "Unlock PDF",
  "Add Page Numbers",
];

export function getToolBySlug(slug: string) {
  return activePdfTools.find((tool) => tool.slug === slug);
}

export function getRelatedTools(tool: PdfTool) {
  return tool.related
    .map((slug) => getToolBySlug(slug))
    .filter((relatedTool): relatedTool is PdfTool => Boolean(relatedTool));
}
