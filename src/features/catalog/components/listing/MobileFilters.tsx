"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import type { ProductFilters } from "@/lib/api/types";
import { t } from "@/lib/i18n";

import { useListingParams } from "../../hooks/useListingParams";
import type { CategoryFilterMode } from "../../types";
import { countActiveFilters } from "../../utils/listingParams";

import { FiltersPanel } from "./FiltersPanel";

type MobileFiltersProps = {
  filters: ProductFilters;
  categoryMode: CategoryFilterMode;
  activeCategory?: string;
};

export function MobileFilters({ filters, categoryMode, activeCategory }: MobileFiltersProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const { state } = useListingParams();
  const active = countActiveFilters(state, categoryMode === "param");

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="border-line hover:border-ink flex h-[42px] items-center gap-2 border px-[18px] text-[10.5px] font-semibold tracking-[0.14em] uppercase"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="size-3.5">
          <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.3" fill="none" />
        </svg>
        {active > 0 ? t("catalog.filters.openWithCount", { count: active }) : t("catalog.filters.open")}
      </button>
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        className="bg-cream text-ink backdrop:bg-ink/40 m-0 h-dvh max-h-dvh w-[min(100%,380px)] max-w-none p-0"
      >
        {open ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 pt-5">
              <span id={titleId} className="sr-only">
                {t("catalog.filters.title")}
              </span>
              <span />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("catalog.filters.close")}
                className="text-muted hover:text-ink -m-2 p-2 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              <FiltersPanel filters={filters} categoryMode={categoryMode} activeCategory={activeCategory} />
            </div>
            <div className="border-line border-t p-5">
              <Button className="w-full" onClick={() => setOpen(false)}>
                {t("catalog.filters.show")}
              </Button>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
