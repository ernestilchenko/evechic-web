import Link from "next/link";

import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import { routes } from "@/data/routes";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import type { RecentOrder } from "../../types";
import { formatShortDate } from "../../utils/format";
import { OrderStatusChip } from "../OrderStatusChip";

export function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  return (
    <section
      aria-labelledby="recent-orders-title"
      className="border-admin-line flex min-w-0 flex-1 flex-col rounded-md border bg-white pt-6 pb-2.5"
    >
      <div className="flex items-center gap-4 px-[22px] pb-5">
        <h2 id="recent-orders-title" className="flex-1 text-[14px] font-semibold">
          {t("admin.dashboard.recentOrders")}
        </h2>
        <Link
          href={routes.admin.orders}
          className="text-gold hover:text-ink text-[10px] font-semibold tracking-[0.14em] uppercase"
        >
          {t("admin.dashboard.allOrders")} →
        </Link>
      </div>
      {orders.length === 0 ? (
        <p className="text-placeholder px-[22px] pb-4 text-[12px]">{t("admin.dashboard.noOrders")}</p>
      ) : (
        <Table className="border-admin-row border-t">
          <THead>
            <tr>
              <Th>{t("admin.dashboard.colNumber")}</Th>
              <Th>{t("admin.dashboard.colCustomer")}</Th>
              <Th>{t("admin.dashboard.colQty")}</Th>
              <Th>{t("admin.dashboard.colTotal")}</Th>
              <Th>{t("admin.dashboard.colStatus")}</Th>
              <Th>{t("admin.dashboard.colDate")}</Th>
            </tr>
          </THead>
          <TBody>
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td className="font-semibold">
                  <Link href={routes.admin.order(order.number)} className="hover:text-gold">
                    {order.number}
                  </Link>
                </Td>
                <Td>{order.customer_name}</Td>
                <Td>{order.items_count}</Td>
                <Td className="whitespace-nowrap">{formatPrice(order.total)}</Td>
                <Td>
                  <OrderStatusChip status={order.status} />
                </Td>
                <Td>{formatShortDate(order.created_at)}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      )}
    </section>
  );
}
