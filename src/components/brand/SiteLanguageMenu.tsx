"use client";

import { ChevronDown, Globe2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { getLocalizedPath, localeOptions, type SupportedLocale } from "@/lib/i18n";

export function SiteLanguageMenu({
  locale,
  path,
  label,
}: {
  locale: SupportedLocale;
  path: string;
  label: string;
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  const toggle = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeFromOutside(event: PointerEvent) {
      const details = menu.current;
      if (details?.open && event.target instanceof Node && !details.contains(event.target)) {
        details.open = false;
      }
    }
    document.addEventListener("pointerdown", closeFromOutside);
    return () => document.removeEventListener("pointerdown", closeFromOutside);
  }, []);

  return (
    <details
      ref={menu}
      className="group relative shrink-0"
      onKeyDown={event => {
        if (event.key === "Escape" && event.currentTarget.open) {
          event.preventDefault();
          event.currentTarget.open = false;
          toggle.current?.focus();
        }
      }}
    >
      <summary
        ref={toggle}
        aria-label={label}
        className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-md border border-transparent px-1.5 text-sm font-semibold text-muted hover:bg-mist hover:text-ink group-open:border-line group-open:bg-white sm:px-2.5 [&::-webkit-details-marker]:hidden"
      >
        <Globe2 aria-hidden="true" size={16} />
        <span aria-hidden="true">{locale.toUpperCase()}</span>
        <ChevronDown aria-hidden="true" size={13} className="hidden group-open:rotate-180 sm:block" />
      </summary>
      <ul className="absolute right-0 top-full z-30 mt-1 max-h-[min(25rem,70vh)] w-52 overflow-y-auto rounded-lg border border-line bg-white p-1 shadow-panel">
        {localeOptions.map(option => (
          <li key={option.code}>
            <a
              href={getLocalizedPath(option.code, path)}
              hrefLang={option.hreflang}
              lang={option.hreflang}
              aria-current={locale === option.code ? "page" : undefined}
              className="flex min-h-11 items-center rounded-md px-3 text-sm hover:bg-mist aria-[current=page]:bg-brand-50 aria-[current=page]:font-semibold aria-[current=page]:text-brand-700"
            >
              {option.nativeLabel}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
