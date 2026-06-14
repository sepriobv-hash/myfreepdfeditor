import type { MetadataRoute } from "next";
import { getAbsoluteLocalizedUrl, getLanguageAlternates, localeOptions } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const languageAlternates = getLanguageAlternates();
  return [
    ...localeOptions.map((locale) => ({
      url: getAbsoluteLocalizedUrl(locale.code),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: locale.code === "en" ? 1 : 0.9,
      alternates: {
        languages: languageAlternates,
      },
    })),
    {
      url: `${siteUrl}/editor`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ];
}
