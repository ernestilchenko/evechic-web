import { t } from "@/lib/i18n";

import { ORDER_STATUS_TONES, type OrderStatus } from "../constants/status";
import { StatusChip } from "./StatusChip";

export function OrderStatusChip({ status }: { status: OrderStatus }) {
  return <StatusChip tone={ORDER_STATUS_TONES[status]}>{t(`admin.orderStatus.${status}`)}</StatusChip>;
}
