"use client";

import Link from "next/link";
import { useState } from "react";

import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import {
  AdminButton,
  AdminPageBody,
  AdminPageHeader,
  Checkbox,
  ErrorBlock,
  Field,
  formatDateTime,
  formatShortDate,
  LoadingBlock,
  OrderStatusChip,
  ORDER_STATUS_TONES,
  Panel,
  StatusChip,
  TextInput,
  useAdminUser,
  type OrderStatus,
} from "@/features/admin";
import { routes } from "@/data/routes";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import { useCustomer, useUpdateCustomer } from "../hooks/useCustomers";
import type { CustomerDetail } from "../types";

function OwnerControls({ customer }: { customer: CustomerDetail }) {
  const mutation = useUpdateCustomer(customer.profile.id);
  const [bonus, setBonus] = useState(customer.profile.bonus_balance);
  const [active, setActive] = useState(customer.profile.is_active);

  return (
    <Panel title={t("adminCustomers.detail.ownerControls")} titleId="customer-owner">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate({ bonus_balance: bonus, is_active: active });
        }}
      >
        <Field label={t("adminCustomers.detail.bonusBalance")}>
          {(props) => (
            <TextInput
              {...props}
              type="number"
              min={0}
              step="0.01"
              value={bonus}
              onChange={(event) => setBonus(event.target.value)}
            />
          )}
        </Field>
        <Checkbox
          label={t("adminCustomers.detail.isActive")}
          checked={active}
          onChange={(event) => setActive(event.target.checked)}
        />
        <AdminButton type="submit" className="self-start" disabled={mutation.isPending}>
          {mutation.isPending ? t("adminCustomers.saving") : t("adminCustomers.save")}
        </AdminButton>
      </form>
    </Panel>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-muted text-[11px]">{label}</dt>
      <dd className="text-[12.5px]">{value}</dd>
    </div>
  );
}

export function CustomerDetailView({ id }: { id: number }) {
  const { data: customer, error, isLoading, refetch } = useCustomer(id);
  const user = useAdminUser();
  const back = { href: routes.admin.customers, label: t("adminCustomers.title") };

  if (isLoading || !customer) {
    return (
      <>
        <AdminPageHeader title={t("adminCustomers.detail.title")} back={back} />
        <AdminPageBody>
          {error ? <ErrorBlock error={error} onRetry={() => refetch()} /> : <LoadingBlock />}
        </AdminPageBody>
      </>
    );
  }

  const { profile } = customer;

  return (
    <>
      <AdminPageHeader
        title={profile.full_name || profile.email}
        back={back}
        meta={
          <StatusChip tone={profile.is_active ? "success" : "danger"}>
            {profile.is_active ? t("adminCustomers.active") : t("adminCustomers.blocked")}
          </StatusChip>
        }
      />
      <AdminPageBody>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-w-0 flex-col gap-4">
            <Panel title={t("adminCustomers.detail.profile")} titleId="customer-profile">
              <dl className="grid gap-4 sm:grid-cols-3">
                <InfoRow label={t("adminCustomers.detail.email")} value={profile.email} />
                <InfoRow label={t("adminCustomers.detail.phone")} value={profile.phone || "—"} />
                <InfoRow
                  label={t("adminCustomers.detail.birthDate")}
                  value={formatShortDate(profile.birth_date)}
                />
                <InfoRow label={t("adminCustomers.detail.size")} value={profile.preferred_size || "—"} />
                <InfoRow
                  label={t("adminCustomers.detail.marketing")}
                  value={profile.marketing_consent ? t("adminCustomers.yes") : t("adminCustomers.no")}
                />
                <InfoRow
                  label={t("adminCustomers.detail.joined")}
                  value={formatShortDate(profile.date_joined)}
                />
                <InfoRow
                  label={t("adminCustomers.detail.lastLogin")}
                  value={formatDateTime(profile.last_login)}
                />
                <InfoRow label={t("adminCustomers.detail.reviews")} value={customer.reviews_count} />
              </dl>
            </Panel>
            <Panel title={t("adminCustomers.detail.orders")} titleId="customer-orders" padded={false}>
              {customer.orders.length === 0 ? (
                <p className="text-placeholder px-5 pb-5 text-[12px] sm:px-[22px]">
                  {t("adminCustomers.detail.noOrders")}
                </p>
              ) : (
                <Table>
                  <THead>
                    <tr>
                      <Th>{t("adminCustomers.detail.orderNumber")}</Th>
                      <Th>{t("adminCustomers.detail.orderDate")}</Th>
                      <Th>{t("adminCustomers.detail.orderTotal")}</Th>
                      <Th>{t("adminCustomers.detail.orderStatus")}</Th>
                    </tr>
                  </THead>
                  <TBody>
                    {customer.orders.map((order) => (
                      <Tr key={order.id}>
                        <Td className="font-semibold">
                          <Link href={routes.admin.order(order.number)} className="hover:text-gold">
                            {order.number}
                          </Link>
                        </Td>
                        <Td>{formatShortDate(order.created_at)}</Td>
                        <Td>{formatPrice(order.total)}</Td>
                        <Td>
                          {order.status in ORDER_STATUS_TONES ? (
                            <OrderStatusChip status={order.status as OrderStatus} />
                          ) : (
                            order.status
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              )}
            </Panel>
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <Panel title={t("adminCustomers.detail.stats")} titleId="customer-stats">
              <dl className="grid grid-cols-2 gap-4">
                <InfoRow label={t("adminCustomers.col.orders")} value={profile.orders_count} />
                <InfoRow label={t("adminCustomers.col.spent")} value={formatPrice(profile.total_spent)} />
                <InfoRow label={t("adminCustomers.col.bonus")} value={formatPrice(profile.bonus_balance)} />
                <InfoRow
                  label={t("adminCustomers.detail.loyalty")}
                  value={`${customer.loyalty.level} · ${Number(customer.loyalty.percent)}%`}
                />
              </dl>
            </Panel>
            <Panel title={t("adminCustomers.detail.addresses")} titleId="customer-addresses">
              {customer.addresses.length === 0 ? (
                <p className="text-placeholder text-[12px]">{t("adminCustomers.detail.noAddresses")}</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {customer.addresses.map((address) => (
                    <li
                      key={address.id}
                      className="border-admin-row border-t pt-3 text-[12.5px] first:border-t-0 first:pt-0"
                    >
                      <p className="font-medium">
                        {address.city}
                        {address.is_default ? (
                          <span className="text-gold ml-2 text-[10px] font-semibold tracking-[0.1em] uppercase">
                            {t("adminCustomers.detail.default")}
                          </span>
                        ) : null}
                      </p>
                      <p className="text-muted text-[11.5px]">
                        {[address.delivery_point, address.street].filter(Boolean).join(", ") || "—"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            {user.isOwner ? (
              <OwnerControls key={`${profile.bonus_balance}-${profile.is_active}`} customer={customer} />
            ) : (
              <p className="text-placeholder text-[11.5px]">{t("adminCustomers.detail.ownerOnly")}</p>
            )}
          </div>
        </div>
      </AdminPageBody>
    </>
  );
}
