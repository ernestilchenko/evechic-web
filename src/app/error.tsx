"use client";

import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-serif text-4xl font-light">{t("errors.generic.title")}</h1>
      <p className="text-muted max-w-md">{t("errors.generic.text")}</p>
      <Button onClick={reset}>{t("errors.generic.retry")}</Button>
    </main>
  );
}
