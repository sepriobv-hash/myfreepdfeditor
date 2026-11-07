import { activePdfTools } from "./pdfTools";

export const supportedLocales = ["en", "nl", "de", "fr", "es", "it", "pt-BR", "id", "tr", "pl", "hi"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];
export const defaultLocale: SupportedLocale = "en";
// Publication is explicit: newly added languages must pass the locale suite before joining.
export const completedLocales: readonly SupportedLocale[] = ["en", "nl", "de", "fr", "es", "it", "pt-BR", "id", "tr", "pl", "hi"];
export const localeOptions = [
 { code: "en", hreflang: "en", label: "English", nativeLabel: "English" },
 { code: "nl", hreflang: "nl", label: "Dutch", nativeLabel: "Nederlands" },
 { code: "de", hreflang: "de", label: "German", nativeLabel: "Deutsch" },
 { code: "fr", hreflang: "fr", label: "French", nativeLabel: "Français" },
 { code: "es", hreflang: "es", label: "Spanish", nativeLabel: "Español" },
 { code: "it", hreflang: "it", label: "Italian", nativeLabel: "Italiano" },
 { code: "pt-BR", hreflang: "pt-BR", label: "Brazilian Portuguese", nativeLabel: "Português (Brasil)" },
 { code: "id", hreflang: "id", label: "Indonesian", nativeLabel: "Bahasa Indonesia" },
 { code: "tr", hreflang: "tr", label: "Turkish", nativeLabel: "Türkçe" },
 { code: "pl", hreflang: "pl", label: "Polish", nativeLabel: "Polski" },
 { code: "hi", hreflang: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
] as const;
export type PublicRoute = {
 path: string;
 kind: "home" | "directory" | "tool" | "information" | "editor";
 indexable: boolean;
 locales: readonly SupportedLocale[];
};
export const publicRoutes: PublicRoute[] = [
 { path: "/", kind: "home", indexable: true, locales: completedLocales },
 { path: "/all-tools", kind: "directory", indexable: true, locales: completedLocales },
 ...activePdfTools.map(tool => ({ path: `/${tool.slug}`, kind: "tool" as const, indexable: true, locales: completedLocales })),
 ...["about", "security", "how-it-works", "privacy", "terms", "pricing"].map(slug => ({ path: `/${slug}`, kind: "information" as const, indexable: slug !== "pricing", locales: completedLocales })),
 { path: "/editor", kind: "editor", indexable: false, locales: completedLocales },
];
export function getPublicRoute(path: string) {
 const segments = path.split(/[?#]/, 1)[0].split("/").filter(Boolean);
 if (supportedLocales.includes(segments[0] as SupportedLocale)) segments.shift();
 return publicRoutes.find(route => route.path === (segments.length ? `/${segments.join("/")}` : "/"));
}
export function getIndexableLocales(path = "/"): readonly SupportedLocale[] {
 const route = getPublicRoute(path);
 return route?.indexable ? route.locales : [];
}
