import { Suspense } from "react";

import { t } from "@/lib/i18n";

import { AccountGuard } from "./AccountGuard";
import { AccountNav } from "./AccountNav";
import { AccountTitle } from "./AccountTitle";

export function AccountShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page pb-24">
      <header className="flex flex-col gap-2.5 pt-10 pb-8 lg:pt-[50px] lg:pb-9">
        <p className="text-gold text-[10.5px] font-medium tracking-[0.22em] uppercase">
          {t("account.eyebrow")}
        </p>
        <Suspense fallback={<div className="h-12 sm:h-[58px]" />}>
          <AccountTitle />
        </Suspense>
      </header>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-11">
        <div className="lg:w-[250px] lg:shrink-0">
          <Suspense>
            <AccountNav />
          </Suspense>
        </div>
        <div className="min-w-0 flex-1">
          <Suspense>
            <AccountGuard>{children}</AccountGuard>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
