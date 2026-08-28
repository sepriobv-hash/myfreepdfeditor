import { createToolMetadata, ToolRoutePage } from "../toolRoute";

export const metadata = createToolMetadata("delete-pdf-pages");

export default function DeletePdfPagesPage() {
  return <ToolRoutePage slug="delete-pdf-pages" />;
}
