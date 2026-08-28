import { createToolMetadata, ToolRoutePage } from "../toolRoute";

export const metadata = createToolMetadata("add-image-to-pdf");

export default function AddImageToPdfPage() {
  return <ToolRoutePage slug="add-image-to-pdf" />;
}
