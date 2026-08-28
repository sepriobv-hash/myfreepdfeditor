import { createToolMetadata, ToolRoutePage } from "../toolRoute";

export const metadata = createToolMetadata("highlight-pdf");

export default function HighlightPdfPage() {
  return <ToolRoutePage slug="highlight-pdf" />;
}
