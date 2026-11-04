import type { Metadata } from "next";
import { getPublicRoute } from "./routeRegistry";
import { getAbsoluteLocalizedUrl, getLanguageAlternates, type SupportedLocale } from "./i18n";
import { landingCopyByLocale } from "@/components/landing/landingCopy";
import { getToolBySlug } from "./pdfTools";
import { localizeTool } from "./localizedTools";
import { informationPages } from "./informationContent";
import { translators } from "./translations";
import { siteName } from "./site";

export function pageMetadata(path: string, locale: SupportedLocale = "en"): Metadata {
 const route = getPublicRoute(path);
 if (!route || !route.locales.includes(locale)) return { robots: { index: false, follow: false } };
 const t = translators[locale], slug = route.path.slice(1);
 const tool = getToolBySlug(slug);
 const localizedTool = tool ? localizeTool(tool, locale) : null;
 const info = informationPages[slug];
 const title = localizedTool?.title ?? (route.kind === "home" ? landingCopyByLocale[locale].hero.title : route.kind === "directory" ? t("All Free PDF Tools") : route.kind === "editor" ? t("PDF Editor") : t(info.title));
 const description = localizedTool?.description ?? (route.kind === "home" ? landingCopyByLocale[locale].hero.description : route.kind === "directory" ? t("Edit text, sign a document, combine files or reduce the size of a PDF. Choose a tool below; your PDF is processed on your device, with no account and no watermark.") : route.kind === "editor" ? t("Edit text, images, signatures and pages directly in your browser.") : t(info.intro));
 const url = getAbsoluteLocalizedUrl(locale, route.path);
 return {
  title, description,
  alternates: { canonical: url, ...(route.indexable ? { languages: getLanguageAlternates(route.path) } : {}) },
  robots: { index: route.indexable, follow: route.kind !== "editor" },
  openGraph: { title: `${title} - ${siteName}`, description, url, siteName, locale, type: "website" },
  twitter: { card: "summary_large_image", title: `${title} - ${siteName}`, description },
 };
}
