import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import bannerImage from "@public/images/home/lookbook-banner.jpg";

export function LookbookBanner() {
  return (
    <section aria-labelledby="lookbook-title" className="relative h-[420px] overflow-hidden lg:h-[470px]">
      <Image
        src={bannerImage}
        alt={t("home.lookbook.imageAlt")}
        fill
        sizes="100vw"
        placeholder="blur"
        className="object-cover"
      />
      <div className="bg-ink/40 absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sand font-serif text-3xl font-light tracking-[0.04em] italic sm:text-[40px]">
          {t("home.lookbook.tagline")}
        </p>
        <h2
          id="lookbook-title"
          className="font-serif text-4xl font-light tracking-[0.02em] text-white sm:text-[62px]"
        >
          {t("home.lookbook.title")}
        </h2>
        <ButtonLink href={routes.newArrivals} variant="light">
          {t("home.lookbook.cta")}
        </ButtonLink>
      </div>
    </section>
  );
}
