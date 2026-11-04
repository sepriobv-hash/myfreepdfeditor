import {
  checkCancelled,
  fileBase,
  openPdf,
  parsePages,
  pdfOutput,
  releaseCanvas,
  renderPage,
  type Job,
} from "./core";
export const ocrLanguages = {
  en: "eng",
  nl: "nld",
  de: "deu",
  fr: "fra",
  es: "spa",
  it: "ita",
} as const;

function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const stop = () => reject(new DOMException("Cancelled", "AbortError"));
    if (signal.aborted) {
      stop();
      void promise.catch(() => {});
      return;
    }
    signal.addEventListener("abort", stop, { once: true });
    promise
      .then(resolve, reject)
      .finally(() => signal.removeEventListener("abort", stop));
  });
}

export async function recognizePdf(
  bytes: ArrayBuffer,
  name: string,
  language: keyof typeof ocrLanguages,
  selection: string,
  job: Job,
) {
  const source = await openPdf(bytes, 20);
  let worker:
    | Awaited<ReturnType<(typeof import("tesseract.js"))["createWorker"]>>
    | undefined;
  const stop = () => {
    void worker?.terminate().catch(() => {});
  };
  job.signal.addEventListener("abort", stop, { once: true });
  try {
    const pages = parsePages(selection, source.numPages);
    checkCancelled(job.signal);
    const { PDFDocument } = await import("pdf-lib");
    const out = await PDFDocument.create();
    let text = "",
      pageIndex = 0;
    const { createWorker } = await import("tesseract.js");
    const initialize = createWorker(ocrLanguages[language], 1, {
      workerPath: "/tool-assets/ocr/worker.min.js",
      corePath: "/tool-assets/ocr",
      langPath: "/tool-assets/ocr",
      workerBlobURL: false,
      logger: (message) => {
        if (!job.signal.aborted)
          job.progress(
            Math.min(
              99,
              ((pageIndex +
                (message.status === "recognizing text"
                  ? message.progress
                  : 0.05)) /
                pages.length) *
                100,
            ),
          );
      },
    }).then((value) => {
      worker = value;
      if (job.signal.aborted) stop();
      return value;
    });
    const active = await abortable(initialize, job.signal);
    await abortable(
      active.setParameters({ user_defined_dpi: "144" }),
      job.signal,
    );
    for (pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      checkCancelled(job.signal);
      const { canvas, natural } = await renderPage(
        await source.getPage(pages[pageIndex] + 1),
        2,
      );
      try {
        const result = await abortable(
          active.recognize(
            canvas,
            { pdfTitle: "", pdfTextOnly: false },
            { text: true, pdf: true },
          ),
          job.signal,
        );
        checkCancelled(job.signal);
        if (!result.data.pdf) throw new Error("OCR PDF unavailable");
        const pagePdf = await PDFDocument.load(new Uint8Array(result.data.pdf));
        const [page] = await out.copyPages(pagePdf, [0]);
        page.scale(
          natural.width / page.getWidth(),
          natural.height / page.getHeight(),
        );
        out.addPage(page);
        text += result.data.text + "\n\n";
      } finally {
        releaseCanvas(canvas);
      }
    }
    checkCancelled(job.signal);
    job.progress(100);
    return {
      ...pdfOutput(await out.save(), `${fileBase(name)}-searchable.pdf`),
      text,
      message:
        "OCR can misread text. Review names, numbers and the downloaded PDF.",
    };
  } finally {
    job.signal.removeEventListener("abort", stop);
    if (worker) await worker.terminate().catch(() => {});
    await source.destroy();
  }
}
