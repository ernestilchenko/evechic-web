"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { Checkbox } from "@/components/ui/Checkbox";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import { SizeChip } from "@/components/ui/SizeChip";
import { routes } from "@/data/routes";
import type { ProductFilters } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import { LISTING_PARAMS } from "../../constants/listing";
import { useListingParams } from "../../hooks/useListingParams";
import type { CategoryFilterMode, ListingState } from "../../types";
import { countActiveFilters } from "../../utils/listingParams";

type FiltersPanelProps = {
  filters: ProductFilters;
  categoryMode: CategoryFilterMode;
  activeCategory?: string;
  className?: string;
};

function toggle<T>(list: readonly T[], value: T) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-3.5">
      <legend className="text-muted mb-3.5 text-[10.5px] font-semibold tracking-[0.22em] uppercase">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function PriceFilter({
  state,
  bounds,
  onApply,
}: {
  state: ListingState;
  bounds: ProductFilters["price"];
  onApply: (min: number | null, max: number | null) => void;
}) {
  const id = useId();
  const [min, setMin] = useState(state.priceMin?.toString() ?? "");
  const [max, setMax] = useState(state.priceMax?.toString() ?? "");
  const minBound = bounds.min ? Math.floor(Number(bounds.min)) : 0;
  const maxBound = bounds.max ? Math.ceil(Number(bounds.max)) : undefined;

  const apply = () => {
    const parse = (value: string) => (value.trim() === "" ? null : Math.max(0, Math.round(Number(value))));
    const nextMin = parse(min);
    const nextMax = parse(max);
    if (nextMin === state.priceMin && nextMax === state.priceMax) return;
    onApply(nextMin, nextMax);
  };

  const inputClass =
    "border-line focus:border-ink placeholder:text-placeholder h-10 w-full min-w-0 border bg-transparent px-3 text-xs focus:outline-none";

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        apply();
      }}
    >
      <div className="flex items-center gap-2">
        <label htmlFor={`${id}-min`} className="sr-only">
          {t("catalog.filters.priceFrom")}
        </label>
        <input
          id={`${id}-min`}
          type="number"
          inputMode="numeric"
          min={0}
          value={min}
          placeholder={String(minBound)}
          onChange={(event) => setMin(event.target.value)}
          onBlur={apply}
          className={inputClass}
        />
        <span aria-hidden className="text-line-strong">
          —
        </span>
        <label htmlFor={`${id}-max`} className="sr-only">
          {t("catalog.filters.priceTo")}
        </label>
        <input
          id={`${id}-max`}
          type="number"
          inputMode="numeric"
          min={0}
          value={max}
          placeholder={maxBound !== undefined ? String(maxBound) : ""}
          onChange={(event) => setMax(event.target.value)}
          onBlur={apply}
          className={inputClass}
        />
      </div>
      {bounds.min && bounds.max ? (
        <p className="text-muted flex justify-between text-xs">
          <span>{formatPrice(bounds.min)}</span>
          <span>{formatPrice(bounds.max)}</span>
        </p>
      ) : null}
      <button type="submit" className="sr-only focus:not-sr-only focus:text-xs">
        {t("catalog.filters.priceApply")}
      </button>
    </form>
  );
}

export function FiltersPanel({ filters, categoryMode, activeCategory, className }: FiltersPanelProps) {
  const { state, update, reset, isPending } = useListingParams();
  const hasActive = countActiveFilters(state, categoryMode === "param") > 0;
  const categories = filters.categories.filter(
    (category) => category.products_count > 0 || category.slug === activeCategory,
  );

  return (
    <div className={cn("flex flex-col gap-8", className)} aria-busy={isPending}>
      <div className="border-line flex items-center border-b pb-4">
        <h2 className="flex-1 text-[11px] font-semibold tracking-[0.2em] uppercase">
          {t("catalog.filters.title")}
        </h2>
        {hasActive ? (
          <button type="button" onClick={reset} className="text-gold hover:text-ink text-[11.5px]">
            {t("catalog.filters.reset")}
          </button>
        ) : null}
      </div>
      <p aria-live="polite" className="sr-only">
        {isPending ? t("catalog.filters.updating") : ""}
      </p>

      {categories.length > 0 ? (
        <FilterGroup title={t("catalog.filters.category")}>
          {categoryMode === "link" ? (
            <ul className="flex flex-col gap-3.5">
              {categories.map((category) => {
                const active = category.slug === activeCategory;
                return (
                  <li key={category.id}>
                    <Link
                      href={active ? routes.catalog : routes.category(category.slug)}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-center gap-3 text-[13px]"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "size-3.5 shrink-0 border",
                          active ? "bg-ink border-ink" : "border-line-strong group-hover:border-ink",
                        )}
                      />
                      <span className="flex-1 group-hover:underline">{category.name}</span>
                      <span className="text-placeholder text-xs">{category.products_count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            categories.map((category) => (
              <Checkbox
                key={category.id}
                label={category.name}
                trailing={category.products_count}
                checked={state.categories.includes(category.slug)}
                onChange={() =>
                  update({ [LISTING_PARAMS.category]: toggle(state.categories, category.slug) })
                }
              />
            ))
          )}
        </FilterGroup>
      ) : null}

      {filters.sizes.length > 0 ? (
        <FilterGroup title={t("catalog.filters.size")}>
          <div className="flex flex-wrap gap-2">
            {filters.sizes.map((size) => (
              <SizeChip
                key={size}
                selected={state.sizes.includes(size)}
                onClick={() => update({ [LISTING_PARAMS.size]: toggle(state.sizes, size) })}
              >
                {size}
              </SizeChip>
            ))}
          </div>
        </FilterGroup>
      ) : null}

      <FilterGroup title={t("catalog.filters.price")}>
        <PriceFilter
          key={`${state.priceMin}-${state.priceMax}`}
          state={state}
          bounds={filters.price}
          onApply={(min, max) => update({ [LISTING_PARAMS.priceMin]: min, [LISTING_PARAMS.priceMax]: max })}
        />
      </FilterGroup>

      {filters.colors.length > 0 ? (
        <FilterGroup title={t("catalog.filters.color")}>
          <div className="flex flex-wrap gap-2.5">
            {filters.colors.map((color) => (
              <ColorSwatch
                key={color.id}
                hex={color.hex}
                label={color.name}
                selected={state.colors.includes(color.id)}
                onClick={() => update({ [LISTING_PARAMS.color]: toggle(state.colors, color.id) })}
              />
            ))}
          </div>
        </FilterGroup>
      ) : null}

      <FilterGroup title={t("catalog.filters.availability")}>
        <Checkbox
          label={t("catalog.filters.inStock")}
          checked={state.inStock}
          onChange={(event) => update({ [LISTING_PARAMS.inStock]: event.target.checked })}
        />
      </FilterGroup>
    </div>
  );
}
