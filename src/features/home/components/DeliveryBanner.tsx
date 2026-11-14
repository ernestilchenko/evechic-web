import Image from "next/image";
import Link from "next/link";

import { routes } from "@/data/routes";
import type { MessageKey } from "@/lib/i18n";
import { t } from "@/lib/i18n";

const STEPS: { titleKey: MessageKey; textKey: MessageKey }[] = [
  { titleKey: "home.delivery.sameDay.title", textKey: "home.delivery.sameDay.text" },
  { titleKey: "home.delivery.fast.title", textKey: "home.delivery.fast.text" },
  { titleKey: "home.delivery.where.title", textKey: "home.delivery.where.text" },
  { titleKey: "home.delivery.free.title", textKey: "home.delivery.free.text" },
];

export function DeliveryBanner() {
  return (
    <section aria-labelledby="delivery-title" className="container-page pt-6 pb-16 lg:pb-[84px]">
      <div className="bg-sand flex flex-col gap-10 rounded-[28px] px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Image src="/brands/nova-poshta.svg" alt="" width={36} height={36} unoptimized />
              <span className="text-[13px] font-bold tracking-[0.06em] text-[#DA291C]">
                {t("home.delivery.brand")}
              </span>
            </div>
            <h2
              id="delivery-title"
              className="max-w-[560px] font-serif text-[36px] leading-[1.08] font-light sm:text-[48px]"
            >
              {t("home.delivery.title")}
            </h2>
          </div>
          <Link href={routes.delivery} className="caps text-gold hover:text-ink shrink-0">
            {t("home.delivery.cta")}
          </Link>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.titleKey} className="bg-cream flex flex-col gap-3 rounded-[20px] p-6">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#DA291C] text-[13px] font-bold text-white">
                {index + 1}
              </span>
              <h3 className="text-[16px] font-semibold">{t(step.titleKey)}</h3>
              <p className="text-muted text-[13px] leading-[1.6]">{t(step.textKey)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
