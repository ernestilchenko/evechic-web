import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import heroImage from "@public/images/home/hero.jpg";

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="grid lg:h-[700px] lg:grid-cols-[1fr_660px]">
      <div className="flex flex-col justify-center gap-[22px] px-4 py-14 sm:px-8 lg:pr-20 lg:pl-[90px]">
        <p className="text-gold text-[11px] font-medium tracking-[0.22em] uppercase">
          {t("home.hero.eyebrow")}
        </p>
        <h1
          id="hero-title"
          className="max-w-[520px] font-serif text-5xl leading-[1.04] font-light sm:text-[76px]"
        >
          {t("home.hero.title")}
        </h1>
        <p className="text-muted max-w-[420px] text-[15px] leading-[1.7]">{t("home.hero.text")}</p>
        <div className="flex flex-wrap gap-3 pt-3.5">
          <ButtonLink href={routes.catalog}>{t("home.hero.primaryCta")}</ButtonLink>
          <ButtonLink href={routes.newArrivals} variant="outline">
            {t("home.hero.secondaryCta")}
          </ButtonLink>
        </div>
      </div>
      <div className="relative aspect-[660/700] lg:aspect-auto">
        <Image
          src={heroImage}
          alt={t("home.hero.imageAlt")}
          fill
          priority
          sizes="(min-width: 1024px) 660px, 100vw"
          placeholder="blur"
          className="object-cover"
        />
      </div>
    </section>
  );
}
