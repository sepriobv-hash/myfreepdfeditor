import { EditorLoading } from "@/components/editor/EditorLoading";
import { Suspense } from "react";
import { EditorLayout } from "@/components/editor/EditorLayout";

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <EditorLayout />
    </Suspense>
  );
}
