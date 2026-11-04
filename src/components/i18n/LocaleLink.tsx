"use client";
import type { ComponentProps } from "react";
import { useLocale } from "./LocaleProvider";
import { getLocalizedPath } from "@/lib/i18n";

// Public pages cross several root layouts. Native document navigation keeps
// browser history and the URL-selected locale consistent across those boundaries.
export default function LocaleLink({ href, ...props }: ComponentProps<"a">) {
  const locale = useLocale();
  return <a {...props} href={href ? getLocalizedPath(locale, href) : href} />;
}
