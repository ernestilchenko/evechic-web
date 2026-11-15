import Image from "next/image";

import { Prose } from "@/components/ui/Prose";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

import { contentPagePaths } from "../constants/pages";
import type { ContentPage } from "../types";
import { extractStats, splitByHeading, type HtmlSection, type HtmlStat } from "../utils/html";

import { FaqSection } from "./FaqSection";
import { PageBreadcrumbs } from "./PageBreadcrumbs";
import { UpdatedAt } from "./UpdatedAt";

function AboutStats({ stats }: { stats: HtmlStat[] }) {
  return (
    <section aria-label={t("contentPages.statsTitle")} className="bg-sand">
      <dl className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-4 lg:py-[76px]">
        {stats.map((stat) => (
          <div key={stat.value} className="flex flex-col-reverse gap-2">
            <dt className="text-muted text-[12.5px]">{stat.label}</dt>
            <dd className="font-serif text-[38px] leading-none font-light sm:text-[46px]">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function AboutColumns({ section, index }: { section: HtmlSection; index: number }) {
  const { intro, sections: items } = splitByHeading(section.html, "h3");
  const headingId = `about-section-${index}`;
  return (
    <section
      aria-labelledby={headingId}
      className="container-page flex flex-col gap-[34px] py-16 lg:py-[88px]"
    >
      <h2 id={headingId} className="font-serif text-[32px] leading-[1.15] font-light sm:text-[40px]">
        {section.title}
      </h2>
      {intro ? <Prose html={intro} className="max-w-[720px]" /> : null}
      <ol className="grid gap-x-6 gap-y-10 md:grid-cols-3">
        {items.map((item, itemIndex) => (
          <li key={item.title} className="border-line flex flex-col gap-3 border-t pt-6">
            <span aria-hidden className="text-gold text-[11px] font-semibold tracking-[0.16em]">
              {String(itemIndex + 1).padStart(2, "0")}
            </span>
            <h3 className="font-serif text-[26px] leading-[1.2] font-light sm:text-[28px]">{item.title}</h3>
            <Prose html={item.html} className="text-[13px] leading-[1.72]" />
          </li>
        ))}
      </ol>
    </section>
  );
}

function AboutHighlight({ section, index }: { section: HtmlSection; index: number }) {
  const headingId = `about-section-${index}`;
  return (
    <section aria-labelledby={headingId} className="bg-ink">
      <div className="container-page flex flex-col gap-[30px] py-16 lg:py-[88px]">
        <h2
          id={headingId}
          className="text-cream font-serif text-[32px] leading-[1.15] font-light sm:text-[40px]"
        >
          {section.title}
        </h2>
        <Prose
          html={section.html}
          tone="dark"
          className={cn(
            "text-[13.5px] [&_ul]:grid [&_ul]:list-none [&_ul]:gap-x-10 [&_ul]:gap-y-3 [&_ul]:pl-0 sm:[&_ul]:grid-cols-2 lg:[&_ul]:grid-cols-3",
            "[&_li]:my-0 [&_li]:pl-0",
            "[&_ul+p]:border-footer-line [&_ul+p]:mt-8 [&_ul+p]:border-t [&_ul+p]:pt-[26px]",
            "[&_p]:text-footer-dim [&_p]:my-2.5 [&_p]:text-[12px]",
          )}
        />
      </div>
    </section>
  );
}

export function AboutView({ page }: { page: ContentPage }) {
  const { intro, sections } = splitByHeading(page.body, "h2");
  const { html: introHtml, stats } = extractStats(intro);
  return (
    <article>
      <section
        aria-labelledby="about-title"
        className={cn("grid", page.image && "lg:min-h-[620px] lg:grid-cols-[1fr_minmax(0,620px)]")}
      >
        <div className="flex flex-col justify-center gap-5 px-4 pt-8 pb-14 sm:px-8 lg:pr-[72px] lg:pb-20 lg:pl-16">
          <PageBreadcrumbs title={page.title} path={contentPagePaths.about} className="mb-6 lg:mb-10" />
          <p className="text-gold text-[11px] font-medium tracking-[0.22em] uppercase">{page.title}</p>
          <h1
            id="about-title"
            className="max-w-[560px] font-serif text-[44px] leading-[1.06] font-light text-balance sm:text-[60px]"
          >
            {page.lead || page.title}
          </h1>
          {introHtml ? (
            <Prose
              html={introHtml}
              className="[&_p:has(>em:only-child)]:text-gold max-w-[460px] text-[14px] [&_p]:my-5 [&_p>em:only-child]:font-serif [&_p>em:only-child]:text-[24px] [&_p>em:only-child]:font-light [&_p>em:only-child]:tracking-[0.04em]"
            />
          ) : null}
        </div>
        {page.image ? (
          <div className="bg-sand relative aspect-[4/5] lg:aspect-auto">
            <Image
              src={page.image}
              alt={page.image_alt}
              fill
              priority
              sizes="(min-width: 1024px) 620px, 100vw"
              className="object-cover object-top"
            />
          </div>
        ) : null}
      </section>
      {stats.length ? <AboutStats stats={stats} /> : null}
      {sections.map((section, index) =>
        section.html.match(/<h3[\s>]/i) ? (
          <AboutColumns key={section.title} section={section} index={index} />
        ) : (
          <AboutHighlight key={section.title} section={section} index={index} />
        ),
      )}
      <div className="container-page flex flex-col gap-10 py-16 lg:py-[88px]">
        <FaqSection items={page.faq} title={t("contentPages.faqTitle")} />
        <UpdatedAt value={page.updated_at} />
      </div>
    </article>
  );
}
