import Image from "next/image";
import Link from "next/link";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { routes } from "@/data/routes";
import { getCategories } from "@/features/catalog";
import { t, tPlural } from "@/lib/i18n";

const TILES_LIMIT = 4;

export async function CategoryTiles() {
  const tree = await getCategories().catch(() => []);
  const tiles = tree
    .filter((category) => category.image && category.products_count > 0)
    .slice(0, TILES_LIMIT);

  if (tiles.length === 0) return null;

  return (
    <section
      aria-labelledby="categories-title"
      className="container-page flex flex-col gap-7 pt-16 pb-10 lg:pt-24"
    >
      <SectionHeader
        id="categories-title"
        title={t("home.categories.title")}
        action={{ href: routes.catalog, label: t("home.categories.cta") }}
      />
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((category) => (
          <li key={category.id}>
            <Link
              href={routes.category(category.slug)}
              className="group relative block aspect-[316/430] overflow-hidden"
            >
              <Image
                src={category.image!}
                alt={category.name}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <span className="bg-cream/95 absolute inset-x-0 bottom-0 flex h-[88px] flex-col justify-center gap-1.5 px-[22px]">
                <span className="text-xs font-semibold tracking-[0.16em] uppercase">{category.name}</span>
                <span className="text-muted text-[11px] font-medium tracking-[0.06em]">
                  {tPlural("common.models", category.products_count)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
