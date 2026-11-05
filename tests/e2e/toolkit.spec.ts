import { test, expect, type Page } from "@playwright/test";
import { PDFDocument, PDFName } from "pdf-lib";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
} from "docx";
import JSZip from "jszip";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createDigitalPdf, createScannedLikePdf } from "./fixtures";

const textOf = (bytes: Buffer) =>
  execFileSync("pdftotext", ["-", "-"], { input: bytes }).toString();
async function upload(
  page: Page,
  route: string,
  buffer: Buffer,
  name = "sample.pdf",
) {
  await page.goto(route);
  await page.locator("input[type=file]").setInputFiles({
    name,
    mimeType: name.endsWith(".pdf")
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    buffer,
  });
  await expect(
    page.getByRole("button", { name: "Change file", exact: true }),
  ).toBeVisible();
}
async function download(page: Page, label = "Download file") {
  const wait = page.waitForEvent("download");
  await page.getByRole("button", { name: label, exact: true }).click();
  return readFile((await (await wait).path())!);
}
async function create(page: Page) {
  await expect(page.getByRole("button", {name:"Create file",exact:true})).not.toHaveCSS("background-color", "rgb(255, 255, 255)");
  await page.getByRole("button", { name: "Create file", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Ready to download", exact: true }),
  ).toBeVisible({ timeout: 90000 });
}
async function scannedInvoice() {
  const png = await sharp(
    Buffer.from(
      '<svg width="1200" height="1600" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="white"/><text x="100" y="200" font-family="sans-serif" font-size="64" fill="black">HELLO INVOICE 104</text><text x="100" y="320" font-family="sans-serif" font-size="48" fill="black">Payment total 250</text></svg>',
    ),
  )
    .png()
    .toBuffer();
  const pdf = await PDFDocument.create();
  const image = await pdf.embedPng(png);
  pdf
    .addPage([600, 800])
    .drawImage(image, { x: 0, y: 0, width: 600, height: 800 });
  return Buffer.from(await pdf.save());
}

test("extract preserves entered page order and split creates independent PDFs", async ({
  page,
}) => {
  const input = await createDigitalPdf(3);
  await upload(page, "/extract-pdf-pages", input);
  await page.getByLabel("Pages to process").fill("3,1");
  await create(page);
  const extracted = await download(page);
  expect((await PDFDocument.load(extracted)).getPageCount()).toBe(2);
  expect(textOf(extracted).indexOf("page 3")).toBeLessThan(
    textOf(extracted).indexOf("page 1"),
  );
  await page.getByLabel("Pages to process").fill("1,1");
  await page.getByRole("button", { name: "Create file", exact: true }).click();
  await expect(page.locator("p[role=alert]")).toContainText(
    "Pages cannot be repeated",
  );
  await upload(page, "/split-pdf", input);
  await create(page);
  const zip = await JSZip.loadAsync(await download(page));
  expect(Object.keys(zip.files)).toHaveLength(3);
  for (const entry of Object.values(zip.files)) {
    const bytes = await entry.async("nodebuffer");
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
  }
});

test("image conversion preserves ordering, dimensions and exports PNG and JPG", async ({
  page,
}) => {
  const red = await sharp({
    create: { width: 300, height: 200, channels: 3, background: "#ff0000" },
  })
    .png()
    .toBuffer();
  const blue = await sharp({
    create: { width: 200, height: 300, channels: 3, background: "#0000ff" },
  })
    .jpeg()
    .toBuffer();
  await page.goto("/jpg-to-pdf");
  await page.locator("input[type=file]").setInputFiles([
    { name: "red.png", mimeType: "image/png", buffer: red },
    { name: "blue.jpg", mimeType: "image/jpeg", buffer: blue },
  ]);
  await page.getByTitle("Move down", { exact: true }).first().click();
  await page.getByLabel("Page size").selectOption("fit");
  await create(page);
  const output = await download(page);
  const pdf = await PDFDocument.load(output);
  expect(pdf.getPages().map((p) => [p.getWidth(), p.getHeight()])).toEqual([
    [150, 225],
    [225, 150],
  ]);
  await upload(page, "/pdf-to-jpg", output);
  await page.getByLabel("Image format").selectOption("png");
  await create(page);
  const zip = await JSZip.loadAsync(await download(page));
  expect(Object.keys(zip.files)).toHaveLength(2);
  const first = await zip.file("sample-page-1.png")!.async("nodebuffer");
  expect((await sharp(first).metadata()).format).toBe("png");
  const mean = (await sharp(first).stats()).channels.map((c) => c.mean);
  expect(mean[2]).toBeGreaterThan(240);
  expect(mean[0]).toBeLessThan(10);
  await page.getByLabel("Image format").selectOption("jpeg");
  await page.getByLabel("Pages to process").fill("2");
  await create(page);
  expect((await sharp(await download(page)).metadata()).format).toBe("jpeg");
});

test("rotate selected pages and crop rotated pages without modifying other pages", async ({
  page,
}) => {
  await upload(page, "/rotate-pdf", await createDigitalPdf(2));
  await page.getByLabel("Pages to process").fill("2");
  await create(page);
  const rotated = await download(page);
  expect(
    (await PDFDocument.load(rotated))
      .getPages()
      .map((p) => p.getRotation().angle),
  ).toEqual([0, 90]);
  await upload(page, "/crop-pdf", rotated);
  await page.getByLabel("Pages to process").fill("2");
  await page.getByLabel("Preview page").selectOption("2");
  for (const [label, value] of [
    ["Left (%)", "10"],
    ["Top (%)", "20"],
    ["Width (%)", "50"],
    ["Height (%)", "60"],
  ])
    await page.getByLabel(label, { exact: true }).fill(value);
  await page
    .getByRole("button", { name: "Add selected area", exact: true })
    .click();
  await create(page);
  const cropped = await PDFDocument.load(await download(page));
  expect(cropped.getPage(0).getCropBox()).toEqual({
    x: 0,
    y: 0,
    width: 612,
    height: 792,
  });
  const box = cropped.getPage(1).getCropBox();
  expect(box.width).toBeCloseTo(612 * 0.6);
  expect(box.height).toBeCloseTo(792 * 0.5);
  await page
    .getByRole("button", { name: "Preview output", exact: true })
    .click();
  await expect(page.getByLabel("Preview page")).toHaveCount(2);
});

test("interactive forms preserve values, Unicode, checkboxes, choices and flatten on request", async ({
  page,
}) => {
  const source = await PDFDocument.create();
  const sheet = source.addPage([612, 792]);
  const form = source.getForm();
  const name = form.createTextField("Full name");
  name.addToPage(sheet, { x: 50, y: 650, width: 300, height: 30 });
  const check = form.createCheckBox("Confirmed");
  check.addToPage(sheet, { x: 50, y: 600, width: 20, height: 20 });
  const choice = form.createDropdown("Country");
  choice.addOptions(["Nederland", "France"]);
  choice.addToPage(sheet, { x: 50, y: 550, width: 160, height: 25 });
  const locked = form.createTextField("Reference");
  locked.setText("104");
  locked.enableReadOnly();
  locked.addToPage(sheet, { x: 50, y: 500, width: 160, height: 25 });
  await upload(page, "/fill-pdf", Buffer.from(await source.save()));
  await page.getByLabel("Full name", { exact: true }).fill("Zoë García");
  await page.getByLabel("Confirmed", { exact: true }).check();
  await page.getByLabel("Country").selectOption("Nederland");
  await expect(page.getByLabel("Reference", { exact: true })).toBeDisabled();
  await create(page);
  const filled = await PDFDocument.load(await download(page));
  expect(filled.getForm().getTextField("Full name").getText()).toBe(
    "Zoë García",
  );
  expect(filled.getForm().getCheckBox("Confirmed").isChecked()).toBe(true);
  expect(filled.getForm().getDropdown("Country").getSelected()).toEqual([
    "Nederland",
  ]);
  await page
    .getByLabel("Flatten completed fields so they are no longer interactive.")
    .check();
  await create(page);
  const flattened = await download(page);
  expect(
    (await PDFDocument.load(flattened)).getForm().getFields(),
  ).toHaveLength(0);
  const flatDocument = await PDFDocument.load(flattened);
  for (const page of flatDocument.getPages())
    expect(page.node.Annots()?.size() ?? 0).toBe(0);
  expect(textOf(flattened)).toContain("Zoë García");
});

test("redaction removes original text, metadata and attachments and paints opaque masks", async ({
  page,
}) => {
  const source = await PDFDocument.load(await createDigitalPdf(2));
  source.getPage(0).drawText("SECRET123", { x: 72, y: 700, size: 24 });
  source.setTitle("SECRET123");
  source.setAuthor("PRIVATE_AUTHOR");
  await source.attach(Buffer.from("SECRET123"), "private.txt");
  const input = Buffer.from(await source.save());
  await upload(page, "/redact-pdf", input);
  for (const [label, value] of [
    ["Left (%)", "10"],
    ["Top (%)", "8"],
    ["Width (%)", "70"],
    ["Height (%)", "12"],
  ])
    await page.getByLabel(label, { exact: true }).fill(value);
  await page
    .getByRole("button", { name: "Add selected area", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Create redacted PDF", exact: true }),
  ).toBeDisabled();
  await page
    .getByLabel(
      "I reviewed the marked areas and understand the output is flattened.",
    )
    .check();
  await page
    .getByRole("button", { name: "Create redacted PDF", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Ready to download" }),
  ).toBeVisible();
  const output = await download(page);
  const pdf = await PDFDocument.load(output);
  expect(pdf.getPageCount()).toBe(2);
  expect(pdf.getTitle()).toBe("");
  expect(pdf.getAuthor()).toBe("");
  expect(pdf.catalog.get(PDFName.of("Names"))).toBeUndefined();
  expect(pdf.getForm().getFields()).toHaveLength(0);
  expect(textOf(output).trim()).toBe("");
  expect(output.includes(Buffer.from("SECRET123"))).toBe(false);
  expect(textOf(input)).toContain("SECRET123");
  await page
    .getByRole("button", { name: "Preview output", exact: true })
    .click();
  await expect(page.locator("canvas")).toHaveCount(2);
  const canvas = page.locator("canvas").last();
  await expect
    .poll(() => canvas.evaluate((el) => (el as HTMLCanvasElement).width), {
      timeout: 20000,
    })
    .toBeGreaterThan(500);
  const image = sharp(await canvas.screenshot());
  const meta = await image.metadata();
  const region = await image
    .extract({
      left: Math.round(meta.width! * 0.2),
      top: Math.round(meta.height! * 0.12),
      width: 20,
      height: 20,
    })
    .toBuffer();
  const stats = await sharp(region).stats();
  expect(stats.channels.slice(0, 3).every((c) => c.max === 0)).toBe(true);
  await page.getByLabel("Preview page").last().selectOption("2");
  await page.screenshot({ path: "test-results/redaction-review.png" });
});

test("OCR produces selectable text and TXT locally, then hands off to Word", async ({
  page,
}) => {
  test.setTimeout(180000);
  const external: string[] = [],
    bodies: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (/^https?:$/.test(url.protocol) && url.hostname !== "127.0.0.1")
      external.push(request.url());
    if (request.method() === "POST") bodies.push(request.postData() ?? "");
  });
  const scan = await scannedInvoice();
  expect(textOf(scan).trim()).toBe("");
  await upload(page, "/ocr-pdf", scan);
  await create(page);
  const output = await download(page);
  expect(textOf(output)).toContain("INVOICE");
  expect((await PDFDocument.load(output)).getPage(0).getWidth()).toBeCloseTo(
    600,
  );
  expect((await download(page, "Download text")).toString()).toContain("104");
  expect(external).toEqual([]);
  expect(
    bodies.every((body) => !body.includes("%PDF") && !body.includes("HELLO")),
  ).toBe(true);
  await page
    .getByLabel("Continue with another tool")
    .selectOption("/pdf-to-word");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page).toHaveURL(/\/pdf-to-word$/);
  await expect(
    page.getByRole("button", { name: "Change file", exact: true }),
  ).toBeVisible();
  await create(page);
  const zip = await JSZip.loadAsync(await download(page));
  expect(await zip.file("word/document.xml")!.async("string")).toContain(
    "INVOICE",
  );
});

test("OCR cancellation returns control without producing a partial file", async ({
  page,
}) => {
  await upload(page, "/ocr-pdf", await scannedInvoice());
  await page.getByRole("button", { name: "Create file", exact: true }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.locator("p[role=alert]")).toContainText(
    "Processing cancelled",
    { timeout: 20000 },
  );
  await expect(
    page.getByRole("button", { name: "Create file", exact: true }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: "Download file", exact: true }),
  ).toHaveCount(0);
});

test("PDF to Word handles digital text and image-only PDFs explicitly", async ({
  page,
}) => {
  await upload(page, "/pdf-to-word", await createDigitalPdf(2));
  await create(page);
  let zip = await JSZip.loadAsync(await download(page));
  let xml = await zip.file("word/document.xml")!.async("string");
  expect(xml).toContain("Editable invoice page 1");
  expect(xml).toContain("Editable invoice page 2");
  await upload(page, "/pdf-to-word", await createScannedLikePdf());
  await page.getByRole("button", { name: "Create file", exact: true }).click();
  await expect(page.locator("p[role=alert]")).toContainText(
    "No selectable text was found",
  );
  await page.getByLabel("Word format").selectOption("images");
  await create(page);
  zip = await JSZip.loadAsync(await download(page));
  xml = await zip.file("word/document.xml")!.async("string");
  expect(xml).toContain("w:drawing");
  expect(
    Object.keys(zip.files).filter(
      (path) => path.startsWith("word/media/") && !zip.files[path].dir,
    ),
  ).toHaveLength(1);
});

test("Word to PDF exports accented text, basic tables, bold text and embedded images", async ({
  page,
}) => {
  const png = await sharp({
    create: { width: 100, height: 50, channels: 3, background: "#00aaff" },
  })
    .png()
    .toBuffer();
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Factuur Zoë García", bold: true })],
          }),
          new Paragraph("Invoice total € 250"),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Description")] }),
                  new TableCell({ children: [new Paragraph("Amount")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Service")] }),
                  new TableCell({ children: [new Paragraph("250")] }),
                ],
              }),
            ],
          }),
          new Paragraph({
            children: [
              new ImageRun({
                type: "png",
                data: png,
                transformation: { width: 100, height: 50 },
              }),
            ],
          }),
        ],
      },
    ],
  });
  await upload(
    page,
    "/word-to-pdf",
    await Packer.toBuffer(doc),
    "invoice.docx",
  );
  await create(page);
  const output = await download(page);
  expect((await PDFDocument.load(output)).getPageCount()).toBe(1);
  const text = textOf(output);
  for (const value of [
    "Factuur Zoë García",
    "Invoice total € 250",
    "Description",
    "Amount",
    "Service",
  ])
    expect(text).toContain(value);
  await page
    .getByRole("button", { name: "Preview output", exact: true })
    .click();
  await expect
    .poll(() =>
      page.locator("canvas").evaluate((el) => (el as HTMLCanvasElement).width),
    )
    .toBeGreaterThan(500);
  await page.screenshot({ path: "test-results/word-conversion.png" });
});

test("invalid DOCX and encrypted/archive-like input fail without downloads", async ({
  page,
}) => {
  await upload(page, "/word-to-pdf", Buffer.from("not a zip"), "bad.docx");
  await page.getByRole("button", { name: "Create file", exact: true }).click();
  await expect(page.locator("p[role=alert]")).toContainText(
    "Choose a valid DOCX",
  );
  await expect(
    page.getByRole("button", { name: "Download file", exact: true }),
  ).toHaveCount(0);
  const zip = new JSZip();
  zip.file(
    "word/document.xml",
    '<!DOCTYPE x [<!ENTITY p SYSTEM "https://example.com/secret">]><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>&p;</w:body></w:document>',
  );
  await upload(
    page,
    "/word-to-pdf",
    await zip.generateAsync({ type: "nodebuffer" }),
    "external.docx",
  );
  await page.getByRole("button", { name: "Create file", exact: true }).click();
  await expect(page.locator("p[role=alert]")).toContainText(
    "Choose a valid DOCX",
  );
});

test("target compression reports success while lossless mode retains selectable text", async ({
  page,
}) => {
  await page.goto("/compress-pdf");
  await page.locator("input[type=file]").setInputFiles({
    name: "invoice.pdf",
    mimeType: "application/pdf",
    buffer: await createDigitalPdf(3),
  });
  await page.getByLabel("Target file size").selectOption("100000");
  await page
    .getByLabel("Preserve selectable text and forms (lossless only)")
    .check();
  const wait = page.waitForEvent("download");
  await page.getByRole("button", { name: "Compress PDF", exact: true }).click();
  const output = await readFile((await (await wait).path())!);
  expect(output.length).toBeLessThanOrEqual(100000);
  expect(textOf(output)).toContain("Editable invoice page 3");
  await expect(
    page.getByRole("status").filter({ hasText: "Target reached" }),
  ).toBeVisible();
});

test("new Dutch tools preserve locale across results and work on narrow mobile screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/nl/extract-pdf-pages");
  await page.locator("input[type=file]").setInputFiles({
    name: "factuur.pdf",
    mimeType: "application/pdf",
    buffer: await createDigitalPdf(2),
  });
  await expect(
    page.getByRole("button", { name: "Bestand maken", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Bestand maken", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Bestand downloaden", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/mobile-toolkit-nl.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Doorgaan", exact: true }).click();
  await expect(page).toHaveURL(/\/nl\/editor/);
  await expect(page.locator("html")).toHaveAttribute("lang", "nl");
});

test("all six OCR language packs and document fonts are served locally", async ({
  request,
}) => {
  for (const lang of ["eng", "nld", "deu", "fra", "spa", "ita"]) {
    const path = `/tool-assets/ocr/${lang}.traineddata.gz`;
    const response = await request.head(path);
    expect(response.status()).toBe(200);
    expect(Number(response.headers()["content-length"])).toBeGreaterThan(
      100000,
    );
    const sample = await request.get(path, {
      headers: { Range: "bytes=0-1023" },
    });
    expect(sample.status()).toBe(206);
    expect((await sample.body()).subarray(0, 2)).toEqual(
      Buffer.from([0x1f, 0x8b]),
    );
  }
  for (const file of [
    "fonts/noto-400.woff",
    "fonts/noto-700.woff",
    "ocr/worker.min.js",
  ])
    expect((await request.get(`/tool-assets/${file}`)).status()).toBe(200);
});

test("target compression reports failure when lossless output exceeds the chosen size", async ({
  page,
}) => {
  const pixels = Buffer.alloc(512 * 512 * 3);
  let seed = 104;
  for (let i = 0; i < pixels.length; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    pixels[i] = seed >>> 24;
  }
  const png = await sharp(pixels, {
    raw: { width: 512, height: 512, channels: 3 },
  })
    .png()
    .toBuffer();
  const pdf = await PDFDocument.create();
  const image = await pdf.embedPng(png);
  pdf
    .addPage([512, 512])
    .drawImage(image, { x: 0, y: 0, width: 512, height: 512 });
  await page.goto("/compress-pdf");
  await page.locator("input[type=file]").setInputFiles({
    name: "noise.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from(await pdf.save()),
  });
  await page.getByLabel("Target file size").selectOption("100000");
  await page
    .getByLabel("Preserve selectable text and forms (lossless only)")
    .check();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Compress PDF", exact: true }).click();
  expect(
    (await readFile((await (await pending).path())!)).length,
  ).toBeGreaterThan(100000);
  await expect(
    page.getByRole("status").filter({ hasText: "Target not reached" }),
  ).toBeVisible();
});

test("DOCX inflation is bounded even when archive metadata understates its size", async ({
  page,
}) => {
  const zip = new JSZip();
  zip.file("word/document.xml", " ".repeat(31 * 1024 * 1024));
  const bytes = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  const central = bytes.indexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02]));
  bytes.writeUInt32LE(1024, central + 24);
  await upload(page, "/word-to-pdf", bytes, "oversized.docx");
  await page.getByRole("button", { name: "Create file", exact: true }).click();
  await expect(page.locator("p[role=alert]")).toContainText(
    "browser processing limits",
  );
  await expect(
    page.getByRole("button", { name: "Download file", exact: true }),
  ).toHaveCount(0);
});

test("dedicated PNG routes accept PNG input and export PNG by default", async ({page}) => {
  await page.goto("/png-to-pdf");
  const input = page.locator("input[type=file]");
  await expect(input).toHaveAttribute("accept", "image/png,.png");
  await input.setInputFiles({ name: "photo.jpg", mimeType: "image/jpeg", buffer: Buffer.from("test") });
  await expect(page.locator("p[role=alert]")).toHaveText("Please choose PNG images for this tool.");
  const image = await sharp({create:{width:40,height:30,channels:4,background:"#eef"}}).png().toBuffer();
  await input.setInputFiles({ name: "diagram.png", mimeType: "image/png", buffer: image });
  await create(page);
  await upload(page, "/pdf-to-png", await download(page));
  await expect(page.getByLabel("Image format")).toHaveValue("png");
  await create(page);
  expect((await sharp(await download(page)).metadata()).format).toBe("png");
});

test("standalone form flattening retains read-only values and removes fields", async ({page}) => {
  const document = await PDFDocument.create();
  const sheet = document.addPage();
  const field = document.getForm().createTextField("Reference");
  field.setText("Invoice 875");
  field.addToPage(sheet, {x:40,y:600,width:200,height:40});
  field.enableReadOnly();
  await upload(page, "/flatten-pdf-form", Buffer.from(await document.save()));
  await page.getByRole("button", {name:"Flatten PDF form fields",exact:true}).click();
  const output = await download(page);
  expect((await PDFDocument.load(output)).getForm().getFields()).toHaveLength(0);
  expect(textOf(output)).toContain("Invoice 875");
});

test("scan-to-text produces a readable TXT download", async ({page}) => {
  await upload(page, "/scanned-pdf-to-text", await scannedInvoice());
  await create(page);
  await expect(page.getByRole("textbox", {name:"Recognized text"})).toBeVisible();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", {name:"Download file"}).click();
  const file = await pending;
  expect(file.suggestedFilename()).toBe("sample.txt");
  expect(await readFile((await file.path())!,"utf8")).toContain("INVOICE 104");
});

test("shape and duplicate-page routes open the editor for the selected task", async ({page}) => {
  const file = {name:"two.pdf",mimeType:"application/pdf",buffer:await createDigitalPdf(2)};
  await page.goto("/add-shapes-to-pdf");
  await page.locator('input[type=file]').setInputFiles(file);
  await expect(page.getByTitle("Rectangle", {exact:true})).toHaveAttribute("aria-pressed", "true");
  await page.goto("/duplicate-pdf-pages");
  await page.locator('input[type=file]').setInputFiles(file);
  await page.getByTitle("Duplicate page", {exact:true}).first().click();
  const buffer = await download(page, "Download");
  expect((await PDFDocument.load(buffer)).getPageCount()).toBe(3);
  const pages = textOf(buffer).trim().split("\f");
  expect(pages[0].trim()).toBe(pages[1].trim());
});
