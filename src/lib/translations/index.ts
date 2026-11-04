import type { SupportedLocale } from "@/lib/i18n";
import nl from "./nl.json";
import de from "./de.json";
import fr from "./fr.json";
import es from "./es.json";
import it from "./it.json";
export const dictionaries: Record<Exclude<SupportedLocale, "en">, Record<string, string>> = { nl, de, fr, es, it };
export function translate(locale: SupportedLocale, text: string): string {
  return locale === "en" ? text : dictionaries[locale][text] ?? text;
}
// Stable functions keep effects and callbacks from rerunning on every render.
export const translators = Object.fromEntries(
  ["en", "nl", "de", "fr", "es", "it"].map(locale => [locale, (text: string) => translate(locale as SupportedLocale, text)]),
) as Record<SupportedLocale, (text: string) => string>;
