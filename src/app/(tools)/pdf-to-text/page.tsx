import { createToolMetadata, ToolRoutePage } from "../toolRoute";

export const metadata = createToolMetadata("pdf-to-text");

export default function Page() {
  return <ToolRoutePage slug="pdf-to-text" />;
}
