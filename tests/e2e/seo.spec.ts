import { test, expect } from '@playwright/test';
import { publicRoutes, supportedLocales } from '../../src/lib/routeRegistry';
import { getAbsoluteLocalizedUrl, getLanguageAlternates } from '../../src/lib/i18n';
import { dictionaries } from '../../src/lib/translations';
import { informationPages } from '../../src/lib/informationContent';
import { toolEducation } from '../../src/lib/toolEducation';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

test('visible translation keys exist in every completed catalog', () => {
 const keys = new Set<string>();
 function scan(dir: string) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
  const file = path.join(dir, entry.name);
  if (entry.isDirectory()) scan(file);
  else if (/\.tsx?$/.test(file)) {
   const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
   function visit(node: ts.Node) { if (ts.isCallExpression(node) && node.expression.getText(source) === 't' && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) keys.add(node.arguments[0].text); ts.forEachChild(node, visit); }
   visit(source);
  }
 }}
 scan('src');
 for (const page of Object.values(informationPages)) { keys.add(page.title); keys.add(page.intro); for (const section of page.sections) section.forEach(s => keys.add(s)); }
 for (const row of Object.values(toolEducation)) Object.values(row).forEach(s => keys.add(s));
 for (const [locale, dictionary] of Object.entries(dictionaries)) expect([...keys].filter(key => !dictionary[key]), locale).toEqual([]);
});

test('sitemap exactly matches published routes with no private URLs or invented dates', async ({request}) => {
 const response = await request.get('/sitemaps/pages.xml');
 expect(response.status()).toBe(200);
 expect(response.headers()['content-type']).toContain('xml');
 const xml = await response.text();
 const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
 const expected = publicRoutes.filter(r=>r.indexable).flatMap(r=>r.locales.map(l=>getAbsoluteLocalizedUrl(l,r.path)));
 expect(urls.sort()).toEqual(expected.sort());
 expect(new Set(urls).size).toBe(urls.length);
 expect(xml).not.toContain('<lastmod>');
 expect(xml).not.toMatch(/uploadId|\/editor|\/pricing/);
 const robots = await request.get('/robots.txt');
 expect(await robots.text()).toContain('https://www.myfreepdfeditor.com/sitemap.xml');
});

test('equivalent tools have reciprocal alternates and private routes remain excluded', async ({page, request})=>{
 for (const locale of supportedLocales) {
  await page.goto(new URL(getAbsoluteLocalizedUrl(locale, '/merge-pdf')).pathname);
  await expect(page.locator('h1')).toHaveCount(1);
  for(const [lang,url] of Object.entries(getLanguageAlternates('/merge-pdf'))) await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveAttribute('href',url);
  for (const slug of ['editor','pricing']) {
   const res=await request.get(new URL(getAbsoluteLocalizedUrl(locale,`/${slug}`)).pathname);
   expect(await res.text()).toMatch(/name="robots" content="noindex/);
  }
 }
 for (const url of ['/zz','/zz/merge-pdf','/nl/not-a-tool','/not-a-tool']) expect((await request.get(url)).status()).toBe(404);
});
