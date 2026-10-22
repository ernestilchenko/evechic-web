import Link from "next/link";

import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import type { UnavailableItem } from "../types";

function describe(item: UnavailableItem) {
  if (!item.product_name) return t("checkout.unavailable.unknown");
  if (item.reason === "out_of_stock") {
    return t("checkout.unavailable.outOfStock", {
      name: item.product_name,
      color: item.color_name ?? "",
      size: item.size ?? "",
      available: item.available,
      requested: item.requested,
    });
  }
  return t("checkout.unavailable.removed", { name: item.product_name });
}

export function UnavailableItemsNotice({ items }: { items: UnavailableItem[] }) {
  return (
    <div className="border-sale/40 bg-sale/5 flex flex-col gap-3 border p-5">
      <p className="text-sale text-[13px] font-semibold">{t("checkout.unavailable.title")}</p>
      <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[12.5px]">
        {items.map((item) => (
          <li key={item.variant_id}>{describe(item)}</li>
        ))}
      </ul>
      <Link href={routes.cart} className="caps text-gold hover:text-ink self-start text-[10.5px]">
        {t("checkout.unavailable.backToCart")}
      </Link>
    </div>
  );
}
