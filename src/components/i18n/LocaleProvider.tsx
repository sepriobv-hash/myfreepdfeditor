"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { defaultLocale, type SupportedLocale } from "@/lib/i18n";
type LocaleContextValue = { locale: SupportedLocale; t: (text: string) => string };
const LocaleContext = createContext<LocaleContextValue>({ locale: defaultLocale, t: text => text });
export function LocaleProvider({ locale, messages, children }: { locale: SupportedLocale; messages?: Record<string, string>; children: ReactNode }) {
  const value = useMemo(() => ({ locale, t: (text: string) => messages?.[text] ?? text }), [locale, messages]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
export function useLocale() { return useContext(LocaleContext).locale; }
export function useTranslation() { return useContext(LocaleContext).t; }
