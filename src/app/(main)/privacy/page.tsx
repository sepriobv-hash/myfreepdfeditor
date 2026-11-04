import { pageMetadata } from "@/lib/pageMetadata";
import { InformationPage } from "@/components/i18n/InformationPage";
export const metadata = pageMetadata("/privacy");
export default function Page() { return <InformationPage page="privacy" locale="en" />; }
