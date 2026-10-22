import Image from "next/image";

import type { InstagramPost } from "@/features/content";
import { siteConfig } from "@/data/site";
import { t } from "@/lib/i18n";

export function InstagramFeed({ posts }: { posts: InstagramPost[] }) {
  const visible = posts.slice(0, 5);

  return (
    <section
      aria-labelledby="instagram-title"
      className="container-page flex flex-col items-center gap-[30px] pt-5 pb-24"
    >
      <div className="flex flex-col items-center gap-2.5 text-center">
        <h2
          id="instagram-title"
          className="font-serif text-[32px] font-light tracking-[0.02em] sm:text-[40px]"
        >
          {t("home.instagram.handle")}
        </h2>
        <p className="caps text-muted tracking-[0.2em]">{t("home.instagram.subtitle")}</p>
      </div>
      <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-5">
        {visible.map((post, index) => (
          <li key={post.id} className={index === 4 ? "hidden sm:block" : undefined}>
            <a
              href={post.url || siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block aspect-square overflow-hidden"
            >
              <Image
                src={post.image}
                alt={post.alt || t("home.instagram.imageAlt")}
                fill
                sizes="(min-width: 640px) 20vw, 50vw"
                className="object-cover transition-opacity hover:opacity-85"
              />
            </a>
          </li>
        ))}
      </ul>
      <a
        href={siteConfig.socials.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="border-ink hover:bg-ink hover:text-cream border px-9 py-[18px] text-[11px] leading-none font-semibold tracking-[0.16em] uppercase transition-colors"
      >
        {t("home.instagram.cta")}
      </a>
    </section>
  );
}
