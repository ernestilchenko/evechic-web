import { Fragment } from "react";

import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

const STEPS = ["cart", "checkout", "done"] as const;

export function CheckoutSteps({ current }: { current: 2 | 3 }) {
  return (
    <nav aria-label={t("checkout.steps.label")}>
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-3 sm:gap-x-3.5">
        {STEPS.map((step, index) => {
          const number = index + 1;
          const isCurrent = number === current;
          const isDone = number < current;
          return (
            <Fragment key={step}>
              {index > 0 ? <li aria-hidden="true" className="bg-field h-px w-6 sm:w-10" /> : null}
              <li className="flex items-center gap-2.5" aria-current={isCurrent ? "step" : undefined}>
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-[26px] items-center justify-center rounded-full text-[11px] font-semibold",
                    isDone && "bg-gold text-cream",
                    isCurrent && "bg-ink text-cream",
                    !isDone && !isCurrent && "border-placeholder text-placeholder border",
                  )}
                >
                  {number}
                </span>
                <span
                  className={cn(
                    "text-xs tracking-[0.06em]",
                    !isCurrent && "sr-only sm:not-sr-only",
                    isCurrent && "font-semibold",
                    !isDone && !isCurrent && "text-placeholder",
                  )}
                >
                  {t(`checkout.steps.${step}`)}
                  {isDone ? <span className="sr-only"> — {t("checkout.steps.completed")}</span> : null}
                  {isCurrent ? <span className="sr-only"> — {t("checkout.steps.current")}</span> : null}
                </span>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
