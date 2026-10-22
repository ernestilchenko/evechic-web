import { StatusChip } from "@/features/admin";
import { t } from "@/lib/i18n";

import { productChip } from "../constants/products";
import type { ProductStatus, StockState } from "../types";

export function ProductStatusChip({ status, stock }: { status: ProductStatus; stock: StockState }) {
  const chip = productChip(status, stock);
  return <StatusChip tone={chip.tone}>{t(`adminProducts.chip.${chip.key}`)}</StatusChip>;
}
