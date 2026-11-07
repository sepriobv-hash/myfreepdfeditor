import { additionalToolContent } from "./additionalPdfTools";
import { extraToolCopy } from "./extraToolCopy";
import { extraLocalePacks, type AddedLocale } from "./extraLocalePacks";
import { toolEducation } from "./toolEducation";
import type { PdfTool } from "./pdfTools";
import type { SupportedLocale } from "./i18n";
import { translators } from "./translations";
import names from "./translations/toolNames.json";
const instructions: Record<string, string> = {
  "edit-pdf": "Edit text, images, signatures and pages directly in your browser.",
  "edit-pdf-text": "Select detected text and adjust its visual replacement in Properties.",
  "sign-pdf": "Draw or upload your signature, place it on the PDF and download the result.",
  "merge-pdf": "Choose multiple PDFs, set their order, and combine every page into one downloadable document without leaving this page.",
  "compress-pdf": "Choose a quality level and let the browser compare lossless optimization with a smaller image-based copy before downloading the best result.",
  "add-text-to-pdf": "Choose the Text tool, click on the page and type your text in Properties.",
  "add-image-to-pdf": "Add a PNG, JPEG or WebP image, then resize and position it on the page.",
  "annotate-pdf": "Add text notes, shapes, drawings and highlights to your PDF.",
  "highlight-pdf": "Choose Highlight and drag over an area. Adjust color and opacity in Properties.",
  "reorder-pdf-pages": "Use the page sidebar to move pages up or down before downloading.",
  "delete-pdf-pages": "Remove unwanted pages in the sidebar and check the remaining pages before downloading.",
  "draw-on-pdf": "Choose Draw, drag on the page and adjust the stroke color and width.",
};
export function localizeTool(tool: PdfTool, locale: SupportedLocale): PdfTool {
  if (locale in extraToolCopy) {
    const entry = extraToolCopy[locale as AddedLocale][tool.slug];
    const pack = extraLocalePacks[locale as AddedLocale];
    if (!entry) throw new Error(`Missing localized tool: ${locale}/${tool.slug}`);
    return {
      ...tool,
      title: entry.title, h1: entry.title, shortTitle: entry.title,
      description: entry.description, intro: entry.description,
      uploadTitle: entry.title, uploadDescription: entry.description,
      useCase: `${entry.description} ${pack.tool[2]}`,
      limitation: pack.tool[3],
      steps: [pack.tool[4], pack.tool[5], pack.tool[6]],
      faqs: [
        { question: pack.tool[7], answer: pack.tool[8] },
        { question: pack.tool[9], answer: pack.tool[10] },
        { question: pack.tool[11], answer: pack.tool[3] },
      ],
    };
  }

  const t = translators[locale];
  const added = additionalToolContent.find(item => item.slug === tool.slug);
  if (added) return { ...tool, title:t(added.name), h1:t(added.name), shortTitle:t(added.name), intro:t(added.intro), description:t(added.intro), uploadTitle:t(added.name), uploadDescription:t(added.intro), useCase:t(added.example), limitation:t(added.limit), steps:[t("Choose files"), t(added.action), t("Review the result and download your file.")], faqs:[{question:t("What should I know before using this tool?"),answer:t(added.limit)},{question:t("Are my PDF files uploaded to a server?"),answer:t("PDF processing happens on your device. Temporary browser storage may be used to open a selected PDF in the editor.")},{question:t("Is this tool free?"),answer:t("Yes. No account is needed and no watermark is added to your PDF.")}] };
  const title = locale === "en" ? tool.title : (names[locale] as Record<string, string>)[tool.slug];
  if (!title || !instructions[tool.slug]) throw new Error(`Missing localized tool: ${locale}/${tool.slug}`);
  const intro = t(instructions[tool.slug]);
  const limitation = tool.workflow === "merge"
    ? "Merge up to 30 PDFs with a combined size below 250 MB. Unlock password-protected files first."
    : tool.workflow === "compress"
      ? "Compression supports up to 100 MB and 100 pages. Image-based compression can remove selectable text, links and form fields; lossless optimization preserves page content."
      : tool.slug === "sign-pdf"
        ? "A drawn or uploaded signature is a visual signature. This tool does not provide identity verification or a qualified electronic signature."
        : tool.slug === "delete-pdf-pages" ? "Keep at least one page in the document. Review the remaining thumbnails and export a new copy after deleting unwanted pages."
        : tool.slug === "reorder-pdf-pages" ? "The exported PDF follows the order shown in the sidebar. Inspect the thumbnails and final download; your original local file is not overwritten."
        : ["annotate-pdf", "draw-on-pdf", "highlight-pdf"].includes(tool.slug) ? "Notes, shapes and drawings are visual additions to the exported page. They are not a collaborative comment thread, OCR or secure redaction."
        : tool.slug === "add-image-to-pdf" ? "Add a PNG, JPEG or WebP image, then resize and position it on the page."
        : "Text replacement is visual, not secure redaction. Scanned documents do not have editable text without OCR. Keep your original file and check the downloaded copy.";
  return { ...tool, title, h1: title, shortTitle: locale === "en" ? tool.shortTitle : title, intro: locale === "en" ? tool.intro : intro, description: locale === "en" ? tool.description : intro,
    uploadTitle: t("Drop your PDF here"), uploadDescription: intro,
    useCase: t(toolEducation[tool.slug].useCase), limitation: t(limitation),
    steps: tool.workflow === "merge" ? [t("Choose two or more PDFs."), t("Use the up/down arrows to put files in the desired order."), t("Check the result and download your PDF.")]
      : tool.workflow === "compress" ? [t("Choose a PDF to compress"), t("Choose Strong, Balanced or High quality, then start compression."), t("Check the result and download your PDF.")]
      : [t("Open your PDF on this device."), intro, t("Check the result and download your PDF.")],
    faqs: [
      { question: t(toolEducation[tool.slug].question), answer: t(toolEducation[tool.slug].answer) },
      { question: t("Is this tool free?"), answer: t("Yes. No account is needed and no watermark is added to your PDF.") },
      { question: t("Are my PDF files uploaded to a server?"), answer: t("PDF processing happens on your device. Temporary browser storage may be used to open a selected PDF in the editor.") },
      { question: t("What should I know before using this tool?"), answer: t(limitation) },
    ],
  };
}
