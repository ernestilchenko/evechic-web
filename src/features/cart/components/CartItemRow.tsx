"use client";

import Image from "next/image";
import Link from "next/link";

import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { routes } from "@/data/routes";
import type { CartItem } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import { LOW_STOCK_THRESHOLD, maxQuantity } from "../utils/stock";

type CartItemRowProps = {
  item: CartItem;
  quantity: number;
  busy: boolean;
  removing: boolean;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
};

function Availability({ item, quantity }: { item: CartItem; quantity: number }) {
  if (!item.available || item.stock === 0) {
    return <p className="text-sale text-[11.5px]">{t("cart.item.unavailable")}</p>;
  }
  if (quantity > item.stock) {
    return <p className="text-sale text-[11.5px]">{t("cart.item.limitedStock", { count: item.stock })}</p>;
  }
  if (item.stock <= LOW_STOCK_THRESHOLD) {
    return <p className="text-gold text-[11.5px]">{t("cart.item.lowStock", { count: item.stock })}</p>;
  }
  return <p className="text-success text-[11.5px]">{t("cart.item.inStock")}</p>;
}

export function CartItemRow({
  item,
  quantity,
  busy,
  removing,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  const href = routes.product(item.product.slug);
  const unitTotal = Number(item.unit_price) * quantity;
  const oldTotal = item.old_price ? Number(item.old_price) * quantity : null;

  return (
    <li
      aria-busy={busy || undefined}
      className={cn(
        "border-line flex gap-4 border-t py-[26px] transition-opacity sm:items-center sm:gap-6",
        removing && "opacity-40",
      )}
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="bg-sand relative h-[115px] w-[88px] shrink-0 overflow-hidden sm:h-[146px] sm:w-[112px]"
      >
        {item.product.main_image ? (
          <Image src={item.product.main_image} alt="" fill sizes="112px" className="object-cover" />
        ) : null}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-[9px]">
          <h2 className="text-[15px] font-medium">
            <Link href={href} className="hover:text-gold">
              {item.product.name}
            </Link>
          </h2>
          <p className="text-muted text-[12.5px]">
            {t("cart.item.colorSize", { color: item.color.name, size: item.size })}
          </p>
          <Availability item={item} quantity={quantity} />
        </div>
        <div className="flex items-center justify-between gap-6">
          <QuantityStepper
            value={quantity}
            max={maxQuantity(item)}
            onChange={onQuantityChange}
            disabled={busy || !item.available}
            label={t("cart.quantity.label")}
            decreaseLabel={t("cart.quantity.decrease")}
            increaseLabel={t("cart.quantity.increase")}
          />
          <div className="flex w-[110px] flex-col items-end gap-[5px] whitespace-nowrap">
            <span className="sr-only">{t("product.price")}:</span>
            <span className="text-[15px] font-semibold">{formatPrice(unitTotal)}</span>
            {oldTotal ? (
              <>
                <span className="sr-only">{t("product.oldPrice")}:</span>
                <s className="text-placeholder text-xs">{formatPrice(oldTotal)}</s>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={busy}
        aria-label={t("cart.item.remove", { name: item.product.name })}
        className="text-placeholder hover:text-ink -m-2 self-start p-2 text-base leading-none disabled:opacity-40 sm:self-center"
      >
        ×
      </button>
    </li>
  );
}
