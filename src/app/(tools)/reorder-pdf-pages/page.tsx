import { createToolMetadata, ToolRoutePage } from "../toolRoute";

export const metadata = createToolMetadata("reorder-pdf-pages");

export default function ReorderPdfPagesPage() {
  return <ToolRoutePage slug="reorder-pdf-pages" />;
}
