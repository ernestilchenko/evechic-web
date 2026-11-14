import Image from "next/image";
import Link from "next/link";

import { PaymentLogos } from "@/components/ui/BrandLogos";
import { routes } from "@/data/routes";
import { t, tPlural } from "@/lib/i18n";

const PARTS_COUNTS = [3, 4, 6];

export function PaymentBanner() {
  return (
    <section aria-labelledby="payment-title" className="container-page pb-6">
      <div className="grid items-center gap-10 overflow-hidden rounded-[28px] bg-black px-6 py-12 text-white sm:px-12 lg:grid-cols-[1fr_420px] lg:gap-16 lg:px-16 lg:py-16">
        <div className="flex flex-col gap-5">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase">
            {t("home.payment.eyebrow")}
          </p>
          <h2 id="payment-title" className="max-w-[520px] text-[32px] leading-[1.1] font-bold sm:text-[44px]">
            {t("home.payment.title")}
          </h2>
          <p className="max-w-[460px] text-[15px] leading-[1.65] text-white/70">{t("home.payment.text")}</p>
          <ul className="flex flex-wrap gap-2 pt-1">
            {PARTS_COUNTS.map((count) => (
              <li
                key={count}
                className="rounded-full bg-white/10 px-4 py-2 text-[13px] font-semibold text-white"
              >
                {tPlural("home.payment.count", count)}
              </li>
            ))}
            <li className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black">
              {t("home.payment.noFee")}
            </li>
          </ul>
          <div className="flex flex-col gap-4 pt-4">
            <p className="text-[13px] text-white/60">{t("home.payment.cards")}</p>
            <PaymentLogos tone="dark" />
          </div>
          <Link
            href={routes.installments}
            className="w-fit text-[13px] font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
          >
            {t("home.payment.terms")}
          </Link>
        </div>
        <div className="relative mx-auto aspect-[1.586] w-full max-w-[420px]" aria-hidden="true">
          <div className="absolute inset-0 translate-x-5 translate-y-5 rotate-6 rounded-[22px] bg-gradient-to-br from-zinc-700 to-zinc-900" />
          <div className="absolute inset-0 flex flex-col justify-between rounded-[22px] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-6 shadow-2xl ring-1 ring-white/10">
            <div className="flex items-start justify-between">
              <Image src="/brands/plata-dark.svg" alt="" width={97} height={20} unoptimized />
              <span className="text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">
                {t("home.payment.cardLabel")}
              </span>
            </div>
            <div className="h-9 w-12 rounded-md bg-gradient-to-br from-amber-200 to-amber-500/80" />
            <div className="flex items-end justify-between">
              <span className="font-mono text-[15px] tracking-[0.2em] text-white/80">•••• 2026</span>
              <span className="text-[13px] font-bold tracking-[0.12em]">EVECHIC</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
