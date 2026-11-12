"use client";
import { useEffect, useRef } from "react";
import { consumePendingUpload } from "@/lib/editor/uploadHandoff";

/** Consume a local file once, including under React Strict Mode. */
export function usePendingToolUpload(onFile: (file: File) => void, onMissing: () => void) {
 const started = useRef(false);
 const callbacks = useRef({ onFile, onMissing });
 callbacks.current = { onFile, onMissing };
 useEffect(() => {
  const url = new URL(window.location.href);
  const id = url.searchParams.get("uploadId");
  if (!id || started.current) return;
  started.current = true;
  url.searchParams.delete("uploadId");
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  void consumePendingUpload(id).then(file => {
   if (file) callbacks.current.onFile(file);
   else callbacks.current.onMissing();
  }).catch(() => callbacks.current.onMissing());
 }, []);
}
