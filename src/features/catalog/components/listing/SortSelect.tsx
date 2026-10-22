"use client";

import { useId } from "react";

import { t } from "@/lib/i18n";

import { DEFAULT_SORT, LISTING_PARAMS, SORT_OPTIONS } from "../../constants/listing";
import { useListingParams } from "../../hooks/useListingParams";
import type { CatalogSort } from "../../types";

export function SortSelect() {
  const id = useId();
  const { state, update } = useListingParams();

  return (
    <div className="border-line focus-within:border-ink relative flex items-center border">
      <label htmlFor={id} className="sr-only">
        {t("catalog.sort.label")}
      </label>
      <select
        id={id}
        value={state.sort}
        onChange={(event) => {
          const sort = event.target.value as CatalogSort;
          update({ [LISTING_PARAMS.sort]: sort === DEFAULT_SORT ? null : sort });
        }}
        className="text-ink h-[42px] cursor-pointer appearance-none bg-transparent py-0 pr-10 pl-[18px] text-[10.5px] font-semibold tracking-[0.14em] uppercase focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {t(`catalog.sort.${option}`)}
          </option>
        ))}
      </select>
      <span aria-hidden className="text-muted pointer-events-none absolute right-[18px] text-[10px]">
        ▾
      </span>
    </div>
  );
}
