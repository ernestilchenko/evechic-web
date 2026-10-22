import type { OrderStatus } from "@/lib/api/types";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { orderStatusTone } from "../constants/account";

export function OrderStatusChip({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex border px-3.5 py-2 text-[10px] leading-none font-semibold tracking-[0.14em] whitespace-nowrap uppercase",
        orderStatusTone[status],
        className,
      )}
    >
      {t(`account.status.${status}`)}
    </span>
  );
}
