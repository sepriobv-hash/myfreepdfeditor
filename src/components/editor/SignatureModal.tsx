"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { ImageUp, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { imageFileToEditorData } from "@/lib/editor/fileUtils";

export function SignatureModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { dataUrl: string; mimeType: "image/png" | "image/jpeg" }) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 3;
    context.strokeStyle = "#111827";
  }, [open]);

  if (!open) return null;

  function pointer(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function clear() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-xl rounded-lg border border-line bg-white p-5 shadow-panel">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Create signature</h2>
            <p className="text-sm text-slate-600">Draw or upload a signature image.</p>
          </div>
          <Button title="Close" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <canvas
          ref={canvasRef}
          width={560}
          height={190}
          className="h-48 w-full touch-none rounded-md border border-line bg-white"
          onPointerDown={(event) => {
            const context = event.currentTarget.getContext("2d");
            if (!context) return;
            const point = pointer(event);
            context.beginPath();
            context.moveTo(point.x, point.y);
            setDrawing(true);
          }}
          onPointerMove={(event) => {
            if (!drawing) return;
            const context = event.currentTarget.getContext("2d");
            if (!context) return;
            const point = pointer(event);
            context.lineTo(point.x, point.y);
            context.stroke();
          }}
          onPointerUp={() => setDrawing(false)}
          onPointerLeave={() => setDrawing(false)}
        />

        <div className="mt-4 flex flex-wrap justify-between gap-3">
          <div className="flex gap-2">
            <Button variant="secondary" onClick={clear}>
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
            <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink transition hover:bg-slate-50">
              <ImageUp className="h-4 w-4" />
              Upload
              <input
                className="hidden"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const image = await imageFileToEditorData(file);
                  onCreate(image);
                  onClose();
                }}
              />
            </label>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              const dataUrl = canvasRef.current?.toDataURL("image/png");
              if (dataUrl) onCreate({ dataUrl, mimeType: "image/png" });
              onClose();
            }}
          >
            Add Signature
          </Button>
        </div>
      </div>
    </div>
  );
}
