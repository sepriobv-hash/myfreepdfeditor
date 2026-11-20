import { expect, test } from "@playwright/test";
import {
  createDigitalPdf,
  createFormPdf,
  createRotatedPdf,
  createScannedLikePdf,
} from "./fixtures";

test("usage and CSP endpoints reject unsafe payloads", async ({ request }) => {
  const unknown = await request.post("/api/usage", { data: { name: "arbitrary_event" } });
  expect(unknown.status()).toBe(400);

  const oversized = await request.post("/api/usage", {
    headers: { "Content-Type": "application/json" },
    data: { name: "landing_view", padding: "x".repeat(5_000) },
  });
  expect(oversized.status()).toBe(413);

  const report = await request.post("/api/csp-report", {
    headers: { "Content-Type": "application/csp-report" },
    data: {
      "csp-report": {
        "effective-directive": "script-src-elem",
        "blocked-uri": "https://example.invalid/script.js?secret=removed",
        "document-uri": "http://127.0.0.1:3100/editor?private=removed",
      },
    },
  });
  expect(report.status()).toBe(204);
});

test("homepage and localized metadata are accessible and index-safe", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.headers()["content-security-policy-report-only"]).toContain("default-src 'self'");
  await expect(page.getByRole("heading", { level: 1, name: /Free PDF Editor Online/i })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /Drop your PDF here/i })).toBeVisible();
  await expect(page.locator("nav a").first()).toHaveAttribute("href", "/");

  await page.goto("/nl");
  await expect(page.locator("html")).toHaveAttribute("lang", "nl");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /^index, follow$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.myfreepdfeditor.com/nl");
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", "https://www.myfreepdfeditor.com");
  await expect(page.locator('link[rel="alternate"][hreflang="nl"]')).toHaveAttribute("href", "https://www.myfreepdfeditor.com/nl");
  await expect(page.getByRole("button", { name: /Kies PDF/i })).toBeVisible();

  await page.goto("/de");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /^index, follow$/);
});

test("sitemap only advertises reachable, indexable canonical pages", async ({ request }) => {
  test.setTimeout(240_000);
  const sitemap = await request.get("/sitemaps/pages.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  expect(urls).toContain("https://www.myfreepdfeditor.com/nl");
  expect(xml).toContain('hreflang="nl" href="https://www.myfreepdfeditor.com/nl"');
  expect(xml).toContain('hreflang="en" href="https://www.myfreepdfeditor.com"');

  for (const url of urls) {
    const response = await request.get(new URL(url).pathname);
    expect(response.status(), url).toBe(200);
    const html = await response.text();
    expect(html, url).toContain(`rel="canonical" href="${url}"`);
    expect(html, url).not.toMatch(/name="robots" content="[^"]*noindex/);
  }
});

test("Dutch mobile navigation and upload feedback stay usable", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/nl");
  await expect(page.locator("nav a").first()).toHaveAttribute("href", "/nl");
  const merge = page.getByRole("link", { name: "PDF samenvoegen", exact: true }).first();
  await expect(merge).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.locator('input[type="file"]').setInputFiles({
    name: "wrong-file.txt", mimeType: "text/plain", buffer: Buffer.from("not a PDF"),
  });
  await expect(page.getByText("Kies een geldig PDF-bestand.", { exact: true })).toBeVisible();
  await expect(page.locator('input[type="file"]')).toHaveValue("");
  await merge.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("PDF samenvoegen");
});

test("homepage upload hands the selected PDF to the editor", async ({ page }) => {
  const pdf = await createDigitalPdf();
  await page.goto("/nl");
  await page.locator('input[type="file"]').setInputFiles({
    name: "homepage-upload.pdf", mimeType: "application/pdf", buffer: pdf,
  });
  await expect(page.getByRole("button", { name: "Downloaden" })).toBeVisible({ timeout: 20_000 });
  await expect(page).toHaveURL(/\/nl\/editor$/);
  await expect(page.getByText(/Pagina 1 van 1/)).toBeVisible();
});

test("mobile homepage demo opens a real PDF and fits it on screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/nl");
  const upload = page.getByRole("button", { name: "Kies PDF", exact: true });
  const box = (await upload.boundingBox())!;
  expect(box.y + box.height).toBeLessThan(812);

  await page.getByRole("button", { name: "Probeer een voorbeeld-PDF", exact: true }).click();
  await expect(page).toHaveURL(/\/nl\/editor$/);
  await expect(page.getByText(/Pagina 1 van 2/)).toBeVisible();
  await expect(page.getByTitle("Passend op breedte")).toHaveAttribute("aria-pressed", "true");
  await expect.poll(async () => {
    const bounds = await page.locator("section canvas").first().boundingBox();
    return bounds ? bounds.x >= 0 && bounds.x + bounds.width <= 375 : false;
  }).toBe(true);
  await expect(page.getByRole("button", { name: "Downloaden", exact: true })).toBeVisible();
});

test("editor keeps the open PDF when a replacement fails to load", async ({ page }) => {
  await page.goto("/editor");
  const file = { name: "project.pdf", mimeType: "application/pdf", buffer: await createDigitalPdf(2) };
  const input = page.locator('input[type=file][accept*="application/pdf"]');
  await input.setInputFiles(file);
  await expect(page.getByText(/Page 1 of 2/)).toBeVisible();
  await input.setInputFiles({ name: "bad.pdf", mimeType: "application/pdf", buffer: Buffer.from("not a document") });
  await expect(page.getByText("Could not load this PDF.", { exact: true })).toBeVisible();
  await expect(page.getByTitle("project.pdf")).toBeVisible();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download", exact: true }).click();
  expect((await pending).suggestedFilename()).toMatch(/^project.*\.pdf$/);
});

test("the temporary PDF handoff is consumed by only one browser tab", async ({ context, page }) => {
  await page.goto("/");
  const id = await page.evaluate(async bytes => {
    const request = indexedDB.open("pdf-studio-web", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("pendingUploads", { keyPath: "id" });
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const id = crypto.randomUUID();
    const file = new File([new Uint8Array(bytes)], "one-tab.pdf", { type: "application/pdf" });
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction("pendingUploads", "readwrite");
      transaction.objectStore("pendingUploads").put({
        id, file: new Uint8Array(bytes).buffer, name: file.name, type: file.type, lastModified: file.lastModified, createdAt: Date.now(),
      });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
    return id;
  }, Array.from(await createDigitalPdf()));

  const otherTab = await context.newPage();
  const handoff = `/editor?uploadId=${id}`;
  await Promise.all([page.goto(handoff), otherTab.goto(handoff)]);
  await Promise.all([expect(page).toHaveURL(/\/editor$/), expect(otherTab).toHaveURL(/\/editor$/)]);
  const visible = await Promise.all([page, otherTab].map(tab => tab.getByRole("button", { name: "Download", exact: true }).isVisible()));
  expect(visible.filter(Boolean)).toHaveLength(1);
  await otherTab.close();
});

test("privacy controls clear local upload and analytics data", async ({ page }) => {
  await page.goto("/privacy");
  await page.evaluate(() => {
    localStorage.setItem("myfreepdfeditor_analytics_consent", "granted");
    sessionStorage.setItem("pdf_studio_session_id", crypto.randomUUID());
  });
  await page.getByRole("button", { name: /Clear local app data/i }).click();
  await expect(page.getByRole("status")).toContainText("were cleared");
  expect(await page.evaluate(() => localStorage.getItem("myfreepdfeditor_analytics_consent"))).toBeNull();
  expect(await page.evaluate(() => sessionStorage.getItem("pdf_studio_session_id"))).toBeNull();
});

for (const [name, createPdf] of [
  ["digital text", () => createDigitalPdf()],
  ["rotated page", createRotatedPdf],
  ["fillable form", createFormPdf],
  ["scanned page without text layer", createScannedLikePdf],
] as const) {
  test(`editor opens a ${name} PDF without uploading document bytes`, async ({ page }) => {
    const pdf = await createPdf();
    const requestBodies: Buffer[] = [];
    page.on("request", (request) => {
      const body = request.postDataBuffer();
      if (body) requestBodies.push(body);
    });

    await page.goto("/editor");
    await page.locator('input[type="file"][accept*="application/pdf"]').setInputFiles({
      name: `${name.replaceAll(" ", "-")}.pdf`,
      mimeType: "application/pdf",
      buffer: pdf,
    });

    await expect(page.getByRole("button", { name: "Download" })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/Page 1 of 1/)).toBeVisible();
    expect(requestBodies.some((body) => body.includes(Buffer.from("%PDF-")))).toBe(false);
    expect(requestBodies.every((body) => body.byteLength <= 4_096)).toBe(true);
  });
}

test("a text edit supports undo, redo, and a reopenable export", async ({ page }) => {
  const pdf = await createDigitalPdf();
  await page.goto("/editor");
  await page.locator('input[type="file"][accept*="application/pdf"]').setInputFiles({
    name: "editable.pdf",
    mimeType: "application/pdf",
    buffer: pdf,
  });
  await expect(page.getByRole("button", { name: "Download" })).toBeVisible({ timeout: 20_000 });

  await page.getByTitle("Text").click();
  const editorStage = page.locator(".konvajs-content");
  await expect(editorStage).toBeVisible();
  await editorStage.click({ position: { x: 300, y: 360 } });
  await expect(page.getByTitle("Undo")).toBeEnabled();
  await page.getByTitle("Undo").click();
  await expect(page.getByTitle("Redo")).toBeEnabled();
  await page.getByTitle("Redo").click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const exported = await import("node:fs/promises").then(({ readFile }) => readFile(path!));
  expect(exported.subarray(0, 5).toString()).toBe("%PDF-");
  const { PDFDocument } = await import("pdf-lib");
  expect((await PDFDocument.load(exported)).getPageCount()).toBe(1);
});
