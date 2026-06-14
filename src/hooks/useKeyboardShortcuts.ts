"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";

export function useKeyboardShortcuts(onExport: () => void) {
  const deleteObject = useEditorStore((state) => state.deleteObject);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const selectObject = useEditorStore((state) => state.selectObject);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      const mod = event.metaKey || event.ctrlKey;

      if (!isTyping && (event.key === "Delete" || event.key === "Backspace")) {
        event.preventDefault();
        deleteObject();
        return;
      }

      if (!isTyping && event.key === "Escape") {
        selectObject(null);
        return;
      }

      if (mod && event.key.toLowerCase() === "s") {
        event.preventDefault();
        onExport();
        return;
      }

      if (mod && event.key.toLowerCase() === "z" && !event.shiftKey) {
        event.preventDefault();
        undo();
        return;
      }

      if (
        (mod && event.key.toLowerCase() === "y") ||
        (mod && event.shiftKey && event.key.toLowerCase() === "z")
      ) {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteObject, onExport, redo, selectObject, undo]);
}
