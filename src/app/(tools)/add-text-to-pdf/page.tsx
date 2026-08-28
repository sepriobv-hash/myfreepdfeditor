import { createToolMetadata, ToolRoutePage } from "../toolRoute";

export const metadata = createToolMetadata("add-text-to-pdf");

export default function AddTextToPdfPage() {
  return <ToolRoutePage slug="add-text-to-pdf" />;
}
