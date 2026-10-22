import Image from "next/image";

import { cn } from "@/lib/cn";

type ThumbProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
};

export function Thumb({ src, alt, className }: ThumbProps) {
  return (
    <span
      className={cn("bg-sand relative block h-14 w-11 shrink-0 overflow-hidden rounded-[3px]", className)}
    >
      {src ? <Image src={src} alt={alt} fill sizes="44px" className="object-cover" /> : null}
    </span>
  );
}
