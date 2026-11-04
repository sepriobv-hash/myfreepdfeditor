"use client";
import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "./LocaleProvider";
import { getLocalizedPath } from "@/lib/i18n";

export default function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const locale = useLocale();
  return <Link {...props} href={typeof href === "string" ? getLocalizedPath(locale, href) : { ...href, pathname: href.pathname ? getLocalizedPath(locale, href.pathname) : href.pathname }} />;
}
