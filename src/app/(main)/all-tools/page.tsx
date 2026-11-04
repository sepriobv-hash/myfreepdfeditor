import { pageMetadata } from "@/lib/pageMetadata";

export const metadata = pageMetadata("/all-tools");

import AllToolsContent from "@/components/tools/AllToolsContent";
export default function AllToolsPage() { return <AllToolsContent />; }
