import { createToolMetadata, ToolRoutePage } from "../toolRoute";

export const metadata = createToolMetadata("sign-pdf");

export default function SignPdfPage() {
  return <ToolRoutePage slug="sign-pdf" />;
}
