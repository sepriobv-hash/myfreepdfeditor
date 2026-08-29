import { expect, test } from "@playwright/test";
import {
  createDigitalPdf,
  createFormPdf,
  createRotatedPdf,
  createScannedLikePdf,
} from "./fixtures";

test("homepage and localized metadata are accessible and index-safe", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.headers()["content-security-policy-report-only"]).toContain("default-src 'self'");
  await expect(page.getByRole("heading", { level: 1, name: /Free PDF Editor Online/i })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /Drop your PDF here/i })).toBeVisible();
  await expect(page.locator("nav a").first()).toHaveAttribute("href", "/");

  await page.goto("/nl");
  await expect(page.locator("html")).toHaveAttribute("lang", "nl");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("button", { name: /Kies PDF/i })).toBeVisible();
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
});
