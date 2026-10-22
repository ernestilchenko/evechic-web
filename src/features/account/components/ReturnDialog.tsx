"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Textarea";
import { t } from "@/lib/i18n";

type ReturnDialogProps = {
  open: boolean;
  pending: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

export function ReturnDialog({ open, pending, error, onClose, onSubmit }: ReturnDialogProps) {
  const [reason, setReason] = useState("");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t("account.order.returnReason")}
      closeLabel={t("account.order.returnClose")}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(reason.trim());
        }}
      >
        <Textarea
          label={t("account.order.returnReasonLabel")}
          placeholder={t("account.order.returnReasonPlaceholder")}
          required
          maxLength={2000}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          error={error}
        />
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="border-line hover:border-ink border px-[22px] py-3.5 text-[10.5px] font-semibold tracking-[0.16em] uppercase"
          >
            {t("account.order.returnClose")}
          </button>
          <button
            type="submit"
            disabled={pending || !reason.trim()}
            className="bg-ink text-cream hover:bg-ink/85 px-[22px] py-3.5 text-[10.5px] font-semibold tracking-[0.16em] uppercase disabled:opacity-60"
          >
            {pending ? t("account.order.returnSubmitting") : t("account.order.returnSubmit")}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
