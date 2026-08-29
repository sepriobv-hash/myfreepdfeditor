import { createToolMetadata, ToolRoutePage } from "../toolRoute";

export const metadata = createToolMetadata("compress-pdf");

export default function CompressPdfPage() {
  return <ToolRoutePage slug="compress-pdf" />;
}
