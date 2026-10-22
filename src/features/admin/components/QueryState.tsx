"use client";

import { t } from "@/lib/i18n";

import { getErrorMessage } from "../utils/errors";
import { AdminButton } from "./AdminButton";

export function LoadingBlock({ label }: { label?: string }) {
  return (
    <p role="status" className="text-placeholder px-6 py-14 text-center text-[12.5px]">
      {label ?? t("admin.common.loading")}
    </p>
  );
}

export function ErrorBlock({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <p className="text-[14px] font-semibold">{t("admin.common.errorTitle")}</p>
      <p className="text-muted max-w-md text-[12.5px]">
        {getErrorMessage(error, t("admin.common.errorText"))}
      </p>
      {onRetry ? (
        <AdminButton variant="outline" onClick={onRetry}>
          {t("admin.common.retry")}
        </AdminButton>
      ) : null}
    </div>
  );
}
