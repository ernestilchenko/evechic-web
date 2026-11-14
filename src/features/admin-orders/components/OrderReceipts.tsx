import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import { formatDateTime, StatusChip, type ChipTone } from "@/features/admin";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import type { FiscalReceipt } from "../types";

const RECEIPT_TONES: Record<FiscalReceipt["status"], ChipTone> = {
  pending: "warn",
  done: "success",
  failed: "danger",
};

export function OrderReceipts({ receipts }: { receipts: FiscalReceipt[] }) {
  if (receipts.length === 0) return null;
  const hasFailed = receipts.some((receipt) => receipt.status === "failed");
  return (
    <div className="border-admin-line -mx-5 mt-5 border-t sm:-mx-6">
      <h3 className="px-5 pt-4 pb-2 text-[12.5px] font-semibold sm:px-6">
        {t("adminOrders.receipts.title")}
      </h3>
      <Table>
        <THead>
          <tr>
            <Th>{t("adminOrders.receipts.fiscalCode")}</Th>
            <Th>{t("adminOrders.receipts.amount")}</Th>
            <Th>{t("adminOrders.invoice.status")}</Th>
            <Th>{t("adminOrders.receipts.created")}</Th>
            <Th>
              <span className="sr-only">{t("adminOrders.receipts.open")}</span>
            </Th>
          </tr>
        </THead>
        <TBody>
          {receipts.map((receipt) => (
            <Tr key={receipt.id}>
              <Td>
                <span className="block text-[11px] font-semibold">
                  {t(`adminOrders.receipts.kind.${receipt.kind}`)}
                </span>
                <span className="font-mono text-[11px] break-all">{receipt.fiscal_code || "—"}</span>
              </Td>
              <Td className="whitespace-nowrap">{formatPrice(receipt.amount)}</Td>
              <Td>
                <StatusChip tone={RECEIPT_TONES[receipt.status]}>
                  {t(`adminOrders.receipts.status.${receipt.status}`)}
                </StatusChip>
                {receipt.error ? (
                  <span className="text-sale mt-1 block text-[10.5px]">{receipt.error}</span>
                ) : null}
              </Td>
              <Td className="whitespace-nowrap">{formatDateTime(receipt.created_at)}</Td>
              <Td>
                {receipt.url ? (
                  <a
                    href={receipt.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold hover:text-ink text-[11px]"
                  >
                    {t("adminOrders.receipts.open")} ↗
                  </a>
                ) : null}
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
      {hasFailed ? (
        <p className="text-muted px-5 py-3 text-[11px] sm:px-6">{t("adminOrders.receipts.retryHint")}</p>
      ) : null}
    </div>
  );
}
