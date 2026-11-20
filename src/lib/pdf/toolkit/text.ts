import { checkCancelled, fileBase, openPdf, parsePages, type Job, type Output } from "./core";

export async function pdfToText(
  bytes: ArrayBuffer,
  name: string,
  selection: string,
  job: Job,
): Promise<Output> {
  checkCancelled(job.signal);
  const pdf = await openPdf(bytes);
  try {
    const pages = parsePages(selection, pdf.numPages);
    const pageTexts: string[] = [];

    for (const [index, pageNumber] of pages.entries()) {
      checkCancelled(job.signal);
      const page = await pdf.getPage(pageNumber + 1);
      const { items } = await page.getTextContent();
      checkCancelled(job.signal);
      const lines = items.flatMap(item => "str" in item ? [item.str, item.hasEOL ? "\n" : ""] : []);
      pageTexts.push(lines.join("").replace(/[ \t]+(?=\n|$)/g, "").trim());
      job.progress(((index + 1) / pages.length) * 100);
    }

    if (!pageTexts.some(Boolean)) throw new Error("NO_SELECTABLE_TEXT");
    const text = pageTexts.join("\n\n").trim() + "\n";
    return {
      blob: new Blob([text], { type: "text/plain;charset=utf-8" }),
      name: `${fileBase(name)}.txt`,
      text,
      message: pageTexts.some(page => !page)
        ? "Some selected pages have no selectable text. Use scan-to-text if they are scans."
        : undefined,
    };
  } finally {
    await pdf.destroy();
  }
}
