"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";

import { ApiError } from "@/lib/api/client";
import type { OrderDetail } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { t } from "@/lib/i18n";

import { accountQueryKeys } from "../constants/account";
import { saveReturnTracking } from "../services/accountService";

export function ReturnShipment({ order }: { order: OrderDetail }) {
  const id = useId();
  const queryClient = useQueryClient();
  const [value, setValue] = useState(order.return_tracking_number);
  const save = useMutation({
    mutationFn: () => saveReturnTracking(order.number, value),
    onSuccess: (updated) => queryClient.setQueryData(accountQueryKeys.order(String(order.number)), updated),
  });
  const instructions = order.return_instructions;
  if (!instructions) return null;

  return (
    <section aria-labelledby={`${id}-title`} className="border-line flex flex-col gap-4 border bg-white p-6">
      <h2 id={`${id}-title`} className="text-[11px] font-semibold tracking-[0.18em] uppercase">
        {t("account.returnShipment.title")}
      </h2>
      <ol className="text-muted flex list-decimal flex-col gap-1.5 pl-5 text-[13px]">
        <li>{t("account.returnShipment.step1")}</li>
        <li>
          {t("account.returnShipment.step2")}
          <dl className="text-ink mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px]">
            <dt className="text-muted">{t("account.returnShipment.recipient")}</dt>
            <dd>{instructions.recipient}</dd>
            <dt className="text-muted">{t("account.returnShipment.phone")}</dt>
            <dd>
              <a href={`tel:${instructions.phone}`} className="underline underline-offset-2">
                {instructions.phone}
              </a>
            </dd>
            <dt className="text-muted">{t("account.returnShipment.address")}</dt>
            <dd>{instructions.address}</dd>
          </dl>
        </li>
        <li>{t("account.returnShipment.step3")}</li>
      </ol>
      <form
        className="flex flex-col gap-2 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          save.mutate();
        }}
      >
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor={`${id}-ttn`} className="text-muted text-[11px] tracking-[0.06em]">
            {t("account.returnShipment.ttn")}
          </label>
          <input
            id={`${id}-ttn`}
            inputMode="numeric"
            required
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="2045 0000 0000 00"
            className="border-line focus:border-ink h-11 border bg-white px-3 text-[13px] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={save.isPending}
          className="bg-ink text-cream h-11 px-5 text-[10.5px] font-semibold tracking-[0.14em] uppercase disabled:opacity-60"
        >
          {t("account.returnShipment.save")}
        </button>
      </form>
      {save.isError ? (
        <p className="text-sale text-[12px]">
          {save.error instanceof ApiError && save.error.message
            ? save.error.message
            : t("account.returnShipment.error")}
        </p>
      ) : null}
      {order.return_tracking_number ? (
        <p className="text-[13px]">
          <span className="text-muted">{t("account.returnShipment.status")}: </span>
          {order.return_tracking_status || t("account.returnShipment.waiting")}
          {order.return_tracking_updated_at ? (
            <span className="text-placeholder ml-2 text-[11px]">
              {formatDate(order.return_tracking_updated_at)}
            </span>
          ) : null}
        </p>
      ) : null}
    </section>
  );
}
