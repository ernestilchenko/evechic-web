import Link from "next/link";

import { routes } from "@/data/routes";
import { formatPrice } from "@/lib/format";
import { t, tPlural } from "@/lib/i18n";

import type { TopProduct } from "../../types";
import { Thumb } from "../Thumb";

export function TopProducts({ products }: { products: TopProduct[] }) {
  return (
    <section
      aria-labelledby="top-products-title"
      className="border-admin-line flex w-full flex-col gap-[18px] rounded-md border bg-white p-6 xl:w-[360px] xl:shrink-0"
    >
      <h2 id="top-products-title" className="text-[14px] font-semibold">
        {t("admin.dashboard.topProducts")}
      </h2>
      {products.length === 0 ? (
        <p className="text-placeholder text-[12px]">{t("admin.dashboard.noSales")}</p>
      ) : (
        <ol className="flex flex-col gap-[18px]">
          {products.map((product) => (
            <li key={product.product_id} className="flex items-center gap-3.5">
              <Thumb src={product.image} alt={product.name} />
              <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
                <Link
                  href={routes.admin.product(product.product_id)}
                  className="hover:text-gold text-[12.5px] font-medium"
                >
                  {product.name}
                </Link>
                <span className="text-placeholder text-[11px]">
                  {tPlural("admin.dashboard.salesCount", product.quantity)}
                </span>
              </div>
              <span className="text-[12.5px] font-semibold whitespace-nowrap">
                {formatPrice(product.revenue)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
