import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import type { Banner } from "@/features/content";

export function HeroSection({ banner }: { banner: Banner }) {
  return (
    <section
      aria-labelledby="hero-title"
      className={banner.image ? "grid lg:h-[700px] lg:grid-cols-[1fr_660px]" : "grid lg:min-h-[560px]"}
    >
      <div className="flex flex-col justify-center gap-[22px] px-4 py-14 sm:px-8 lg:pr-20 lg:pl-[90px]">
        {banner.eyebrow ? (
          <p className="text-gold text-[11px] font-medium tracking-[0.22em] uppercase">{banner.eyebrow}</p>
        ) : null}
        <h1
          id="hero-title"
          className="max-w-[520px] font-serif text-5xl leading-[1.04] font-light sm:text-[76px]"
        >
          {banner.title}
        </h1>
        {banner.text ? (
          <p className="text-muted max-w-[420px] text-[15px] leading-[1.7]">{banner.text}</p>
        ) : null}
        <div className="flex flex-wrap gap-3 pt-3.5">
          {banner.cta_label && banner.cta_url ? (
            <ButtonLink href={banner.cta_url}>{banner.cta_label}</ButtonLink>
          ) : null}
          {banner.secondary_cta_label && banner.secondary_cta_url ? (
            <ButtonLink href={banner.secondary_cta_url} variant="outline">
              {banner.secondary_cta_label}
            </ButtonLink>
          ) : null}
        </div>
      </div>
      {banner.image ? (
        <div className="relative aspect-[660/700] lg:aspect-auto">
          <Image
            src={banner.image}
            alt={banner.image_alt}
            fill
            priority
            sizes="(min-width: 1024px) 660px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
    </section>
  );
}
