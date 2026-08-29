import { createToolMetadata, ToolRoutePage } from "../toolRoute";

export const metadata = createToolMetadata("merge-pdf");

export default function MergePdfPage() {
  return <ToolRoutePage slug="merge-pdf" />;
}
