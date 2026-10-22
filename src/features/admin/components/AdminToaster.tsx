"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type Toast = { id: number; tone: "success" | "error"; message: string };

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const TOAST_TIMEOUT = 4500;

export function AdminToaster({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback(
    (id: number) => setToasts((list) => list.filter((toast) => toast.id !== id)),
    [],
  );

  const push = useCallback(
    (tone: Toast["tone"], message: string) => {
      counter.current += 1;
      const id = counter.current;
      setToasts((list) => [...list.slice(-3), { id, tone, message }]);
      setTimeout(() => dismiss(id), TOAST_TIMEOUT);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({ success: (message) => push("success", message), error: (message) => push("error", message) }),
    [push],
  );

  return (
    <ToastContext value={api}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-[min(360px,calc(100%-2rem))] flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded border px-4 py-3 text-[12.5px] shadow-lg",
              toast.tone === "success"
                ? "border-admin-success-bg bg-admin-success-bg text-admin-success"
                : "border-admin-danger-bg bg-admin-danger-bg text-admin-danger",
            )}
          >
            <p className="flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label={t("admin.common.close")}
              className="-m-1 p-1 leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

export function useAdminToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useAdminToast must be used inside AdminToaster");
  return context;
}
