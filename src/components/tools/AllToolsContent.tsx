import { activePdfTools } from "@/lib/pdfTools";
import { localizeTool } from "@/lib/localizedTools";
import { translators } from "@/lib/translations";
import { getLocalizedPath, type SupportedLocale } from "@/lib/i18n";
import { ToolHeader } from "./ToolHeader";
import { ToolDirectory } from "./ToolDirectory";

const categoryOrder = ["Edit", "Organize", "Convert", "Sign", "Annotate", "Optimize", "Protect"] as const;

// Short, complete actions distinguish similar tools even on narrow screens.
const directoryDescriptions: Record<string, string> = {
  "edit-pdf": "Edit text, images and pages in one workspace.",
  "edit-pdf-text": "Replace existing text on the page.",
  "add-text-to-pdf": "Place a new text box anywhere on a page.",
  "add-image-to-pdf": "Insert a photo or logo into a document.",
  "fill-pdf": "Fill in interactive fields and checkboxes.",
  "flatten-pdf-form": "Fix completed form values onto the page.",
  "merge-pdf": "Combine several PDFs into one file.",
  "reorder-pdf-pages": "Change the order of pages in a document.",
  "delete-pdf-pages": "Remove unwanted pages from a PDF.",
  "split-pdf": "Save each selected page as its own PDF.",
  "extract-pdf-pages": "Save a selection of pages together in one PDF.",
  "rotate-pdf": "Turn sideways or upside-down pages upright.",
  "crop-pdf": "Trim the visible edges of a page.",
  "duplicate-pdf-pages": "Repeat a page inside the same document.",
  "jpg-to-pdf": "Arrange JPG photos on PDF pages.",
  "png-to-pdf": "Combine PNG screenshots into a PDF.",
  "pdf-to-jpg": "Download pages as JPG photos.",
  "pdf-to-png": "Export crisp PNG images of selected pages.",
  "ocr-pdf": "Make scanned pages searchable.",
  "scanned-pdf-to-text": "Download recognized text as a TXT file.",
  "pdf-to-word": "Convert a PDF into a Word document.",
  "word-to-pdf": "Save a DOCX document as a PDF.",
  "sign-pdf": "Draw or place your signature on a page.",
  "annotate-pdf": "Mark up a document with notes and drawings.",
  "highlight-pdf": "Mark important passages with color.",
  "draw-on-pdf": "Draw freehand on a page.",
  "add-shapes-to-pdf": "Draw rectangles, circles and lines.",
  "compress-pdf": "Reduce the file size for sharing or uploads.",
  "redact-pdf": "Permanently remove the areas you mark.",
};

export default function AllToolsContent({ locale = "en" }: { locale?: SupportedLocale }) {
  const t = translators[locale];
  const groups = categoryOrder.map(category => ({
    category,
    label: t(category),
    tools: activePdfTools.filter(tool => tool.category === category)
      .sort((a, b) => Number(b.priority) - Number(a.priority))
      .map(tool => localizeTool(tool, locale))
      .map(tool => ({ slug: tool.slug, href: getLocalizedPath(locale, `/${tool.slug}`), name: tool.shortTitle, description: directoryDescriptions[tool.slug] ? t(directoryDescriptions[tool.slug]) : tool.intro })),
  }));
  return (
    <main className="min-h-screen bg-mist text-ink">
      <ToolHeader locale={locale} path="/all-tools" languageLabel={t("Language")} />
      <ToolDirectory groups={groups} heading={t("All PDF tools")} searchLabel={t("Search tools")} categoryLabel={t("Category")}
        allLabel={t("All tools")} emptyLabel={t("No matching tools")} clearLabel={t("Clear filters")} />
    </main>
  );
}
