"use client";

import { Copy, Layers, SendToBack, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEditorStore } from "@/store/editorStore";
import type { EditorObject } from "@/types/editor";

export function PropertiesPanel() {
  const pages = useEditorStore((state) => state.pages);
  const selectedObjectId = useEditorStore((state) => state.selectedObjectId);
  const updateObject = useEditorStore((state) => state.updateObject);
  const deleteObject = useEditorStore((state) => state.deleteObject);
  const duplicateObject = useEditorStore((state) => state.duplicateObject);
  const bringObjectForward = useEditorStore((state) => state.bringObjectForward);
  const sendObjectBackward = useEditorStore((state) => state.sendObjectBackward);
  const selected = pages.flatMap((page) => page.objects).find((object) => object.id === selectedObjectId);

  if (!selected) {
    return (
      <aside className="hidden w-80 shrink-0 border-l border-line bg-white p-4 lg:block">
        <h2 className="text-sm font-semibold text-ink">Properties</h2>
        <div className="mt-8 rounded-md border border-dashed border-line bg-slate-50 p-5 text-center text-sm leading-6 text-slate-500">
          Select an object to edit its text, colors, opacity, size, and layer order.
        </div>
      </aside>
    );
  }
  const selectedObject = selected;

  function patch(update: Partial<EditorObject>) {
    updateObject(selectedObject.id, update);
  }

  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-line bg-white p-4 lg:block editor-scrollbar">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ink">Properties</h2>
          <p className="text-xs capitalize text-slate-500">{selected.type}</p>
        </div>
        <Button title="Delete object" variant="danger" onClick={() => deleteObject(selected.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {selected.type === "text" && (
          <>
            <label className="block text-sm font-medium text-slate-700">
              Text
              <textarea
                className="mt-2 min-h-24 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={selected.text}
                onChange={(event) => patch({ text: event.target.value } as Partial<EditorObject>)}
              />
            </label>
            <NumberField label="Font size" value={selected.fontSize} onChange={(fontSize) => patch({ fontSize } as Partial<EditorObject>)} />
            <RangeField
              label="Boldness"
              value={selected.fontWeight}
              min={100}
              max={900}
              step={100}
              suffix=""
              onChange={(fontWeight) =>
                patch({ fontWeight, bold: fontWeight >= 600 } as Partial<EditorObject>)
              }
            />
            <RangeField
              label="Text spacing"
              value={selected.characterSpacing}
              min={-2}
              max={12}
              step={0.1}
              suffix="px"
              onChange={(characterSpacing) => patch({ characterSpacing } as Partial<EditorObject>)}
            />
            <label className="block text-sm font-medium text-slate-700">
              Font family
              <input
                className="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={selected.fontFamily}
                onChange={(event) => patch({ fontFamily: event.target.value } as Partial<EditorObject>)}
              />
            </label>
            <ColorField label="Text color" value={selected.color} onChange={(color) => patch({ color } as Partial<EditorObject>)} />
            <div className="grid grid-cols-1 gap-2">
              <Toggle label="Italic" active={selected.italic} onClick={() => patch({ italic: !selected.italic } as Partial<EditorObject>)} />
            </div>
            <label className="block text-sm font-medium text-slate-700">
              Alignment
              <select
                className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={selected.alignment}
                onChange={(event) => patch({ alignment: event.target.value } as Partial<EditorObject>)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>
          </>
        )}

        {(selected.type === "rectangle" || selected.type === "circle") && (
          <>
            <ColorField label="Fill color" value={selected.fillColor.slice(0, 7)} onChange={(fillColor) => patch({ fillColor } as Partial<EditorObject>)} />
            <ColorField label="Border color" value={selected.strokeColor} onChange={(strokeColor) => patch({ strokeColor } as Partial<EditorObject>)} />
            <NumberField label="Border width" value={selected.strokeWidth} onChange={(strokeWidth) => patch({ strokeWidth } as Partial<EditorObject>)} />
          </>
        )}

        {selected.type === "highlight" && (
          <ColorField label="Highlight color" value={selected.fillColor} onChange={(fillColor) => patch({ fillColor } as Partial<EditorObject>)} />
        )}

        {(selected.type === "drawing" || selected.type === "line") && (
          <>
            <ColorField label="Stroke color" value={selected.strokeColor} onChange={(strokeColor) => patch({ strokeColor } as Partial<EditorObject>)} />
            <NumberField label="Stroke width" value={selected.strokeWidth} onChange={(strokeWidth) => patch({ strokeWidth } as Partial<EditorObject>)} />
          </>
        )}

        {(selected.type === "image" || selected.type === "signature") && (
          <div className="rounded-md border border-line bg-slate-50 p-3 text-sm text-slate-600">
            Background removal can be added here when image processing is enabled.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <NumberField label="X" value={selected.x} onChange={(x) => patch({ x } as Partial<EditorObject>)} />
          <NumberField label="Y" value={selected.y} onChange={(y) => patch({ y } as Partial<EditorObject>)} />
          <NumberField label="Width" value={selected.width} onChange={(width) => patch({ width } as Partial<EditorObject>)} />
          <NumberField label="Height" value={selected.height} onChange={(height) => patch({ height } as Partial<EditorObject>)} />
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Opacity
          <input
            className="mt-2 w-full accent-brand-600"
            type="range"
            min={0.05}
            max={1}
            step={0.05}
            value={selected.opacity}
            onChange={(event) => patch({ opacity: Number(event.target.value) } as Partial<EditorObject>)}
          />
        </label>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button variant="secondary" onClick={() => duplicateObject(selected.id)}>
            <Copy className="h-4 w-4" />
            Duplicate
          </Button>
          <Button variant="secondary" onClick={() => bringObjectForward(selected.id)}>
            <Layers className="h-4 w-4" />
            Forward
          </Button>
          <Button variant="secondary" onClick={() => sendObjectBackward(selected.id)}>
            <SendToBack className="h-4 w-4" />
            Backward
          </Button>
          <Button variant="danger" onClick={() => deleteObject(selected.id)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </aside>
  );
}

function NumberField({
  label,
  value,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        className="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand-500"
        type="number"
        step={step}
        value={Math.round(value * 100) / 100}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        className="mt-2 h-10 w-full rounded-md border border-line bg-white px-2"
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <div className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <span className="text-xs font-semibold text-slate-500">
          {Math.round(value * 10) / 10}
          {suffix}
        </span>
      </div>
      <input
        className="mt-3 w-full accent-brand-600"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Button className="w-full" variant="tool" active={active} onClick={onClick}>
      {label}
    </Button>
  );
}
