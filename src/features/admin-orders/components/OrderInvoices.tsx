import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import { formatDateTime, StatusChip, type ChipTone } from "@/features/admin";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import type { InvoiceStatus, MonobankInvoice } from "../types";

const INVOICE_TONES: Record<InvoiceStatus, ChipTone> = {
  created: "info",
  processing: "warn",
  hold: "warn",
  success: "success",
  failure: "danger",
  reversed: "violet",
  expired: "neutral",
};

export function OrderInvoices({ invoices }: { invoices: MonobankInvoice[] }) {
  if (invoices.length === 0) return null;
  return (
    <div className="border-admin-line -mx-5 mt-5 border-t sm:-mx-6">
      <h3 className="px-5 pt-4 pb-2 text-[12.5px] font-semibold sm:px-6">
        {t("adminOrders.detail.invoices")}
      </h3>
      <Table>
        <THead>
          <tr>
            <Th>{t("adminOrders.invoice.id")}</Th>
            <Th>{t("adminOrders.invoice.amount")}</Th>
            <Th>{t("adminOrders.invoice.status")}</Th>
            <Th>{t("adminOrders.invoice.created")}</Th>
            <Th>
              <span className="sr-only">{t("adminOrders.invoice.link")}</span>
            </Th>
          </tr>
        </THead>
        <TBody>
          {invoices.map((invoice) => (
            <Tr key={invoice.id}>
              <Td className="font-mono text-[11px] break-all">{invoice.invoice_id}</Td>
              <Td className="whitespace-nowrap">{formatPrice(invoice.amount / 100)}</Td>
              <Td>
                <StatusChip tone={INVOICE_TONES[invoice.status]}>
                  {t(`adminOrders.invoiceStatus.${invoice.status}`)}
                </StatusChip>
                {invoice.failure_reason ? (
                  <span className="text-sale mt-1 block text-[10.5px]">{invoice.failure_reason}</span>
                ) : null}
              </Td>
              <Td className="whitespace-nowrap">{formatDateTime(invoice.created_at)}</Td>
              <Td>
                <a
                  href={invoice.page_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold hover:text-ink text-[11px]"
                >
                  {t("adminOrders.invoice.link")}
                </a>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
