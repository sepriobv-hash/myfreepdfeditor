import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "PDF Editor Workspace",
  description: "Open the MyFreePDFEditor workspace to edit a local PDF in your browser.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function EditorLayout({ children }: { children: ReactNode }) {
  return children;
}
