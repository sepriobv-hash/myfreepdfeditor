import { createToolMetadata, ToolRoutePage } from "../toolRoute";

export const metadata = createToolMetadata("annotate-pdf");

export default function AnnotatePdfPage() {
  return <ToolRoutePage slug="annotate-pdf" />;
}
