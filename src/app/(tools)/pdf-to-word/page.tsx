import { createToolMetadata, ToolRoutePage } from "../toolRoute";
export const metadata = createToolMetadata("pdf-to-word");
export default function Page() { return <ToolRoutePage slug="pdf-to-word" />; }
