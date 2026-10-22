import Image from "next/image";

import { Prose } from "@/components/ui/Prose";
import { t } from "@/lib/i18n";

import { contentPageGroups, contentPagePaths, type ContentPageSlug } from "../constants/pages";
import type { ContentPage } from "../types";

import { FaqSection } from "./FaqSection";
import { PageBreadcrumbs } from "./PageBreadcrumbs";
import { UpdatedAt } from "./UpdatedAt";

type InfoPageViewProps = {
  slug: ContentPageSlug;
  page: ContentPage;
};

export function InfoPageView({ slug, page }: InfoPageViewProps) {
  const isFaqPage = slug === "faq";
  return (
    <article className="container-page pt-8 pb-20 sm:pb-[88px]">
      <PageBreadcrumbs title={page.title} path={contentPagePaths[slug]} />
      <header className="flex max-w-[820px] flex-col gap-5 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <p className="text-gold text-[11px] font-medium tracking-[0.22em] uppercase">
          {t(`contentPages.groups.${contentPageGroups[slug]}`)}
        </p>
        <h1 className="font-serif text-[42px] leading-[1.06] font-light sm:text-[60px]">{page.title}</h1>
        {page.lead ? (
          <p className="text-muted max-w-[620px] text-[15px] leading-[1.75]">{page.lead}</p>
        ) : null}
        <UpdatedAt value={page.updated_at} />
      </header>
      {page.image ? (
        <div className="bg-sand relative mb-12 aspect-[16/9] max-w-[960px] overflow-hidden sm:aspect-[21/9]">
          <Image
            src={page.image}
            alt={page.image_alt}
            fill
            priority
            sizes="(min-width: 1024px) 960px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="border-line max-w-[720px] border-t pt-10">
        {page.body ? <Prose html={page.body} /> : null}
      </div>
      <FaqSection
        items={page.faq}
        title={isFaqPage ? undefined : t("contentPages.faqTitle")}
        className={isFaqPage ? "mt-10 max-w-[820px]" : "mt-16 max-w-[820px]"}
      />
    </article>
  );
}
