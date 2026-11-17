import Link from "next/link";

import { routes } from "@/data/routes";
import { GiftCardVisual } from "@/features/gift-cards";
import { t } from "@/lib/i18n";

export function GiftCardBanner() {
  return (
    <section aria-labelledby="gift-card-title" className="container-page pb-16 lg:pb-[84px]">
      <div className="border-line grid items-center gap-10 border px-6 py-12 sm:px-12 lg:grid-cols-[1fr_440px] lg:gap-16 lg:px-16 lg:py-16">
        <div className="flex flex-col gap-5">
          <p className="text-gold text-[11px] font-medium tracking-[0.22em] uppercase">
            {t("home.giftCard.eyebrow")}
          </p>
          <h2
            id="gift-card-title"
            className="max-w-[540px] font-serif text-[36px] leading-[1.08] font-light sm:text-[48px]"
          >
            {t("home.giftCard.title")}
          </h2>
          <p className="text-muted max-w-[480px] text-[15px] leading-[1.7]">{t("home.giftCard.text")}</p>
          <ul className="text-muted flex flex-col gap-1.5 text-[13px]">
            <li>— {t("home.giftCard.point1")}</li>
            <li>— {t("home.giftCard.point2")}</li>
            <li>— {t("home.giftCard.point3")}</li>
          </ul>
          <Link
            href={routes.giftCards}
            className="bg-ink text-cream hover:bg-ink/85 mt-2 inline-flex w-fit items-center justify-center px-9 py-[19px] text-[11px] leading-none font-semibold tracking-[0.16em] uppercase transition-colors"
          >
            {t("home.giftCard.cta")}
          </Link>
        </div>
        <Link
          href={routes.giftCards}
          aria-hidden="true"
          tabIndex={-1}
          className="relative mx-auto block w-full max-w-[400px] pb-10"
        >
          <span className="absolute top-10 right-0 w-[78%] rotate-6 opacity-90">
            <GiftCardVisual amount={3000} />
          </span>
          <span className="relative block w-[82%]">
            <GiftCardVisual amount={2000} />
          </span>
        </Link>
      </div>
    </section>
  );
}
