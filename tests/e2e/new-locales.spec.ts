import { expect, test } from "@playwright/test";
import { getLanguageAlternates } from "../../src/lib/i18n";
import { extraToolCopy } from "../../src/lib/extraToolCopy";
import { extraLocalePacks } from "../../src/lib/extraLocalePacks";
import { dictionaries } from "../../src/lib/translations";
import { activePdfTools } from "../../src/lib/pdfTools";
const locales = ["pt-BR", "id", "tr", "pl", "hi"] as const;

test("all five languages have tool metadata, complete keys and non-English homepage copy", async ({request}) => {
  const keys = Object.keys(dictionaries.nl).sort();
  for (const locale of locales) {
    expect(Object.keys(dictionaries[locale]).sort()).toEqual(keys);
    expect(Object.values(dictionaries[locale]).every(value => value.trim().length > 0)).toBe(true);
    expect(Object.keys(extraToolCopy[locale]).sort()).toEqual(activePdfTools.map(tool => tool.slug).sort());
    const home = await request.get(`/${locale}`);
    expect(home.status()).toBe(200);
    const html = await home.text();
    expect(html).toContain(`<html lang="${locale}"`);
    expect(html).toContain(extraLocalePacks[locale].hero[1]);
    expect(html).toContain(`rel="canonical" href="https://www.myfreepdfeditor.com/${locale}"`);
    expect(html).toContain(`hrefLang="${locale}"`);
    for (const slug of ["edit-pdf", "merge-pdf", "compress-pdf", "redact-pdf", "pdf-to-word"]) {
      const res = await request.get(`/${locale}/${slug}`);
      expect(res.status()).toBe(200);
      const body = await res.text();
      expect(body).toContain(extraToolCopy[locale][slug].title);
      expect(body).toContain(`rel="canonical" href="https://www.myfreepdfeditor.com/${locale}/${slug}"`);
    }
    const editor = await request.get(`/${locale}/editor`);
    expect(editor.status()).toBe(200);
    expect(await editor.text()).toContain('content="noindex, nofollow"');
    for (const page of ["about", "privacy", "terms"]) {
      const res = await request.get(`/${locale}/${page}`);
      expect(res.status()).toBe(200);
      expect(await res.text()).toContain('content="noindex, nofollow"');
    }
  }
  expect(Object.keys(getLanguageAlternates("/merge-pdf")).length).toBe(11 + 1);
});

test("new language sitemap lists every tool but not untranslated legal pages", async ({request}) => {
  const xml = await (await request.get("/sitemaps/pages.xml")).text();
  for (const locale of locales) {
    expect(xml).toContain(`<loc>https://www.myfreepdfeditor.com/${locale}/merge-pdf</loc>`);
    expect(xml).toContain(`hreflang="${locale}" href="https://www.myfreepdfeditor.com/${locale}/merge-pdf"`);
    expect(xml).not.toContain(`<loc>https://www.myfreepdfeditor.com/${locale}/privacy</loc>`);
  }
});
