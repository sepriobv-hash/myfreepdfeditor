"use client";

import { useCallback, useRef, useState } from "react";
import { BadgeCheck, FileUp, Loader2, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type UploadDropzoneCopy = {
  title: string;
  description: string;
  button: string;
  privacy: string;
  socialProof?: {
    rating: string;
    text: string;
  };
};

const avatarStyles = [
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-teal-100 text-teal-700",
  "bg-violet-100 text-violet-700",
  "bg-slate-900 text-white",
];

export function UploadDropzone({
  onFile,
  isLoading,
  compact = false,
  wide = false,
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
  compact?: boolean;
  wide?: boolean;
  copy?: UploadDropzoneCopy;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (file) await onFile(file);
    },
    [onFile],
  );

  return (
    <div
      className={cn(
        "group rounded-lg border border-dashed border-slate-300 bg-white text-center shadow-soft transition",
        isDragging && "border-brand-500 bg-brand-50",
        compact ? "p-5" : wide ? "px-6 py-8 md:px-12 md:py-12" : "p-8 md:p-10",
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        void handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="application/pdf,.pdf"
        onChange={(event) => void handleFiles(event.target.files)}
      />
      <div
        className={cn(
          "mx-auto mb-4 flex items-center justify-center rounded-md bg-brand-50 text-brand-600",
          wide ? "h-16 w-16" : "h-12 w-12",
        )}
      >
        {isLoading ? (
          <Loader2 className={cn("animate-spin", wide ? "h-7 w-7" : "h-5 w-5")} />
        ) : (
          <FileUp className={cn(wide ? "h-7 w-7" : "h-5 w-5")} />
        )}
      </div>
      <h3 className={cn("font-semibold text-ink", compact ? "text-base" : wide ? "text-3xl" : "text-xl")}>
        {copy.title}
      </h3>
      <p className={cn("mx-auto mt-2 text-sm leading-6 text-slate-600", wide ? "max-w-2xl" : "max-w-md")}>
        {copy.description}
      </p>
      <Button
        className={cn("mt-5", wide && "h-12 px-6 text-base")}
        variant="primary"
        disabled={isLoading}
        onClick={() => inputRef.current?.click()}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
        {copy.button}
      </Button>
      {copy.socialProof && (
        <div className="mx-auto mt-5 flex w-fit flex-col items-center justify-center gap-3 rounded-full border border-line bg-white px-4 py-2 shadow-sm sm:flex-row">
          <div className="flex -space-x-2">
            {["A", "M", "J", "S", "+"].map((label, index) => (
              <span
                key={label}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-sm",
                  avatarStyles[index],
                )}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-sm font-semibold text-ink">
            <span className="flex items-center gap-0.5 text-amber-500" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((star) => (
                <Star key={star} className="h-3.5 w-3.5 fill-current" />
              ))}
            </span>
            <span>{copy.socialProof.rating}</span>
            <span className="font-medium text-slate-700">{copy.socialProof.text}</span>
            <BadgeCheck className="h-4 w-4 fill-sky-500 text-white" aria-hidden="true" />
          </div>
        </div>
      )}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-accent-600" />
        {copy.privacy}
      </div>
    </div>
  );
}
