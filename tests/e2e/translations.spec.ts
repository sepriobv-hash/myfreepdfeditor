import { expect, test } from "@playwright/test";
import { activePdfTools } from "../../src/lib/pdfTools";
import { localizeTool } from "../../src/lib/localizedTools";
import { getLocalizedPath } from "../../src/lib/i18n";
import { dictionaries, translators } from "../../src/lib/translations";
import { createDigitalPdf } from "./fixtures";

const locales = ["nl", "de", "fr", "es", "it"] as const;
test("locale paths preserve queries and fragments without duplicate prefixes", () => {
 expect(getLocalizedPath("nl", "/editor?uploadId=abc&tool=sign-pdf#page-2")).toBe("/nl/editor?uploadId=abc&tool=sign-pdf#page-2");
 expect(getLocalizedPath("de", "/nl/sign-pdf")).toBe("/de/sign-pdf");
 expect(getLocalizedPath("en", "/nl/sign-pdf")).toBe("/sign-pdf");
 for (const path of ["https://example.com", "mailto:a@example.com", "#faq", "/api/usage", "//example.com"]) expect(getLocalizedPath("nl", path)).toBe(path);
});

test("translation catalogs have matching nonempty keys", () => {
 const keys = Object.keys(dictionaries.nl).sort();
 for (const locale of locales) {
  expect(Object.keys(dictionaries[locale]).sort()).toEqual(keys);
  for (const value of Object.values(dictionaries[locale])) expect(value.trim()).not.toBe("");
 }
});

for (const locale of locales) {
 const t = translators[locale];
 test(`${locale}: every tool and information route renders localized HTML and metadata`, async ({ request }) => {
  test.setTimeout(180_000);
  for (const tool of activePdfTools) {
   const response = await request.get(`/${locale}/${tool.slug}`);
   expect(response.status(), `${locale}/${tool.slug}`).toBe(200);
   const html = await response.text();
   expect(html).toContain(`<html lang="${locale}"`);
   expect(html).toContain(`rel="canonical" href="https://www.myfreepdfeditor.com/${locale}/${tool.slug}"`);
   const localized = localizeTool(tool, locale);
   expect(html).toContain(localized.title);
   if (localized.h1 !== tool.h1) expect(html).not.toContain(`>${tool.h1}</h1>`);
   expect(html).toContain(`href="/${locale}/all-tools"`);
   expect(html).not.toContain('href="/all-tools"');
  }
  for (const slug of ["all-tools", "about", "security", "how-it-works", "privacy", "terms", "pricing", "editor"]) {
   const response = await request.get(`/${locale}/${slug}`);
   expect(response.status(), `${locale}/${slug}`).toBe(200);
   const html = await response.text();
   expect(html).toContain(`<html lang="${locale}"`);
   expect(html).toContain(`rel="canonical" href="https://www.myfreepdfeditor.com/${locale}/${slug}"`);
   if (slug === "editor") expect(html).toContain('content="noindex, nofollow"');
  }
  expect((await request.get(`/${locale}/unknown-tool`)).status()).toBe(404);
 });

 test(`${locale}: homepage, related tools, language switching and editor preserve language`, async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto(`/${locale}`);
  const links = await page.locator('main a[href^="/"]').evaluateAll(elements => elements.map(el => el.getAttribute("href")!));
  const languageLinks = ["/", "/nl", "/de", "/fr", "/es", "/it"];
  expect(links.filter(href => !languageLinks.includes(href)).every(href => href.startsWith(`/${locale}/`))).toBe(true);
  await page.locator(`a[href="/${locale}/sign-pdf"]`).first().click();
  await expect(page).toHaveURL(new RegExp(`/${locale}/sign-pdf$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(localizeTool(activePdfTools.find(tool => tool.slug === "sign-pdf")!, locale).h1);
  await page.goBack();
  await expect(page).toHaveURL(new RegExp(`/${locale}$`));
  await expect(page.locator("h1")).not.toHaveText(localizeTool(activePdfTools.find(tool => tool.slug === "sign-pdf")!, locale).h1);
  await page.goForward();
  await expect(page).toHaveURL(new RegExp(`/${locale}/sign-pdf$`));
  await expect(page.locator("html")).toHaveAttribute("lang",locale);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(localizeTool(activePdfTools.find(tool => tool.slug === "sign-pdf")!, locale).h1);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang",locale);
  const related = await page.locator('a[href*="edit-pdf"]').first().getAttribute("href");
  expect(related).toMatch(new RegExp(`^/${locale}/`));
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/sign-pdf$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("link", { name: ({ nl: "Nederlands", de: "Deutsch", fr: "Français", es: "Español", it: "Italiano" })[locale], exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/${locale}/sign-pdf$`));
  await page.locator('input[type="file"]').setInputFiles({ name: "invalid.txt", mimeType: "text/plain", buffer: Buffer.from("invalid") });
  await expect(page.getByRole("alert").filter({ hasText: t("Please choose a valid PDF file.") })).toHaveText(t("Please choose a valid PDF file."));
  await page.locator('input[type="file"]').setInputFiles({ name: "source.pdf", mimeType: "application/pdf", buffer: await createDigitalPdf() });
  await expect(page).toHaveURL(new RegExp(`/${locale}/editor\\?uploadId=.+&tool=sign-pdf`));
  await expect(page.getByRole("button", { name: t("Download"), exact: true })).toBeVisible();
  await expect(page.getByTitle(t("Undo"), { exact: true })).toBeVisible();
  // Original document text is never translated or mutated by the UI catalog.
  await page.getByTitle(t("Signature"), { exact: true }).click();
  await expect(page.getByRole("heading", { name: t("Create signature") })).toBeVisible();
  await page.getByTitle(t("Close"), { exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: t("Download"), exact: true }).click();
  expect((await downloadPromise).suggestedFilename()).toMatch(/\.pdf$/);
 });
}

test("Dutch merge and compression complete with translated results", async ({ page }) => {
 const pdf = await createDigitalPdf();
 await page.goto("/nl/merge-pdf");
 await expect(page.getByRole("button", { name: "Kies PDF’s", exact: true })).toBeVisible();
 await page.locator('input[type="file"]').setInputFiles([
  { name: "a.pdf", mimeType: "application/pdf", buffer: pdf },
  { name: "b.pdf", mimeType: "application/pdf", buffer: pdf },
 ]);
 await expect(page.getByText("PDF-volgorde")).toBeVisible();
 let download = page.waitForEvent("download");
 await page.getByRole("button", { name: "PDF’s samenvoegen", exact: true }).click();
 const merged = await download;
 const { readFile } = await import("node:fs/promises");
 const { PDFDocument } = await import("pdf-lib");
 expect((await PDFDocument.load(await readFile((await merged.path())!))).getPageCount()).toBe(2);
 await expect(page.getByRole("button", { name: "Samengevoegde PDF opnieuw downloaden" })).toBeVisible();
 await page.goto("/nl/compress-pdf");
 await page.locator('input[type="file"]').setInputFiles({ name: "a.pdf", mimeType: "application/pdf", buffer: pdf });
 await expect(page.getByRole("slider", { name: "Compressieniveau" })).toBeVisible();
 download = page.waitForEvent("download");
 await page.getByRole("button", { name: "PDF verkleinen", exact: true }).click();
 await download;
 await expect(page.getByRole("button", { name: "Verkleinde PDF opnieuw downloaden" })).toBeVisible();
 await expect(page.getByText("Verkleining", { exact: true })).toBeVisible();
});
