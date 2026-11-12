import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';
import { createDigitalPdf } from './fixtures';
import { supportedLocales } from '../../src/lib/routeRegistry';
import { localizeTool } from '../../src/lib/localizedTools';
import { getToolBySlug } from '../../src/lib/pdfTools';
import { getLanguageAlternates, getLocalizedPath } from '../../src/lib/i18n';

test('all focused language pages expose matching copy, canonical, reciprocal alternates and FAQs without JavaScript', async ({ request }) => {
 for (const locale of supportedLocales) for (const slug of ['redact-pdf','ocr-pdf','extract-pdf-pages','scanned-pdf-to-text']) {
  const response=await request.get(getLocalizedPath(locale,`/${slug}`));
  expect(response.status()).toBe(200);
  const html=await response.text();
  const tool=localizeTool(getToolBySlug(slug)!,locale);
  const scripts=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  const faq=scripts.find(s=>s['@type']==='FAQPage');
  expect(faq.mainEntity[0].name).toBe(tool.faqs[0].question);
  expect(scripts.find(s=>s['@type']==='SoftwareApplication').description).toBe(tool.description);
  expect(html).toContain('<h1');
  for (const [language,url] of Object.entries(getLanguageAlternates(`/${slug}`))) expect(html).toContain(`rel="alternate" hrefLang="${language}" href="${url}"`);
 }
});

test('extracted pages continue to merge and compress without uploading again', async ({page}) => {
 await page.setViewportSize({width:390,height:844});
 await page.goto('/extract-pdf-pages');
 await page.locator('input[type=file]').setInputFiles({name:'report.pdf',mimeType:'application/pdf',buffer:await createDigitalPdf(3)});
 await page.getByLabel('Pages to process').fill('3,1');
 await page.getByRole('button',{name:'Create file',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Ready to download'})).toBeVisible();
 await page.getByLabel('Continue with another tool').selectOption('/merge-pdf');
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await expect(page.getByText('report-extracted.pdf',{exact:true})).toBeVisible();
 await page.locator('input[type=file]').setInputFiles({name:'extra.pdf',mimeType:'application/pdf',buffer:await createDigitalPdf(1)});
 const pending=page.waitForEvent('download');
 await page.getByRole('button',{name:'Merge PDFs',exact:true}).click();
 const merged=await pending;
 expect((await PDFDocument.load(await readFile((await merged.path())!))).getPageCount()).toBe(3);
 await page.getByRole('button',{name:'Continue → Compress PDF',exact:true}).click();
 await expect(page.getByText('merged-pdf.pdf',{exact:true})).toBeVisible();
 await expect(page).not.toHaveURL(/uploadId/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByLabel('Preserve selectable text and forms (lossless only)').check();
 const compressed=page.waitForEvent('download');
 await page.getByRole('button',{name:'Compress PDF',exact:true}).click();
 expect((await PDFDocument.load(await readFile((await (await compressed).path())!))).getPageCount()).toBe(3);
});

test('compression sample is a real PDF and uses understandable file sizes', async ({page,request}) => {
 const response=await request.get('/examples/compression-sample.pdf');
 expect((await PDFDocument.load(await response.body())).getPageCount()).toBe(1);
 await page.goto('/compress-pdf');
 await expect(page.getByRole('table')).toContainText('1.2 MB → 44.5 KB');
 await expect(page.getByRole('link',{name:'Download sample PDF'})).toHaveAttribute('download','');
});
