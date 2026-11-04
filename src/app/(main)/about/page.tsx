import { pageMetadata } from "@/lib/pageMetadata";
import { InformationPage } from "@/components/i18n/InformationPage";
export const metadata = pageMetadata("/about");
export default function Page() { return <InformationPage page="about" locale="en" />; }
