import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { activePdfTools } from "@/lib/pdfTools";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Free PDF Tools",
  description:
    "Browse free PDF tools from MyFreePDFEditor: edit, sign, merge, compress, annotate, highlight, add images, reorder pages, and delete pages.",
  alternates: {
    canonical: "/all-tools",
  },
  openGraph: {
    title: `All Free PDF Tools - ${siteName}`,
    description: "Free PDF tools that work in your browser with no signup and no watermark.",
    url: `${siteUrl}/all-tools`,
    siteName,
    type: "website",
  },
};

const categoryOrder = ["Edit", "Sign", "Annotate", "Organize", "Optimize"] as const;

export default function AllToolsPage() {
  return (
    <main className="min-h-screen bg-mist text-ink">
      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <Link className="text-sm font-semibold text-brand-600 hover:text-brand-700" href="/">
          MyFreePDFEditor
        </Link>
        <div className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-brand-600">All tools</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Free PDF tools that work in your browser
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Start with the tools that are available today. Each tool opens a real PDF editing
            workflow, not a dead SEO page. More tools will be added as they become production-ready.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          {categoryOrder.map((category) => {
            const tools = activePdfTools.filter((tool) => tool.category === category);
            if (tools.length === 0) return null;

            return (
              <section key={category}>
                <h2 className="text-2xl font-semibold text-ink">{category}</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/${tool.slug}`}
                      className="group rounded-lg border border-line bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-panel"
                    >
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-rose-50 text-rose-600">
                        <Check className="h-4 w-4" />
                      </div>
                      <h3 className="text-lg font-semibold text-ink">{tool.shortTitle}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{tool.intro}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                        Open tool
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
