import { createToolMetadata, ToolRoutePage } from "../toolRoute";
export const metadata = createToolMetadata("pdf-to-png");
export default function Page() { return <ToolRoutePage slug="pdf-to-png" />; }
