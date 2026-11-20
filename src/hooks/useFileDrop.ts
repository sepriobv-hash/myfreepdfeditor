"use client";

import { useState, type DragEvent } from "react";

export function useFileDrop(onFiles: (files: File[]) => void, disabled = false) {
  const [dragging, setDragging] = useState(false);

  const dropProps = {
    onDragOver(event: DragEvent<HTMLElement>) {
      event.preventDefault();
      if (event.dataTransfer.types.includes("Files")) {
        event.dataTransfer.dropEffect = disabled ? "none" : "copy";
        if (!disabled) setDragging(true);
      }
    },
    onDragLeave(event: DragEvent<HTMLElement>) {
      const target = event.relatedTarget;
      if (!(target instanceof Node) || !event.currentTarget.contains(target)) setDragging(false);
    },
    onDrop(event: DragEvent<HTMLElement>) {
      event.preventDefault();
      setDragging(false);
      const files = Array.from(event.dataTransfer.files);
      if (!disabled && files.length > 0) onFiles(files);
    },
  };

  return { dragging: dragging && !disabled, dropProps };
}
