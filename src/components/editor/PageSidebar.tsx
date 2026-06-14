"use client";

import { ArrowDown, ArrowUp, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editorStore";
import type { PdfJsDocument } from "@/types/pdf";
import { PageThumbnail } from "@/components/editor/PageThumbnail";

export function PageSidebar({ pdfDoc }: { pdfDoc: PdfJsDocument }) {
  const pages = useEditorStore((state) => state.pages);
  const activePageId = useEditorStore((state) => state.activePageId);
  const setActivePage = useEditorStore((state) => state.setActivePage);
  const deletePage = useEditorStore((state) => state.deletePage);
  const duplicatePage = useEditorStore((state) => state.duplicatePage);
  const movePage = useEditorStore((state) => state.movePage);

  return (
    <aside className="hidden w-48 shrink-0 overflow-y-auto border-r border-line bg-white p-3 md:block editor-scrollbar">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Pages</h2>
        <span className="text-xs text-slate-500">{pages.length}</span>
      </div>
      <div className="space-y-3">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={cn(
              "rounded-md border p-2 transition",
              page.id === activePageId ? "border-brand-500 bg-brand-50" : "border-line bg-slate-50",
            )}
          >
            <button className="block w-full" onClick={() => setActivePage(page.id)}>
              <PageThumbnail pdfDoc={pdfDoc} page={page} />
              <div className="mt-2 text-center text-xs font-medium text-slate-700">Page {index + 1}</div>
            </button>
            <div className="mt-2 grid grid-cols-4 gap-1">
              <Button title="Move page up" className="h-8 px-0" variant="ghost" onClick={() => movePage(page.id, "up")}>
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button title="Move page down" className="h-8 px-0" variant="ghost" onClick={() => movePage(page.id, "down")}>
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button title="Duplicate page" className="h-8 px-0" variant="ghost" onClick={() => duplicatePage(page.id)}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                title="Delete page"
                className="h-8 px-0"
                variant="ghost"
                onClick={() => {
                  if (window.confirm("Delete this page?")) deletePage(page.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
