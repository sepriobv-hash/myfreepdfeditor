import Image from "next/image";
import { siteName } from "@/lib/site";

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  if (compact) {
    return (
      <span className="flex items-center gap-3">
        <Image
          src="/brand/icon-192.png"
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 rounded-md object-contain"
          priority
        />
        <span className="text-lg font-semibold">{siteName}</span>
      </span>
    );
  }

  return (
    <Image
      src="/brand/myfreepdfeditor-logo.png"
      alt={siteName}
      width={360}
      height={90}
      className="h-auto w-full max-w-48 object-contain sm:max-w-60"
      priority
    />
  );
}
