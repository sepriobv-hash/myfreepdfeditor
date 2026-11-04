import { pageMetadata } from "@/lib/pageMetadata";
import { InformationPage } from "@/components/i18n/InformationPage";
export const metadata = pageMetadata("/terms");
export default function Page() { return <InformationPage page="terms" locale="en" />; }
