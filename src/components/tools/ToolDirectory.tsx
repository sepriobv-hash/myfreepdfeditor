"use client";

import { useState } from "react";
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
  "flatten-pdf-form": CircleCheck, "scanned-pdf-to-text": ScanText, "duplicate-pdf-pages": Copy, "add-shapes-to-pdf": Shapes,
} as const;
const accents: Record<ToolCategory, string> = {
  Edit: "bg-rose-50 text-rose-700", Sign: "bg-indigo-50 text-indigo-700", Organize: "bg-sky-50 text-sky-700",
  Convert: "bg-teal-50 text-teal-700", Optimize: "bg-amber-50 text-amber-800", Protect: "bg-slate-100 text-slate-700", Annotate: "bg-violet-50 text-violet-700",
};

function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export function ToolDirectory({ groups, heading, searchLabel, categoryLabel, allLabel, emptyLabel, clearLabel }: {
  groups: DirectoryGroup[]; heading: string; searchLabel: string; categoryLabel: string;
  allLabel: string; emptyLabel: string; clearLabel: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const visible = groups.filter(g => !category || g.category === category).map(g => ({
    ...g, tools: g.tools.filter(tool => {
      const content = normalize([tool.name, tool.description, g.label, tool.slug.replaceAll("-", " ")].join(" "));
      return terms.every(term => content.includes(term));
    }),
  })).filter(g => g.tools.length);
  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-5 pt-6 sm:px-6 sm:py-8 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{heading}</h1>
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 lg:mt-0 lg:w-1/2">
            <label className="flex min-h-11 min-w-0 flex-[2_1_11rem] items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 focus-within:border-brand-700 focus-within:ring-1 focus-within:ring-brand-700 sm:max-w-lg">
              <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-500" />
              <input type="search" aria-label={searchLabel} placeholder={searchLabel} value={query} onChange={e => setQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-slate-500" />
            </label>
            <label className="relative flex min-h-11 min-w-0 max-w-full items-center rounded-lg border border-slate-300 bg-white">
              <ListFilter aria-hidden="true" className="pointer-events-none absolute left-3 h-4 w-4 text-slate-600" />
              <select aria-label={categoryLabel} value={category} onChange={e => setCategory(e.target.value)}
                className="h-full max-w-full cursor-pointer rounded-lg bg-transparent py-2 pl-9 pr-2 text-sm font-semibold">
                <option value="">{allLabel}</option>
                {groups.map(g => <option key={g.category} value={g.category}>{g.label}</option>)}
              </select>
            </label>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl space-y-7 px-4 py-6 sm:space-y-10 sm:px-6 sm:py-8 lg:px-8">
        {!visible.length && <div className="rounded-xl border border-line bg-white p-6">
          <p role="status" className="font-semibold">{emptyLabel}</p>
          <button className="mt-2 min-h-11 text-sm font-semibold text-brand-700 underline" onClick={() => { setQuery(""); setCategory(""); }}>{clearLabel}</button>
        </div>}
        {visible.map(g => <section key={g.category}>
          <h2 className="mb-3 text-lg font-bold tracking-tight sm:text-xl">{g.label}</h2>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3">
            {g.tools.map(tool => {
              const Icon = icons[tool.slug as keyof typeof icons] ?? FileText;
              return <a key={tool.slug} href={tool.href} data-tool-slug={tool.slug}
                className="group flex items-start gap-3 rounded-xl border border-line bg-white p-3.5 transition hover:border-slate-400 focus-visible:outline-brand-700 sm:p-4">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${accents[g.category]}`}><Icon size={20} aria-hidden="true" /></span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold leading-snug text-ink group-hover:text-brand-700">{tool.name}</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{tool.description}</p>
                </div>
                <ChevronRight size={16} aria-hidden="true" className="mt-1 shrink-0 text-slate-400 group-hover:text-brand-700" />
              </a>;
            })}
          </div>
        </section>)}
      </div>
    </>
  );
}
