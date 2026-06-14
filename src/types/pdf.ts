export type PdfJsDocument = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfJsPage>;
  destroy?: () => Promise<void>;
};

export type PdfJsPage = {
  getViewport: (params: { scale: number; rotation?: number }) => {
    width: number;
    height: number;
    rotation: number;
    transform?: number[];
  };
  getTextContent: () => Promise<{
    items: Array<{
      str?: string;
      width?: number;
      height?: number;
      transform?: number[];
      fontName?: string;
    }>;
    styles?: Record<string, { fontFamily?: string }>;
  }>;
  render: (params: {
    canvasContext: CanvasRenderingContext2D;
    viewport: unknown;
  }) => { promise: Promise<void>; cancel?: () => void };
};
