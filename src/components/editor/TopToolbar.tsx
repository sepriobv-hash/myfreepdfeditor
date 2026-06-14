"use client";

import { useRef } from "react";
import type { ComponentType } from "react";
import {
  Download,
  Eraser,
  FileImage,
  FileUp,
  Highlighter,
  Loader2,
  Minus,
  MousePointer2,
  Pencil,
  PenLine,
  Plus,
  Redo2,
  Save,
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
  onUploadPdf,
  onAddImage,
  onOpenSignature,
  onExport,
}: {
  onUploadPdf: (file: File) => void;
  onAddImage: (file: File) => void;
  onOpenSignature: () => void;
  onExport: () => void;
}) {
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const tool = useEditorStore((state) => state.tool);
  const setTool = useEditorStore((state) => state.setTool);
  const zoom = useEditorStore((state) => state.zoom);
  const setZoom = useEditorStore((state) => state.setZoom);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const deleteObject = useEditorStore((state) => state.deleteObject);
  const historyLength = useEditorStore((state) => state.history.length);
  const futureLength = useEditorStore((state) => state.future.length);
  const isExporting = useEditorStore((state) => state.isExporting);

  return (
    <header className="flex min-h-16 items-center gap-2 overflow-x-auto border-b border-line bg-white px-3 py-2 editor-scrollbar">
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

      <Button title="Upload new PDF" variant="tool" onClick={() => pdfInputRef.current?.click()}>
        <FileUp className="h-4 w-4" />
      </Button>
      <Button title="Save / Export PDF" variant="tool" disabled={isExporting} onClick={onExport}>
        {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Export
      </Button>

      <div className="mx-1 h-8 w-px shrink-0 bg-line" />

      <Button title="Undo" variant="tool" disabled={!historyLength} onClick={undo}>
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button title="Redo" variant="tool" disabled={!futureLength} onClick={redo}>
        <Redo2 className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-8 w-px shrink-0 bg-line" />

      {tools.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.tool}
            title={item.label}
            variant="tool"
            active={tool === item.tool}
            onClick={() => setTool(item.tool)}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}

      <Button title="Add image" variant="tool" onClick={() => imageInputRef.current?.click()}>
        <FileImage className="h-4 w-4" />
      </Button>
      <Button title="Signature" variant="tool" onClick={onOpenSignature}>
        <Signature className="h-4 w-4" />
      </Button>
      <Button title="Delete selected object" variant="tool" onClick={() => deleteObject()}>
        <Eraser className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-8 w-px shrink-0 bg-line" />

      <Button title="Zoom out" variant="tool" onClick={() => setZoom(zoom - 0.1)}>
        <Minus className="h-4 w-4" />
      </Button>
      <div className="min-w-16 text-center text-sm font-medium text-slate-700">{Math.round(zoom * 100)}%</div>
      <Button title="Zoom in" variant="tool" onClick={() => setZoom(zoom + 0.1)}>
        <Plus className="h-4 w-4" />
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <Button title="Download edited PDF" variant="primary" disabled={isExporting} onClick={onExport}>
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download
        </Button>
      </div>
    </header>
  );
}
