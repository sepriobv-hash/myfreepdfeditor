import { pageMetadata } from "@/lib/pageMetadata";
import { InformationPage } from "@/components/i18n/InformationPage";
export const metadata = pageMetadata("/security");
export default function Page() { return <InformationPage page="security" locale="en" />; }
