"use client";
import { useTranslation } from "@/components/i18n/LocaleProvider";

import { ArrowDown, ArrowUp, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editorStore";
import type { PdfJsDocument } from "@/types/pdf";
import { PageThumbnail } from "@/components/editor/PageThumbnail";

export function PageSidebar({ pdfDoc, openOnNarrow }: { pdfDoc: PdfJsDocument; openOnNarrow: boolean }) {
  const t = useTranslation();
  const pages = useEditorStore((state) => state.pages);
  const activePageId = useEditorStore((state) => state.activePageId);
  const setActivePage = useEditorStore((state) => state.setActivePage);
  const deletePage = useEditorStore((state) => state.deletePage);
  const duplicatePage = useEditorStore((state) => state.duplicatePage);
  const movePage = useEditorStore((state) => state.movePage);

  return (
    <aside
      id="editor-pages"
      className={cn(
        "w-28 shrink-0 overflow-y-auto border-r border-line bg-white p-2 editor-scrollbar lg:block lg:w-44 lg:p-3",
        !openOnNarrow && "hidden",
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">{t("Pages")}</h2>
        <span className="text-xs text-slate-500">{pages.length}</span>
      </div>
      <div className="space-y-3">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={cn(
              "rounded-md border p-2 transition",
              page.id === activePageId ? "border-brand-500 bg-brand-50" : "border-line bg-paper",
            )}
          >
            <button
              className="block w-full rounded-sm"
              aria-current={page.id === activePageId ? "page" : undefined}
              onClick={() => setActivePage(page.id)}
            >
              <PageThumbnail pdfDoc={pdfDoc} page={page} />
              <div className="mt-2 text-center text-xs font-medium text-slate-700">{t("Page")} {index + 1}</div>
            </button>
            <div className="mt-2 grid grid-cols-2 gap-1 lg:grid-cols-4">
              <Button title={t("Move page up")} className="h-9 px-0" variant="ghost" disabled={index === 0} onClick={() => movePage(page.id, "up")}>
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button title={t("Move page down")} className="h-9 px-0" variant="ghost" disabled={index === pages.length - 1} onClick={() => movePage(page.id, "down")}>
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button title={t("Duplicate page")} className="h-9 px-0" variant="ghost" onClick={() => duplicatePage(page.id)}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                title={t("Delete page")}
                className="h-9 px-0"
                variant="ghost"
                disabled={pages.length <= 1}
                onClick={() => {
                  if (window.confirm(t("Delete this page?"))) deletePage(page.id);
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
