"use client";

import { cn } from "@/lib/cn";

import { Dialog } from "./Dialog";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel: string;
  tone?: "default" | "danger";
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const buttonBase =
  "inline-flex items-center justify-center rounded px-[18px] py-3 text-[10px] leading-none font-semibold tracking-[0.14em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = "default",
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      description={message}
      closeLabel={cancelLabel}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className={cn(buttonBase, "border-line hover:bg-cream border")}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={cn(
              buttonBase,
              tone === "danger" ? "bg-sale text-cream hover:bg-sale/85" : "bg-ink text-cream hover:bg-ink/85",
            )}
          >
            {confirmLabel}
          </button>
        </>
      }
    />
  );
}
