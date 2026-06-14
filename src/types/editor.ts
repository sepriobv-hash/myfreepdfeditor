export type EditorTool =
  | "select"
  | "text"
  | "image"
  | "draw"
  | "highlight"
  | "rectangle"
  | "circle"
  | "line"
  | "signature";

export type Point = {
  x: number;
  y: number;
};

export type EditorObjectType =
  | "text"
  | "image"
  | "drawing"
  | "highlight"
  | "rectangle"
  | "circle"
  | "line"
  | "signature";

export type BaseEditorObject = {
  id: string;
  type: EditorObjectType;
  pageId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
};

export type TextObject = BaseEditorObject & {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  fontWeight: number;
  italic: boolean;
  characterSpacing: number;
  alignment: "left" | "center" | "right";
};

export type ImageObject = BaseEditorObject & {
  type: "image" | "signature";
  src: string;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
};

export type DrawingObject = BaseEditorObject & {
  type: "drawing";
  points: Point[];
  strokeColor: string;
  strokeWidth: number;
};

export type HighlightObject = BaseEditorObject & {
  type: "highlight";
  fillColor: string;
};

export type ShapeObject = BaseEditorObject & {
  type: "rectangle" | "circle";
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
};

export type LineObject = BaseEditorObject & {
  type: "line";
  points: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
};

export type EditorObject =
  | TextObject
  | ImageObject
  | DrawingObject
  | HighlightObject
  | ShapeObject
  | LineObject;

export type PageState = {
  id: string;
  sourcePageIndex: number;
  label: string;
  width: number;
  height: number;
  rotation: number;
  objects: EditorObject[];
};

export type HistorySnapshot = {
  pages: PageState[];
  activePageId: string | null;
};

export type EditorDocumentState = {
  fileName: string;
  originalBytes: ArrayBuffer;
  pageCount: number;
};
