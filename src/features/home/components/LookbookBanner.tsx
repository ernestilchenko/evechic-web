import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import type { Banner } from "@/features/content";
import { cn } from "@/lib/cn";

export function LookbookBanner({ banner }: { banner: Banner }) {
  return (
    <section
      aria-labelledby="lookbook-title"
      className={cn("relative h-[420px] overflow-hidden lg:h-[470px]", !banner.image && "bg-ink")}
    >
      {banner.image ? (
        <>
          <Image src={banner.image} alt={banner.image_alt} fill sizes="100vw" className="object-cover" />
          <div className="bg-ink/40 absolute inset-0" />
        </>
      ) : null}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center">
        {banner.eyebrow ? (
          <p className="text-sand font-serif text-3xl font-light tracking-[0.04em] italic sm:text-[40px]">
            {banner.eyebrow}
          </p>
        ) : null}
        <h2
          id="lookbook-title"
          className="font-serif text-4xl font-light tracking-[0.02em] text-white sm:text-[62px]"
        >
          {banner.title}
        </h2>
        {banner.cta_label && banner.cta_url ? (
          <ButtonLink href={banner.cta_url} variant="light">
            {banner.cta_label}
          </ButtonLink>
        ) : null}
      </div>
    </section>
  );
}
