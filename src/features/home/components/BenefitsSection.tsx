import { t } from "@/lib/i18n";

import { benefits } from "../constants/content";

export function BenefitsSection() {
  return (
    <section aria-labelledby="benefits-title" className="container-page py-16 lg:py-[84px]">
      <h2 id="benefits-title" className="sr-only">
        {t("home.benefits.title")}
      </h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <li key={benefit.number} className="border-line flex flex-col gap-2.5 border-t pt-[22px]">
            <span className="caps text-gold">{benefit.number}</span>
            <h3 className="font-serif text-[26px] font-light">{t(benefit.titleKey)}</h3>
            <p className="text-muted text-[13px] leading-[1.65]">{t(benefit.textKey)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
