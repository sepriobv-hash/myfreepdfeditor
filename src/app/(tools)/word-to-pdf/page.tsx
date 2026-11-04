import { createToolMetadata, ToolRoutePage } from "../toolRoute";
export const metadata = createToolMetadata("word-to-pdf");
export default function Page() { return <ToolRoutePage slug="word-to-pdf" />; }
