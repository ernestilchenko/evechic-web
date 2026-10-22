"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBlock } from "@/features/admin";
import { isNotFound } from "@/lib/api/client";
import { t } from "@/lib/i18n";

export function ContentError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  if (isNotFound(error))
    return <EmptyState title={t("adminContent.unavailable")} text={t("adminContent.unavailableText")} />;
  return <ErrorBlock error={error} onRetry={onRetry} />;
}
