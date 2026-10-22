import { t } from "@/lib/i18n";

import { NewsletterForm } from "./NewsletterForm";

export function NewsletterSection() {
  return (
    <section aria-labelledby="newsletter-title" className="bg-sand">
      <div className="container-page flex flex-col gap-8 py-14 lg:flex-row lg:items-center lg:gap-[60px] lg:py-16">
        <div className="flex flex-1 flex-col gap-2.5">
          <h2 id="newsletter-title" className="font-serif text-[32px] font-light sm:text-[40px]">
            {t("newsletter.title")}
          </h2>
          <p className="text-muted max-w-[480px] text-[13.5px] leading-[1.68]">
            {t("newsletter.description")}
          </p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}
