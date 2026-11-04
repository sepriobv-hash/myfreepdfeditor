import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/pageMetadata";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
 const { locale } = await params;
 if (!isSupportedLocale(locale) || locale === "en") notFound();
 return pageMetadata("/editor", locale);
}
export default function LocalizedEditorLayout({ children }: { children: ReactNode }) { return children; }
