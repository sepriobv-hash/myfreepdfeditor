"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown, CheckSquare, ChevronRight, CircleCheck, Copy, Crop, FileImage, FileMinus2, FileOutput, Files, FileText, FileType2, FilePenLine, Highlighter, Image, Images, ListFilter, Minimize2, PenLine, Pencil, Replace, RotateCw, ScanText, Search, Shapes, Shield, Signature, Split, Type } from "lucide-react";
import type { ToolCategory } from "@/lib/pdfTools";

type DirectoryGroup = {
  category: ToolCategory;
  label: string;
  tools: { slug: string; href: string; name: string; description: string }[];
};

const icons = {
  "edit-pdf": FilePenLine, "edit-pdf-text": Replace, "add-text-to-pdf": Type, "add-image-to-pdf": Image,
  "sign-pdf": Signature, "merge-pdf": Files, "compress-pdf": Minimize2, "annotate-pdf": PenLine,
  "highlight-pdf": Highlighter, "draw-on-pdf": Pencil, "reorder-pdf-pages": ArrowUpDown, "delete-pdf-pages": FileMinus2,
  "split-pdf": Split, "extract-pdf-pages": FileOutput, "jpg-to-pdf": FileImage, "png-to-pdf": Images,
  "pdf-to-jpg": Image, "pdf-to-png": FileImage, "rotate-pdf": RotateCw, "crop-pdf": Crop, "ocr-pdf": ScanText,
  "fill-pdf": CheckSquare, "redact-pdf": Shield, "pdf-to-word": FileType2, "word-to-pdf": FileText,
  "flatten-pdf-form": CircleCheck, "scanned-pdf-to-text": ScanText, "pdf-to-text": FileText, "duplicate-pdf-pages": Copy, "add-shapes-to-pdf": Shapes,
} as const;
function normalize(text: string) {
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/(\p{Script=Latin})\p{M}+/gu, "$1")
    .replaceAll("ß", "ss")
    .replaceAll("ı", "i")
    .replaceAll("ł", "l")
    .replaceAll("œ", "oe")
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, " ")
    .trim();
}

export function ToolDirectory({ groups, heading, searchLabel, categoryLabel, allLabel, emptyLabel, clearLabel }: {
  groups: DirectoryGroup[]; heading: string; searchLabel: string; categoryLabel: string;
  allLabel: string; emptyLabel: string; clearLabel: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    function readFilters() {
      const params = new URLSearchParams(window.location.search);
      const selected = params.get("category") ?? "";
      setQuery((params.get("q") ?? "").slice(0, 120));
      setCategory(groups.some(group => group.category === selected) ? selected : "");
    }

    readFilters();
    window.addEventListener("popstate", readFilters);
    return () => window.removeEventListener("popstate", readFilters);
  }, [groups]);

  function updateFilters(nextQuery: string, nextCategory: string) {
    setQuery(nextQuery);
    setCategory(nextCategory);
    const url = new URL(window.location.href);
    if (nextQuery.trim()) url.searchParams.set("q", nextQuery.trim());
    else url.searchParams.delete("q");
    if (nextCategory) url.searchParams.set("category", nextCategory);
    else url.searchParams.delete("category");
    window.history.replaceState(window.history.state, "", url);
  }

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const visible = groups
    .filter(group => !category || group.category === category)
    .map(group => ({
      ...group,
      tools: group.tools.filter(tool => {
        const text = normalize([tool.name, tool.description, group.label, tool.slug].join(" "));
        return terms.every(term => text.includes(term));
      }),
    }))
    .filter(group => group.tools.length > 0);

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="site-wrap grid gap-4 py-6 sm:gap-6 sm:py-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-10">
          <h1 className="site-title text-4xl sm:text-5xl">{heading}</h1>
          <div className="flex flex-wrap gap-2">
            <label className="flex min-h-11 min-w-0 flex-[2_1_10rem] items-center gap-2 rounded-md border border-[#c5b9ac] bg-white px-3 focus-within:border-brand-700 focus-within:ring-1 focus-within:ring-brand-700">
              <Search aria-hidden="true" className="size-4 shrink-0 text-muted" />
              <input
                type="search"
                aria-label={searchLabel}
                placeholder={searchLabel}
                value={query}
                maxLength={120}
                onChange={event => updateFilters(event.target.value, category)}
                className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-muted focus-visible:outline-none"
              />
            </label>
            <label className="relative flex min-h-11 min-w-0 max-w-full items-center rounded-md border border-[#c5b9ac] bg-white">
              <ListFilter aria-hidden="true" className="pointer-events-none absolute left-3 size-4 text-muted" />
              <select
                aria-label={categoryLabel}
                value={category}
                onChange={event => updateFilters(query, event.target.value)}
                className="h-full max-w-full cursor-pointer rounded-md bg-transparent py-2 pl-9 pr-2 text-base text-ink sm:text-sm"
              >
                <option value="">{allLabel}</option>
                {groups.map(group => <option key={group.category} value={group.category}>{group.label}</option>)}
              </select>
            </label>
          </div>
        </div>
      </section>
      <div className="site-wrap space-y-7 py-6 sm:space-y-9 sm:py-8">
        {visible.length === 0 && (
          <div className="rounded-lg border border-line bg-white px-5 py-6">
            <p role="status" className="font-semibold">{emptyLabel}</p>
            <button className="mt-1 min-h-11 text-sm font-semibold text-brand-700 underline" onClick={() => updateFilters("", "")}>
              {clearLabel}
            </button>
          </div>
        )}
        {visible.map(group => (
          <section key={group.category} aria-labelledby={`directory-${group.category}`}>
            <h2 id={`directory-${group.category}`} className="site-title mb-2.5 text-2xl sm:text-[1.75rem]">{group.label}</h2>
            <div className="tool-link-grid grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map(tool => {
                const Icon = icons[tool.slug as keyof typeof icons] ?? FileText;
                return (
                  <a
                    key={tool.slug}
                    href={tool.href}
                    data-tool-slug={tool.slug}
                    className="group flex min-h-20 items-start gap-3 bg-white p-3.5 hover:bg-paper focus-visible:outline-offset-[-3px] sm:p-4"
                  >
                    <Icon size={19} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-700" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold leading-snug text-ink group-hover:text-brand-700">{tool.name}</h3>
                      <p className="mt-1 text-sm leading-5 text-muted">{tool.description}</p>
                    </div>
                    <ChevronRight size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-muted group-hover:text-brand-700" />
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
