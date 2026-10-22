import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { routes } from "@/data/routes";
import type { ProductCard as ProductCardData } from "@/lib/api/types";
import { formatSizes } from "@/lib/format";
import { t } from "@/lib/i18n";

type ProductCardProps = {
  product: ProductCardData;
  priority?: boolean;
  sizes?: string;
};

export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, 50vw",
}: ProductCardProps) {
  const badge = product.is_on_sale ? (
    <Badge tone="sale">−{product.discount_percent}%</Badge>
  ) : product.is_new ? (
    <Badge>{t("product.badgeNew")}</Badge>
  ) : null;

  return (
    <article className="group flex flex-col gap-3.5">
      <Link
        href={routes.product(product.slug)}
        className="bg-sand relative block aspect-[316/430] overflow-hidden"
      >
        {product.main_image ? (
          <Image
            src={product.main_image}
            alt={product.name}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : null}
        {badge ? <span className="absolute top-3.5 left-3.5">{badge}</span> : null}
        {!product.in_stock ? (
          <span className="bg-cream/90 absolute inset-x-0 bottom-0 py-2 text-center text-[11px] tracking-[0.1em] uppercase">
            {t("product.outOfStock")}
          </span>
        ) : null}
      </Link>
      <div className="flex flex-col gap-[7px]">
        <h3 className="text-sm font-medium">
          <Link href={routes.product(product.slug)} className="hover:text-gold">
            {product.name}
          </Link>
        </h3>
        <Price price={product.price} oldPrice={product.is_on_sale ? product.old_price : null} />
        {product.sizes.length > 0 ? (
          <p className="text-muted text-[11.5px] tracking-[0.06em]">{formatSizes(product.sizes)}</p>
        ) : null}
      </div>
    </article>
  );
}
