import Link from "next/link";
import { Suspense } from "react";
import type { FAQPage } from "schema-dts";

import { JsonLd } from "@/components/seo/JsonLd";
import { messages } from "@/data/locales/uk";
import { routes } from "@/data/routes";
import { getProducts, ProductGrid } from "@/features/catalog";
import { PageBreadcrumbs } from "@/features/content/components/PageBreadcrumbs";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

const PICKS = [
  "suknia-fresia",
  "suknia-fresia-u-kvitkovyi-prynt",
  "suknia-esti",
  "top-bolero-iconic",
  "suknia-monica",
  "spidnytsia-kendall",
  "holf-kim",
];

export const metadata = buildMetadata({
  title: t("christening.metaTitle"),
  description: t("christening.description"),
  path: routes.christeningDresses,
});

async function Picks() {
  const { items } = await getProducts({ page_size: 100 }).catch(() => ({ items: [] }));
  const products = PICKS.map((slug) => items.find((product) => product.slug === slug)).filter(
    (product) => product !== undefined,
  );
  return products.length > 0 ? <ProductGrid products={products} priorityCount={2} /> : null;
}

export default function ChristeningDressesPage() {
  const { tips, faq } = messages.christening;
  const faqJsonLd: FAQPage = {
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <article className="container-page pt-8 pb-20 sm:pb-[88px]">
      <JsonLd data={{ "@context": "https://schema.org", ...faqJsonLd }} />
      <PageBreadcrumbs title={t("christening.title")} path={routes.christeningDresses} />
      <header className="flex max-w-[820px] flex-col gap-5 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <h1 className="font-serif text-[36px] leading-[1.1] font-light sm:text-[52px]">
          {t("christening.title")}
        </h1>
        <p className="text-muted max-w-[640px] text-[15px] leading-[1.75]">{t("christening.lead")}</p>
      </header>

      <section aria-labelledby="christening-picks" className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 id="christening-picks" className="font-serif text-[28px] font-light sm:text-[34px]">
              {t("christening.productsTitle")}
            </h2>
            <p className="text-muted text-[14px]">{t("christening.productsLead")}</p>
          </div>
          <Link
            href={routes.category("dresses")}
            className="text-gold hover:text-ink text-[13px] font-semibold"
          >
            {t("christening.allDresses")}
          </Link>
        </div>
        <Suspense fallback={<div className="min-h-[420px]" />}>
          <Picks />
        </Suspense>
      </section>

      <section aria-labelledby="christening-tips" className="border-line mt-16 border-t pt-12 sm:mt-20">
        <h2 id="christening-tips" className="font-serif text-[28px] font-light sm:text-[34px]">
          {t("christening.tipsTitle")}
        </h2>
        <dl className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => (
            <div key={tip.title} className="flex flex-col gap-2">
              <dt className="text-gold text-[10.5px] font-semibold tracking-[0.2em] uppercase">
                {tip.title}
              </dt>
              <dd className="text-[14.5px] leading-[1.75]">{tip.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="christening-faq" className="border-line mt-16 max-w-[820px] border-t pt-12">
        <h2 id="christening-faq" className="font-serif text-[28px] font-light sm:text-[34px]">
          {t("christening.faqTitle")}
        </h2>
        <div className="mt-6 flex flex-col">
          {faq.map((item) => (
            <details key={item.q} className="border-line group border-b py-5">
              <summary className="cursor-pointer list-none text-[15px] font-semibold">{item.q}</summary>
              <p className="text-muted pt-3 text-[14.5px] leading-[1.75]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
