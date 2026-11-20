"use client";

import { useEffect, useRef } from "react";
import { clearUploadParameters, consumePendingUpload } from "@/lib/editor/uploadHandoff";

export function usePendingToolUpload(onFile: (file: File) => void, onMissing: () => void, enabled = true) {
  const started = useRef(false);
  const active = useRef(false);
  const callbacks = useRef({ onFile, onMissing });
  callbacks.current = { onFile, onMissing };

  useEffect(() => {
    active.current = enabled;
    const id = new URL(window.location.href).searchParams.get("uploadId");
    if (id && enabled && !started.current) {
      started.current = true;
      clearUploadParameters(id);
      void consumePendingUpload(id).then(file => {
        if (!active.current) return;
        if (file) callbacks.current.onFile(file);
        else callbacks.current.onMissing();
      }).catch(() => {
        if (active.current) callbacks.current.onMissing();
      });
    }
    return () => { active.current = false; };
  }, [enabled]);
}
