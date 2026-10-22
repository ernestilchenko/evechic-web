"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import type { Address, AddressInput } from "@/lib/api/types";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { accountQueryKeys } from "../constants/account";
import { useAddresses } from "../hooks/useAccountQueries";
import { createAddress, deleteAddress, makeDefaultAddress, updateAddress } from "../services/accountService";

import { AddressDialog } from "./AddressDialog";

const linkClass =
  "text-gold hover:text-ink text-[9.5px] font-semibold tracking-[0.14em] uppercase disabled:opacity-60";

function addressLines(address: Address) {
  return [
    address.delivery_method ? t(`account.delivery.methods.${address.delivery_method}`) : null,
    address.delivery_point || null,
    address.street || null,
  ].filter((line): line is string => Boolean(line));
}

export function AddressesSection() {
  const queryClient = useQueryClient();
  const query = useAddresses();
  const [dialog, setDialog] = useState<{ open: boolean; address: Address | null }>({
    open: false,
    address: null,
  });
  const [toDelete, setToDelete] = useState<Address | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: accountQueryKeys.addresses });
  const onActionError = () => setActionError(t("account.addresses.actionError"));

  const save = useMutation({
    mutationFn: (input: AddressInput) =>
      dialog.address ? updateAddress(dialog.address.id, input) : createAddress(input),
    onSuccess: async () => {
      setDialog({ open: false, address: null });
      await refresh();
    },
  });
  const makeDefault = useMutation({
    mutationFn: makeDefaultAddress,
    onSuccess: refresh,
    onError: onActionError,
  });
  const remove = useMutation({
    mutationFn: deleteAddress,
    onSuccess: async () => {
      setToDelete(null);
      await refresh();
    },
    onError: () => {
      setToDelete(null);
      onActionError();
    },
  });

  const openDialog = (address: Address | null) => {
    save.reset();
    setActionError(null);
    setDialog({ open: true, address });
  };

  const addresses = query.data ?? [];

  return (
    <section
      aria-labelledby="addresses-title"
      className="border-line flex flex-col gap-[22px] border bg-white px-5 py-6 sm:px-[30px] sm:py-7"
    >
      <div className="flex flex-wrap items-center gap-4">
        <h2 id="addresses-title" className="flex-1 text-[11px] font-semibold tracking-[0.2em] uppercase">
          {t("account.addresses.sectionTitle")}
        </h2>
        <button
          type="button"
          onClick={() => openDialog(null)}
          className="text-gold hover:text-ink text-[10.5px] font-semibold tracking-[0.16em]"
        >
          {t("account.addresses.add")}
        </button>
      </div>
      <div aria-live="polite" aria-busy={query.isLoading}>
        {query.isLoading ? (
          <div className="text-muted flex justify-center py-8">
            <Spinner label={t("common.loading")} />
          </div>
        ) : query.isError ? (
          <p role="alert" className="text-sale text-[13px]">
            {t("account.addresses.error")}
          </p>
        ) : addresses.length === 0 ? (
          <p className="text-muted text-[13px]">{t("account.addresses.empty")}</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => (
              <li
                key={address.id}
                className={cn(
                  "flex flex-col gap-2 border px-[22px] py-5",
                  address.is_default ? "bg-sand border-ink" : "border-line",
                )}
              >
                <div className="flex items-center gap-3">
                  <h3 className="flex-1 text-[13.5px] font-semibold">{address.city}</h3>
                  {address.is_default ? (
                    <span className="text-gold text-[9.5px] font-semibold tracking-[0.14em] uppercase">
                      {t("account.addresses.default")}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => makeDefault.mutate(address.id)}
                      disabled={makeDefault.isPending}
                      className={linkClass}
                    >
                      {t("account.addresses.makeDefault")}
                    </button>
                  )}
                </div>
                {addressLines(address).map((line) => (
                  <p key={line} className="text-muted text-[12.5px]">
                    {line}
                  </p>
                ))}
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => openDialog(address)}
                    className="text-ink hover:text-gold text-xs underline underline-offset-2"
                  >
                    {t("account.addresses.edit")}
                    <span className="sr-only">: {address.city}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setToDelete(address)}
                    className="text-muted hover:text-sale text-xs underline underline-offset-2"
                  >
                    {t("account.addresses.delete")}
                    <span className="sr-only">: {address.city}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {actionError ? (
          <p role="alert" className="text-sale pt-3 text-[12.5px]">
            {actionError}
          </p>
        ) : null}
      </div>
      <AddressDialog
        open={dialog.open}
        address={dialog.address}
        pending={save.isPending}
        error={save.isError ? t("account.addresses.actionError") : null}
        onClose={() => setDialog({ open: false, address: null })}
        onSubmit={(input) => save.mutate(input)}
      />
      <ConfirmDialog
        open={toDelete !== null}
        title={toDelete ? t("account.addresses.deleteConfirm", { city: toDelete.city }) : ""}
        confirmLabel={t("account.addresses.delete")}
        cancelLabel={t("account.addresses.cancel")}
        tone="danger"
        pending={remove.isPending}
        onConfirm={() => toDelete && remove.mutate(toDelete.id)}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
}
