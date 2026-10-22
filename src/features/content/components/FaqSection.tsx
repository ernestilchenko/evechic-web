import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { cn } from "@/lib/cn";

import type { FaqItem } from "../types";
import { faqPageJsonLd } from "../utils/structuredData";

type FaqSectionProps = {
  items: FaqItem[];
  title?: string;
  className?: string;
};

export function FaqSection({ items, title, className }: FaqSectionProps) {
  if (!items.length) return null;
  return (
    <section
      aria-labelledby={title ? "faq-title" : undefined}
      className={cn("flex flex-col gap-7", className)}
    >
      <JsonLd data={faqPageJsonLd(items)} />
      {title ? (
        <h2 id="faq-title" className="font-serif text-[32px] leading-[1.15] font-light sm:text-[40px]">
          {title}
        </h2>
      ) : null}
      <div className="border-line border-b">
        {items.map((item, index) => (
          <Accordion key={item.question} title={item.question} variant="plain" defaultOpen={index === 0}>
            <p className="whitespace-pre-line">{item.answer}</p>
          </Accordion>
        ))}
      </div>
    </section>
  );
}
