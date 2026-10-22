import Link from "next/link";

import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import type { LowStock } from "../../types";
import { AdminButtonLink } from "../AdminButton";

export function LowStockList({ items }: { items: LowStock[] }) {
  return (
    <section
      aria-labelledby="low-stock-title"
      className="border-admin-line flex w-full flex-col gap-4 rounded-md border bg-white p-6 xl:w-[360px] xl:shrink-0"
    >
      <h2 id="low-stock-title" className="text-[14px] font-semibold">
        {t("admin.dashboard.lowStock")}
      </h2>
      {items.length === 0 ? (
        <p className="text-placeholder text-[12px]">{t("admin.dashboard.noLowStock")}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="border-admin-row flex items-center gap-3 border-t pt-3">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link
                  href={routes.admin.product(item.product_id)}
                  className="hover:text-gold text-[12px] font-medium"
                >
                  {item.product_name}
                </Link>
                <span className="text-placeholder text-[10.5px]">
                  {t("admin.dashboard.variant", { size: item.size, color: item.color })}
                </span>
              </div>
              <span className="bg-admin-danger-bg text-admin-danger rounded-full px-2.5 py-[5px] text-[10px] font-semibold whitespace-nowrap">
                {t("admin.dashboard.pieces", { count: item.stock })}
              </span>
            </li>
          ))}
        </ul>
      )}
      <AdminButtonLink
        href={`${routes.admin.products}?tab=out_of_stock`}
        variant="outline"
        className="border-ink mt-1 h-11"
      >
        {t("admin.dashboard.restock")}
      </AdminButtonLink>
    </section>
  );
}
