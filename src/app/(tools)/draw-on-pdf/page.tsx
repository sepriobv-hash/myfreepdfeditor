import { createToolMetadata, ToolRoutePage } from "../toolRoute";

export const metadata = createToolMetadata("draw-on-pdf");

export default function DrawOnPdfPage() {
  return <ToolRoutePage slug="draw-on-pdf" />;
}
