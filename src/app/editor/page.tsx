import { Suspense } from "react";
import { EditorLayout } from "@/components/editor/EditorLayout";

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <EditorLayout />
    </Suspense>
  );
}

function EditorLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-5">
      <div className="rounded-lg border border-line bg-white p-6 text-center shadow-soft">
        <div className="text-sm font-semibold text-ink">Opening PDF editor...</div>
        <div className="mt-2 text-sm text-slate-500">Preparing your workspace.</div>
      </div>
    </main>
  );
}
