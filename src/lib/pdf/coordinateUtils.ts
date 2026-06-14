export type PdfPageDimensions = {
  width: number;
  height: number;
};

export type CanvasRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function canvasRectToPdf(rect: CanvasRect, page: PdfPageDimensions) {
  return {
    x: rect.x,
    y: page.height - rect.y - rect.height,
    width: rect.width,
    height: rect.height,
  };
}

export function canvasPointToPdf(point: { x: number; y: number }, page: PdfPageDimensions) {
  return {
    x: point.x,
    y: page.height - point.y,
  };
}

export function normalizeDragRect(start: { x: number; y: number }, end: { x: number; y: number }) {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
}

export function hexToRgb01(hex: string) {
  const normalized = hex.replace("#", "");
  const fallback = normalized.length === 3 ? normalized.replace(/(.)/g, "$1$1") : normalized;
  const value = Number.parseInt(fallback.slice(0, 6), 16);
  if (Number.isNaN(value)) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255,
  };
}
