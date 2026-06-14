import type {
  DrawingObject,
  EditorObject,
  EditorObjectType,
  HighlightObject,
  ImageObject,
  LineObject,
  PageState,
  ShapeObject,
  TextObject,
} from "@/types/editor";

export function createObjectId() {
  return `obj_${crypto.randomUUID()}`;
}

export function getNextZIndex(page: PageState) {
  return page.objects.reduce((max, object) => Math.max(max, object.zIndex), 0) + 1;
}

type BaseInput = {
  page: PageState;
  x: number;
  y: number;
};

export function createTextObject({ page, x, y }: BaseInput): TextObject {
  return {
    id: createObjectId(),
    type: "text",
    pageId: page.id,
    x,
    y,
    width: 220,
    height: 58,
    rotation: 0,
    opacity: 1,
    zIndex: getNextZIndex(page),
    text: "Edit this text",
    fontSize: 24,
    fontFamily: "Helvetica",
    color: "#111827",
    bold: false,
    fontWeight: 400,
    italic: false,
    characterSpacing: 0,
    alignment: "left",
  };
}

export function createTextReplacementObjects({
  page,
  x,
  y,
  width,
  height,
  text,
  fontSize,
  fontFamily = "Helvetica",
  color = "#111827",
  bold = false,
  fontWeight = bold ? 700 : 400,
  italic = false,
  characterSpacing = 0,
}: BaseInput & {
  width: number;
  height: number;
  text: string;
  fontSize: number;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  fontWeight?: number;
  italic?: boolean;
  characterSpacing?: number;
}): { cover: ShapeObject; replacement: TextObject } {
  const zIndex = getNextZIndex(page);
  const cover: ShapeObject = {
    id: createObjectId(),
    type: "rectangle",
    pageId: page.id,
    x: Math.max(0, x - 1),
    y: Math.max(0, y - 1),
    width: width + 2,
    height: height + 3,
    rotation: 0,
    opacity: 1,
    zIndex,
    fillColor: "#ffffff",
    strokeColor: "#ffffff",
    strokeWidth: 0,
  };
  const replacement: TextObject = {
    id: createObjectId(),
    type: "text",
    pageId: page.id,
    x,
    y,
    width: Math.max(width + 8, 24),
    height: Math.max(height + 6, fontSize * 1.25),
    rotation: 0,
    opacity: 1,
    zIndex: zIndex + 1,
    text,
    fontSize,
    fontFamily,
    color,
    bold,
    fontWeight,
    italic,
    characterSpacing,
    alignment: "left",
  };
  return { cover, replacement };
}

export function createImageObject({
  page,
  x,
  y,
  src,
  mimeType,
  type = "image",
}: BaseInput & {
  src: string;
  mimeType: ImageObject["mimeType"];
  type?: Extract<EditorObjectType, "image" | "signature">;
}): ImageObject {
  return {
    id: createObjectId(),
    type,
    pageId: page.id,
    x,
    y,
    width: type === "signature" ? 260 : 240,
    height: type === "signature" ? 96 : 160,
    rotation: 0,
    opacity: 1,
    zIndex: getNextZIndex(page),
    src,
    mimeType,
  };
}

export function createDrawingObject({
  page,
  points,
  strokeColor,
  strokeWidth,
}: {
  page: PageState;
  points: { x: number; y: number }[];
  strokeColor: string;
  strokeWidth: number;
}): DrawingObject {
  const bounds = getPointBounds(points);
  return {
    id: createObjectId(),
    type: "drawing",
    pageId: page.id,
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    rotation: 0,
    opacity: 1,
    zIndex: getNextZIndex(page),
    points: points.map((point) => ({ x: point.x - bounds.x, y: point.y - bounds.y })),
    strokeColor,
    strokeWidth,
  };
}

export function createHighlightObject({
  page,
  x,
  y,
  width,
  height,
}: BaseInput & { width: number; height: number }): HighlightObject {
  return {
    id: createObjectId(),
    type: "highlight",
    pageId: page.id,
    x,
    y,
    width,
    height,
    rotation: 0,
    opacity: 0.35,
    zIndex: getNextZIndex(page),
    fillColor: "#fde047",
  };
}

export function createShapeObject({
  page,
  x,
  y,
  width,
  height,
  type,
}: BaseInput & { width: number; height: number; type: "rectangle" | "circle" }): ShapeObject {
  return {
    id: createObjectId(),
    type,
    pageId: page.id,
    x,
    y,
    width,
    height,
    rotation: 0,
    opacity: 1,
    zIndex: getNextZIndex(page),
    fillColor: type === "circle" ? "#ffffff00" : "#ffffff",
    strokeColor: "#1976d2",
    strokeWidth: 2,
  };
}

export function createLineObject({
  page,
  x,
  y,
  width,
  height,
}: BaseInput & { width: number; height: number }): LineObject {
  return {
    id: createObjectId(),
    type: "line",
    pageId: page.id,
    x,
    y,
    width,
    height,
    rotation: 0,
    opacity: 1,
    zIndex: getNextZIndex(page),
    points: [0, 0, width, height],
    strokeColor: "#1976d2",
    strokeWidth: 3,
  };
}

export function duplicateEditorObject(object: EditorObject): EditorObject {
  return {
    ...object,
    id: createObjectId(),
    x: object.x + 18,
    y: object.y + 18,
    zIndex: object.zIndex + 1,
  } as EditorObject;
}

function getPointBounds(points: { x: number; y: number }[]) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  return {
    x: minX,
    y: minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}
