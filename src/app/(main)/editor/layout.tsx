import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/pageMetadata";
export const metadata = pageMetadata("/editor");
export default function EditorLayout({ children }: { children: ReactNode }) { return children; }
