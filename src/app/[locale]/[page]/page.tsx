import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSupportedLocale, supportedLocales } from "@/lib/i18n";
import { getToolBySlug } from "@/lib/pdfTools";
import { ToolRoutePage } from "@/app/(tools)/toolRoute";
import AllToolsContent from "@/components/tools/AllToolsContent";
import { InformationPage, informationPages } from "@/components/i18n/InformationPage";
import { pageMetadata } from "@/lib/pageMetadata";
import { publicRoutes, getPublicRoute } from "@/lib/routeRegistry";

type Props = { params: Promise<{ locale: string; page: string }> };
export function generateStaticParams() {
 return supportedLocales.filter(locale => locale !== "en").flatMap(locale =>
  publicRoutes.filter(route => route.path !== "/" && route.kind !== "editor").map(route => route.path.slice(1)).map(page => ({ locale, page })),
 );
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { locale, page } = await params;
 if (!isSupportedLocale(locale) || locale === "en" || !getPublicRoute(`/${page}`)) notFound();
 return pageMetadata(`/${page}`, locale);
}
export default async function LocalizedPage({ params }: Props) {
 const { locale, page } = await params;
 if (!isSupportedLocale(locale) || locale === "en") notFound();
 if (getToolBySlug(page)) return <ToolRoutePage slug={page} locale={locale} />;
 if (page === "all-tools") return <AllToolsContent locale={locale} />;
 if (informationPages[page]) return <InformationPage page={page} locale={locale} />;
 notFound();
}
