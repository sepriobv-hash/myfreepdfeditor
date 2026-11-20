import Image from "next/image";
export function BrandLogo() {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap sm:gap-2">
      <Image
        src="/brand/icon-192.png"
        alt=""
        width={34}
        height={34}
        className="size-8 shrink-0 object-contain mix-blend-multiply sm:size-[34px]"
        unoptimized
      />
      <span className="text-[0.9375rem] font-bold tracking-[-0.045em] text-ink sm:text-lg">
        MyFree<span className="text-brand-600">PDF</span>Editor
      </span>
    </span>
  );
}
