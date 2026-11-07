import type { SupportedLocale } from "@/lib/i18n";
import { supportedLocales } from "@/lib/routeRegistry";
import nl from "./nl.json";
import de from "./de.json";
import fr from "./fr.json";
import es from "./es.json";
import it from "./it.json";
import ptBR from "./pt-BR.json";
import id from "./id.json";
import tr from "./tr.json";
import pl from "./pl.json";
import hi from "./hi.json";

export const dictionaries: Record<Exclude<SupportedLocale, "en">, Record<string,string>> = {
  nl, de, fr, es, it, "pt-BR": ptBR, id, tr, pl, hi,
};
export function translate(locale: SupportedLocale, text: string): string {
  return locale === "en" ? text : dictionaries[locale][text] ?? text;
}
// Stable functions keep effects and callbacks from rerunning on every render.
export const translators = Object.fromEntries(
  supportedLocales.map(locale => [locale, (text: string) => translate(locale, text)]),
) as Record<SupportedLocale, (text: string) => string>;
