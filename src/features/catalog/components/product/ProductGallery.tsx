"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

type GalleryImage = { url: string; alt: string };

type ProductGalleryProps = {
  images: GalleryImage[];
  badge?: React.ReactNode;
};

export function ProductGallery({ images, badge }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = images.length;
  const current = images[active];

  const select = (index: number, focus = false) => {
    const next = (index + total) % total;
    setActive(next);
    if (focus) thumbs.current[next]?.focus();
  };

  const onThumbKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: total - 1,
    };
    if (event.key in keys) {
      event.preventDefault();
      select(keys[event.key], true);
    }
  };

  return (
    <section
      aria-label={t("productPage.gallery.label")}
      aria-roledescription="carousel"
      className="flex flex-col-reverse gap-3.5 lg:flex-row"
    >
      {total > 1 ? (
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label={t("productPage.gallery.label")}
          className="flex shrink-0 gap-3 overflow-x-auto lg:w-[84px] lg:flex-col lg:overflow-visible"
        >
          {images.map((image, index) => (
            <button
              key={image.url}
              ref={(node) => {
                thumbs.current[index] = node;
              }}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-controls="product-gallery-main"
              tabIndex={index === active ? 0 : -1}
              aria-label={t("productPage.gallery.thumbnail", { index: index + 1, total })}
              onClick={() => select(index)}
              onKeyDown={(event) => onThumbKeyDown(event, index)}
              className={cn(
                "bg-sand relative aspect-[84/108] w-[72px] shrink-0 overflow-hidden transition-opacity lg:w-full",
                index === active ? "ring-ink ring-1" : "opacity-70 hover:opacity-100",
              )}
            >
              <Image src={image.url} alt="" fill sizes="84px" className="object-cover object-top" />
            </button>
          ))}
        </div>
      ) : null}
      <div
        id="product-gallery-main"
        role={total > 1 ? "tabpanel" : undefined}
        className="bg-sand relative aspect-[560/720] w-full flex-1 overflow-hidden"
      >
        {current ? (
          <Image
            key={current.url}
            src={current.url}
            alt={current.alt}
            fill
            priority={active === 0}
            sizes="(min-width: 1440px) 560px, (min-width: 1024px) 40vw, 100vw"
            className="object-cover object-top"
          />
        ) : null}
        {badge ? <span className="absolute top-3.5 left-3.5">{badge}</span> : null}
        {total > 1 ? (
          <div className="absolute inset-x-3 bottom-3 flex justify-between lg:hidden">
            <button
              type="button"
              onClick={() => select(active - 1)}
              aria-label={t("productPage.gallery.previous")}
              className="bg-cream/90 flex size-10 items-center justify-center"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => select(active + 1)}
              aria-label={t("productPage.gallery.next")}
              className="bg-cream/90 flex size-10 items-center justify-center"
            >
              →
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
