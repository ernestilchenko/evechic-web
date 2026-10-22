"use client";

import { useEffect, useId, useRef } from "react";

import { cn } from "@/lib/cn";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  closeLabel: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "max-w-[420px]",
  md: "max-w-[560px]",
  lg: "max-w-[760px]",
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  closeLabel,
  children,
  footer,
  size = "md",
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "text-ink backdrop:bg-ink/40 m-auto w-[calc(100%-2rem)] rounded-md bg-white p-0 shadow-xl",
        sizes[size],
        className,
      )}
    >
      {open ? (
        <div className="flex max-h-[85dvh] flex-col">
          <header className="border-line flex items-start gap-4 border-b px-6 py-5">
            <div className="flex flex-1 flex-col gap-1.5">
              <h2 id={titleId} className="text-[15px] font-semibold">
                {title}
              </h2>
              {description ? (
                <p id={descriptionId} className="text-muted text-[12.5px]">
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="text-muted hover:text-ink -m-2 p-2 text-lg leading-none"
            >
              ×
            </button>
          </header>
          {children ? <div className="overflow-y-auto px-6 py-5">{children}</div> : null}
          {footer ? (
            <footer className="border-line flex flex-wrap justify-end gap-3 border-t px-6 py-4">
              {footer}
            </footer>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
