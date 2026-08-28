import { createToolMetadata, ToolRoutePage } from "../toolRoute";

export const metadata = createToolMetadata("edit-pdf");

export default function EditPdfPage() {
  return <ToolRoutePage slug="edit-pdf" />;
}
