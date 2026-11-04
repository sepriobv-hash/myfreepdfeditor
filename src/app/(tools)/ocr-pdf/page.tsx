import { createToolMetadata, ToolRoutePage } from "../toolRoute";
export const metadata = createToolMetadata("ocr-pdf");
export default function Page() { return <ToolRoutePage slug="ocr-pdf" />; }
