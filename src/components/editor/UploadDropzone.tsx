"use client";
import { useTranslation } from "@/components/i18n/LocaleProvider";

import { useCallback, useRef } from "react";
import { FileUp, Loader2, ShieldCheck } from "lucide-react";
import { useFileDrop } from "@/hooks/useFileDrop";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type UploadDropzoneCopy = {
  title: string;
  description?: string;
  button: string;
  privacy?: string;
  loading?: string;
};

export function UploadDropzone({
  onFile,
  isLoading,
  onChoose,
  compact = false,
  wide = false,
  illustrated = false,
  copy = {
    title: "Drop your PDF here",
    description:
      "Upload a PDF to edit text overlays, images, highlights, signatures, and drawings in your browser.",
    button: "Choose PDF",
    privacy: "Files stay in browser memory by default",
  },
}: {
  onFile: (file: File) => void | Promise<void>;
  isLoading?: boolean;
  onChoose?: () => void;
  compact?: boolean;
  wide?: boolean;
  illustrated?: boolean;
  copy?: UploadDropzoneCopy;
}) {
  const t = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (isLoading) return;
      const file = files?.[0];
      if (file) await onFile(file);
    },
    [onFile, isLoading],
  );

  const { dragging, dropProps } = useFileDrop(files => void onFile(files[0]), isLoading);

  return (
    <div
      aria-busy={Boolean(isLoading)}
      className={cn(
        "rounded-lg border border-dashed border-[#b8ab9d] bg-white text-center transition-colors",
        dragging && "border-brand-500 bg-brand-50 ring-2 ring-brand-100",
        compact ? "p-4" : wide ? "px-4 py-6 sm:px-8 sm:py-8" : "px-5 py-7 sm:px-8",
      )}
      {...dropProps}
    >
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="application/pdf,.pdf"
        aria-label={t(copy.button)}
        disabled={isLoading}
        onChange={(event) => {
          void handleFiles(event.target.files);
          event.currentTarget.value = "";
        }}
      />
      <div aria-hidden="true" className={cn("relative mx-auto mb-4 grid place-items-center", illustrated ? "h-[4.15rem] w-[4.5rem]" : "size-10")}>
        {illustrated && <span className="absolute left-[1.375rem] top-1 h-14 w-10 rotate-[12deg] rounded border border-[#c9baaa] bg-[#eae0d2]" />}
        <span className={cn(
          "relative grid place-items-center text-brand-600",
          illustrated ? "h-14 w-10 -rotate-6 rounded border border-[#bcab98] bg-paper shadow-sm" : "size-10 rounded-md bg-brand-50",
        )}>
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <FileUp size={20} />}
        </span>
      </div>
      <h2 className={cn("font-semibold leading-snug text-ink", compact ? "text-base" : "text-xl")}>
        {t(copy.title)}
      </h2>
      {copy.description && <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-muted">{t(copy.description)}</p>}
      <Button
        className={cn("mt-4 h-auto min-h-11 px-5 py-2.5 font-semibold", wide && "min-h-12 text-base")}
        variant="primary"
        disabled={isLoading}
        onClick={() => {
          onChoose?.();
          inputRef.current?.click();
        }}
      >
        {isLoading ? <Loader2 aria-hidden="true" className="size-4 shrink-0 animate-spin" /> : <FileUp aria-hidden="true" className="size-4 shrink-0" />}
        <span role={isLoading ? "status" : undefined}>
          {isLoading ? t(copy.loading ?? "Opening PDF…") : t(copy.button)}
        </span>
      </Button>
      {copy.privacy && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
          <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0" />
          {t(copy.privacy)}
        </p>
      )}
    </div>
  );
}
