"use client";
import { useTranslation } from "@/components/i18n/LocaleProvider";

import { Copy, Layers, SendToBack, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEditorStore } from "@/store/editorStore";
import type { EditorObject } from "@/types/editor";

export function PropertiesPanel() {
  const t = useTranslation();
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
        <h2 className="text-sm font-semibold text-ink">{t("Properties")}</h2>
        <div className="mt-8 rounded-md border border-dashed border-line bg-slate-50 p-5 text-center text-sm leading-6 text-slate-500"> {t("Select an object to edit its text, colors, opacity, size, and layer order.")} </div>
      </aside>
    );
  }
  const selectedObject = selected;

  function patch(update: Partial<EditorObject>) {
    updateObject(selectedObject.id, update);
  }

  return (
    <aside className="max-h-56 w-full shrink-0 overflow-y-auto border-t border-line bg-white p-4 lg:max-h-none lg:w-80 lg:border-l lg:border-t-0 editor-scrollbar">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ink">{t("Properties")}</h2>
          <p className="text-xs capitalize text-slate-500">{t(({ text: "Text", rectangle: "Rectangle", circle: "Circle", line: "Line", drawing: "Draw", highlight: "Highlight", image: "Add image", signature: "Signature" })[selected.type])}</p>
        </div>
        <Button title={t("Delete object")} variant="danger" onClick={() => deleteObject(selected.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {selected.type === "text" && (
          <>
            <label className="block text-sm font-medium text-slate-700"> {t("Text")} <textarea
                className="mt-2 min-h-24 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={selected.text}
                onChange={(event) => patch({ text: event.target.value } as Partial<EditorObject>)}
              />
            </label>
            <NumberField label={t("Font size")} value={selected.fontSize} onChange={(fontSize) => patch({ fontSize } as Partial<EditorObject>)} />
            <RangeField
              label={t("Boldness")}
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
              label={t("Text spacing")}
              value={selected.characterSpacing}
              min={-2}
              max={12}
              step={0.1}
              suffix="px"
              onChange={(characterSpacing) => patch({ characterSpacing } as Partial<EditorObject>)}
            />
            <label className="block text-sm font-medium text-slate-700"> {t("Font family")} <input
                className="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={selected.fontFamily}
                onChange={(event) => patch({ fontFamily: event.target.value } as Partial<EditorObject>)}
              />
            </label>
            <ColorField label={t("Text color")} value={selected.color} onChange={(color) => patch({ color } as Partial<EditorObject>)} />
            <div className="grid grid-cols-1 gap-2">
              <Toggle label={t("Italic")} active={selected.italic} onClick={() => patch({ italic: !selected.italic } as Partial<EditorObject>)} />
            </div>
            <label className="block text-sm font-medium text-slate-700"> {t("Alignment")} <select
                className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={selected.alignment}
                onChange={(event) => patch({ alignment: event.target.value } as Partial<EditorObject>)}
              >
                <option value="left">{t("Left")}</option>
                <option value="center">{t("Center")}</option>
                <option value="right">{t("Right")}</option>
              </select>
            </label>
          </>
        )}

        {(selected.type === "rectangle" || selected.type === "circle") && (
          <>
            <ColorField label={t("Fill color")} value={selected.fillColor.slice(0, 7)} onChange={(fillColor) => patch({ fillColor } as Partial<EditorObject>)} />
            <ColorField label={t("Border color")} value={selected.strokeColor} onChange={(strokeColor) => patch({ strokeColor } as Partial<EditorObject>)} />
            <NumberField label={t("Border width")} value={selected.strokeWidth} onChange={(strokeWidth) => patch({ strokeWidth } as Partial<EditorObject>)} />
          </>
        )}

        {selected.type === "highlight" && (
          <ColorField label={t("Highlight color")} value={selected.fillColor} onChange={(fillColor) => patch({ fillColor } as Partial<EditorObject>)} />
        )}

        {(selected.type === "drawing" || selected.type === "line") && (
          <>
            <ColorField label={t("Stroke color")} value={selected.strokeColor} onChange={(strokeColor) => patch({ strokeColor } as Partial<EditorObject>)} />
            <NumberField label={t("Stroke width")} value={selected.strokeWidth} onChange={(strokeWidth) => patch({ strokeWidth } as Partial<EditorObject>)} />
          </>
        )}



        <div className="grid grid-cols-2 gap-3">
          <NumberField label="X" value={selected.x} onChange={(x) => patch({ x } as Partial<EditorObject>)} />
          <NumberField label="Y" value={selected.y} onChange={(y) => patch({ y } as Partial<EditorObject>)} />
          <NumberField label={t("Width")} value={selected.width} onChange={(width) => patch({ width } as Partial<EditorObject>)} />
          <NumberField label={t("Height")} value={selected.height} onChange={(height) => patch({ height } as Partial<EditorObject>)} />
        </div>

        <label className="block text-sm font-medium text-slate-700"> {t("Opacity")} <input
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
            <Copy className="h-4 w-4" /> {t("Duplicate")} </Button>
          <Button variant="secondary" onClick={() => bringObjectForward(selected.id)}>
            <Layers className="h-4 w-4" /> {t("Forward")} </Button>
          <Button variant="secondary" onClick={() => sendObjectBackward(selected.id)}>
            <SendToBack className="h-4 w-4" /> {t("Backward")} </Button>
          <Button variant="danger" onClick={() => deleteObject(selected.id)}>
            <Trash2 className="h-4 w-4" /> {t("Delete")} </Button>
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
