"use client";

import { create } from "zustand";
import type {
  EditorDocumentState,
  EditorObject,
  EditorTool,
  HistorySnapshot,
  PageState,
} from "@/types/editor";
import type { PdfJsDocument } from "@/types/pdf";
import { loadPdfFromBytes } from "@/lib/pdf/renderPdf";
import { duplicateEditorObject } from "@/lib/editor/objectUtils";
import { sanitizeFileName } from "@/lib/utils";

type EditorStore = {
  document: EditorDocumentState | null;
  pdfDoc: PdfJsDocument | null;
  pages: PageState[];
  activePageId: string | null;
  selectedObjectId: string | null;
  tool: EditorTool;
  zoom: number;
  isLoading: boolean;
  isExporting: boolean;
  error: string | null;
  history: HistorySnapshot[];
  future: HistorySnapshot[];
  loadPdf: (file: File) => Promise<void>;
  resetEditor: () => void;
  setTool: (tool: EditorTool) => void;
  setZoom: (zoom: number) => void;
  setActivePage: (pageId: string) => void;
  selectObject: (objectId: string | null) => void;
  setIsExporting: (isExporting: boolean) => void;
  addObject: (object: EditorObject) => void;
  addObjects: (objects: EditorObject[], selectedObjectId?: string | null) => void;
  updateObject: (objectId: string, patch: Partial<EditorObject>, trackHistory?: boolean) => void;
  deleteObject: (objectId?: string | null) => void;
  duplicateObject: (objectId?: string | null) => void;
  bringObjectForward: (objectId?: string | null) => void;
  sendObjectBackward: (objectId?: string | null) => void;
  deletePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => void;
  movePage: (pageId: string, direction: "up" | "down") => void;
  undo: () => void;
  redo: () => void;
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  document: null,
  pdfDoc: null,
  pages: [],
  activePageId: null,
  selectedObjectId: null,
  tool: "select",
  zoom: 1,
  isLoading: false,
  isExporting: false,
  error: null,
  history: [],
  future: [],

  async loadPdf(file) {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      set({ error: "Please choose a valid PDF file." });
      throw new Error("Invalid PDF file");
    }

    if (file.size > 60 * 1024 * 1024) {
      set({ error: "This PDF is large. It may take a moment to render in the browser." });
    }

    set({ isLoading: true, error: null, selectedObjectId: null });
    const currentDoc = get().pdfDoc;
    await currentDoc?.destroy?.().catch(() => undefined);

    try {
      const originalBytes = await file.arrayBuffer();
      const pdfDoc = await loadPdfFromBytes(originalBytes);
      const pages: PageState[] = [];

      for (let index = 0; index < pdfDoc.numPages; index += 1) {
        const page = await pdfDoc.getPage(index + 1);
        const viewport = page.getViewport({ scale: 1 });
        pages.push({
          id: `page_${crypto.randomUUID()}`,
          sourcePageIndex: index,
          label: `${index + 1}`,
          width: viewport.width,
          height: viewport.height,
          rotation: viewport.rotation ?? 0,
          objects: [],
        });
      }

      set({
        document: {
          fileName: sanitizeFileName(file.name),
          originalBytes,
          pageCount: pdfDoc.numPages,
        },
        pdfDoc,
        pages,
        activePageId: pages[0]?.id ?? null,
        selectedObjectId: null,
        tool: "select",
        zoom: 1,
        isLoading: false,
        history: [],
        future: [],
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Could not load this PDF.",
      });
      throw error;
    }
  },

  resetEditor() {
    set({
      document: null,
      pdfDoc: null,
      pages: [],
      activePageId: null,
      selectedObjectId: null,
      tool: "select",
      zoom: 1,
      isLoading: false,
      isExporting: false,
      error: null,
      history: [],
      future: [],
    });
  },

  setTool(tool) {
    set({ tool, selectedObjectId: tool === "select" ? get().selectedObjectId : null });
  },

  setZoom(zoom) {
    set({ zoom: Math.min(2.5, Math.max(0.4, Number(zoom.toFixed(2)))) });
  },

  setActivePage(pageId) {
    set({ activePageId: pageId, selectedObjectId: null });
  },

  selectObject(objectId) {
    set({ selectedObjectId: objectId, tool: "select" });
  },

  setIsExporting(isExporting) {
    set({ isExporting });
  },

  addObject(object) {
    set((state) => ({
      ...withHistory(state),
      pages: state.pages.map((page) =>
        page.id === object.pageId ? { ...page, objects: [...page.objects, object] } : page,
      ),
      selectedObjectId: object.id,
      tool: "select",
    }));
  },

  addObjects(objects, selectedObjectId = objects.at(-1)?.id ?? null) {
    if (!objects.length) return;
    set((state) => ({
      ...withHistory(state),
      pages: state.pages.map((page) => ({
        ...page,
        objects: [...page.objects, ...objects.filter((object) => object.pageId === page.id)],
      })),
      selectedObjectId,
      tool: "select",
    }));
  },

  updateObject(objectId, patch, trackHistory = true) {
    set((state) => ({
      ...(trackHistory ? withHistory(state) : {}),
      pages: state.pages.map((page) => ({
        ...page,
        objects: page.objects.map((object) =>
          object.id === objectId ? ({ ...object, ...patch } as EditorObject) : object,
        ),
      })),
    }));
  },

  deleteObject(objectId = get().selectedObjectId) {
    if (!objectId) return;
    set((state) => ({
      ...withHistory(state),
      pages: state.pages.map((page) => ({
        ...page,
        objects: page.objects.filter((object) => object.id !== objectId),
      })),
      selectedObjectId: null,
    }));
  },

  duplicateObject(objectId = get().selectedObjectId) {
    if (!objectId) return;
    const page = get().pages.find((candidate) =>
      candidate.objects.some((object) => object.id === objectId),
    );
    const object = page?.objects.find((candidate) => candidate.id === objectId);
    if (!page || !object) return;
    const duplicate = duplicateEditorObject(object);
    set((state) => ({
      ...withHistory(state),
      pages: state.pages.map((candidate) =>
        candidate.id === page.id
          ? { ...candidate, objects: [...candidate.objects, duplicate] }
          : candidate,
      ),
      selectedObjectId: duplicate.id,
    }));
  },

  bringObjectForward(objectId = get().selectedObjectId) {
    if (!objectId) return;
    const maxZ = Math.max(...get().pages.flatMap((page) => page.objects.map((object) => object.zIndex)), 0);
    get().updateObject(objectId, { zIndex: maxZ + 1 } as Partial<EditorObject>);
  },

  sendObjectBackward(objectId = get().selectedObjectId) {
    if (!objectId) return;
    get().updateObject(objectId, { zIndex: 0 } as Partial<EditorObject>);
  },

  deletePage(pageId) {
    if (get().pages.length <= 1) {
      set({ error: "A document needs at least one page." });
      return;
    }
    set((state) => {
      const nextPages = state.pages.filter((page) => page.id !== pageId);
      const nextActive =
        state.activePageId === pageId ? nextPages[Math.max(0, nextPages.length - 1)]?.id : state.activePageId;
      return {
        ...withHistory(state),
        pages: nextPages.map((page, index) => ({ ...page, label: `${index + 1}` })),
        activePageId: nextActive ?? null,
        selectedObjectId: null,
      };
    });
  },

  duplicatePage(pageId) {
    set((state) => {
      const index = state.pages.findIndex((page) => page.id === pageId);
      if (index < 0) return state;
      const page = state.pages[index];
      const duplicate: PageState = {
        ...clonePage(page),
        id: `page_${crypto.randomUUID()}`,
        objects: page.objects.map((object) => ({
          ...object,
          id: `obj_${crypto.randomUUID()}`,
          pageId: page.id,
        })) as EditorObject[],
      };
      duplicate.objects = duplicate.objects.map((object) => ({ ...object, pageId: duplicate.id })) as EditorObject[];
      const nextPages = [...state.pages.slice(0, index + 1), duplicate, ...state.pages.slice(index + 1)];
      return {
        ...withHistory(state),
        pages: nextPages.map((candidate, pageIndex) => ({ ...candidate, label: `${pageIndex + 1}` })),
        activePageId: duplicate.id,
        selectedObjectId: null,
      };
    });
  },

  movePage(pageId, direction) {
    set((state) => {
      const index = state.pages.findIndex((page) => page.id === pageId);
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || nextIndex < 0 || nextIndex >= state.pages.length) return state;
      const pages = [...state.pages];
      const [page] = pages.splice(index, 1);
      pages.splice(nextIndex, 0, page);
      return {
        ...withHistory(state),
        pages: pages.map((candidate, pageIndex) => ({ ...candidate, label: `${pageIndex + 1}` })),
      };
    });
  },

  undo() {
    set((state) => {
      const previous = state.history.at(-1);
      if (!previous) return state;
      return {
        pages: clonePages(previous.pages),
        activePageId: previous.activePageId,
        selectedObjectId: null,
        history: state.history.slice(0, -1),
        future: [snapshot(state), ...state.future].slice(0, 40),
      };
    });
  },

  redo() {
    set((state) => {
      const next = state.future[0];
      if (!next) return state;
      return {
        pages: clonePages(next.pages),
        activePageId: next.activePageId,
        selectedObjectId: null,
        history: [...state.history, snapshot(state)].slice(-40),
        future: state.future.slice(1),
      };
    });
  },
}));

function withHistory(state: Pick<EditorStore, "pages" | "activePageId" | "history">) {
  return {
    history: [...state.history, snapshot(state)].slice(-40),
    future: [],
  };
}

function snapshot(state: Pick<EditorStore, "pages" | "activePageId">): HistorySnapshot {
  return {
    pages: clonePages(state.pages),
    activePageId: state.activePageId,
  };
}

function clonePages(pages: PageState[]) {
  return pages.map(clonePage);
}

function clonePage(page: PageState): PageState {
  return {
    ...page,
    objects: page.objects.map((object) => {
      if (object.type === "drawing") {
        return { ...object, points: object.points.map((point) => ({ ...point })) };
      }
      if (object.type === "line") {
        return { ...object, points: [...object.points] as [number, number, number, number] };
      }
      return { ...object };
    }) as EditorObject[],
  };
}
