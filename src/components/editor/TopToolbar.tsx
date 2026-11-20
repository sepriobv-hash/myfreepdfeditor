"use client";
import { useTranslation } from "@/components/i18n/LocaleProvider";

import { useRef } from "react";
import type { ComponentType } from "react";
import {
  Download,
  Eraser,
  FileImage,
  FileUp,
  Highlighter,
  Loader2,
  Maximize2,
  PanelLeft,
  Minus,
  MousePointer2,
  Pencil,
  PenLine,
  Plus,
  Redo2,
  Shapes,
  Signature,
  Square,
  Type,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEditorStore } from "@/store/editorStore";
import type { EditorTool } from "@/types/editor";

const tools: { tool: EditorTool; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { tool: "select", label: "Select", icon: MousePointer2 },
  { tool: "text", label: "Text", icon: Type },
  { tool: "draw", label: "Draw", icon: Pencil },
  { tool: "highlight", label: "Highlight", icon: Highlighter },
  { tool: "rectangle", label: "Rectangle", icon: Square },
  { tool: "circle", label: "Circle", icon: Shapes },
  { tool: "line", label: "Line", icon: PenLine },
];

export function TopToolbar({
  fileName,
  isLoading,
  pagesOpen,
  fitToWidth,
  onTogglePages,
  onFitWidth,
  onZoom,
  onUploadPdf,
  onAddImage,
  onOpenSignature,
  onExport,
}: {
  fileName: string;
  isLoading: boolean;
  pagesOpen: boolean;
  fitToWidth: boolean;
  onTogglePages: () => void;
  onFitWidth: () => void;
  onZoom: (zoom: number) => void;
  onUploadPdf: (file: File) => void;
  onAddImage: (file: File) => void;
  onOpenSignature: () => void;
  onExport: () => void;
}) {
  const t = useTranslation();
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const tool = useEditorStore((state) => state.tool);
  const setTool = useEditorStore((state) => state.setTool);
  const zoom = useEditorStore((state) => state.zoom);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const deleteObject = useEditorStore((state) => state.deleteObject);
  const historyLength = useEditorStore((state) => state.history.length);
  const futureLength = useEditorStore((state) => state.future.length);
  const isExporting = useEditorStore((state) => state.isExporting);
  const toolButton = ({ tool: value, label, icon: Icon }: (typeof tools)[number]) => (
    <Button
      key={value}
      title={t(label)}
      aria-label={t(label)}
      aria-pressed={tool === value}
      variant="ghost"
      active={tool === value}
      onClick={() => setTool(value)}
    >
      <Icon className="size-4" />
    </Button>
  );

  return (
    <header className="min-w-0 shrink-0 border-b border-line bg-white">
      <input
        ref={pdfInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onUploadPdf(file);
          event.currentTarget.value = "";
        }}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onAddImage(file);
          event.currentTarget.value = "";
        }}
      />

      <div className="flex min-h-14 min-w-0 items-center gap-2 border-b border-line px-2.5 sm:px-4">
        <Button
          title={t("Upload new PDF")}
          aria-label={t("Upload new PDF")}
          variant="ghost"
          className="size-10 shrink-0 border-line p-0"
          disabled={isLoading || isExporting}
          onClick={() => pdfInputRef.current?.click()}
        >
          {isLoading ? <Loader2 aria-hidden="true" size={16} className="animate-spin" /> : <FileUp aria-hidden="true" size={16} />}
        </Button>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold" title={fileName}>{fileName}</span>
        <Button
          title={t("Pages")}
          aria-label={t("Pages")}
          aria-controls="editor-pages"
          aria-expanded={pagesOpen}
          active={pagesOpen}
          variant="ghost"
          className="size-10 shrink-0 p-0 lg:hidden"
          onClick={onTogglePages}
        >
          <PanelLeft aria-hidden="true" size={17} />
        </Button>
        <Button
          title={t("Fit width")}
          aria-label={t("Fit width")}
          aria-pressed={fitToWidth}
          active={fitToWidth}
          variant="ghost"
          className="size-10 shrink-0 p-0"
          onClick={onFitWidth}
        >
          <Maximize2 aria-hidden="true" size={16} />
        </Button>
        <Button
          variant="primary"
          className="shrink-0"
          title={t("Download edited PDF")}
          disabled={isLoading || isExporting}
          onClick={onExport}
        >
          {isExporting ? <Loader2 aria-hidden="true" size={16} className="animate-spin" /> : <Download aria-hidden="true" size={16} />}
          {t("Download")}
        </Button>
      </div>

      <div className="editor-scrollbar min-w-0 overflow-x-auto bg-paper">
        <div className="flex w-max min-w-full items-center gap-1 px-2.5 py-1.5 sm:gap-1.5 sm:px-4">
          <Button title={t("Undo")} aria-label={t("Undo")} variant="ghost" disabled={!historyLength} onClick={undo}>
            <Undo2 aria-hidden="true" size={16} />
          </Button>
          <Button title={t("Redo")} aria-label={t("Redo")} variant="ghost" disabled={!futureLength} onClick={redo}>
            <Redo2 aria-hidden="true" size={16} />
          </Button>

          <span className="mx-1 h-6 w-px shrink-0 bg-line" aria-hidden="true" />

          {tools.slice(0, 2).map(toolButton)}
          <Button title={t("Signature")} aria-label={t("Signature")} variant="ghost" onClick={onOpenSignature}>
            <Signature aria-hidden="true" size={16} />
          </Button>
          <Button title={t("Add image")} aria-label={t("Add image")} variant="ghost" onClick={() => imageInputRef.current?.click()}>
            <FileImage aria-hidden="true" size={16} />
          </Button>
          {tools.slice(2).map(toolButton)}
          <Button title={t("Delete selected object")} aria-label={t("Delete selected object")} variant="ghost" onClick={() => deleteObject()}>
            <Eraser aria-hidden="true" size={16} />
          </Button>

          <span className="mx-1 h-6 w-px shrink-0 bg-line" aria-hidden="true" />

          <Button title={t("Zoom out")} aria-label={t("Zoom out")} variant="ghost" onClick={() => onZoom(zoom - 0.1)}>
            <Minus aria-hidden="true" size={16} />
          </Button>
          <Button title={t("Zoom in")} aria-label={t("Zoom in")} variant="ghost" onClick={() => onZoom(zoom + 0.1)}>
            <Plus aria-hidden="true" size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
}
