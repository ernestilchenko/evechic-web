import { Suspense } from "react";
import type { ItemList } from "schema-dts";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { JsonLd } from "@/components/seo/JsonLd";
import { isNotFound } from "@/lib/api/client";
import { t, tPlural } from "@/lib/i18n";
import { breadcrumbJsonLd } from "@/lib/structuredData";

import { getProductFilters, getProducts } from "../../services/catalogService";
import type { CategoryFilterMode, ListingSearchParams, ProductListQuery } from "../../types";
import { itemListJsonLd } from "../../utils/structuredData";
import {
  buildProductQuery,
  listingHref,
  parseListingParams,
  toSearchParams,
} from "../../utils/listingParams";
import { ProductGrid } from "../ProductGrid";

import { FiltersPanel } from "./FiltersPanel";
import { MobileFilters } from "./MobileFilters";
import { SortSelect } from "./SortSelect";

type CatalogListingProps = {
  title: string;
  path: string;
  breadcrumbs: BreadcrumbItem[];
  searchParams: Promise<ListingSearchParams>;
  baseQuery?: ProductListQuery;
  categoryMode?: CategoryFilterMode;
  activeCategory?: string;
  header?: React.ReactNode;
  requireQuery?: boolean;
  emptyPrompt?: string;
  structuredData?: boolean;
};

type ResolvedListingProps = Omit<CatalogListingProps, "searchParams" | "breadcrumbs" | "header"> & {
  search: URLSearchParams;
};

async function loadListing(search: URLSearchParams, baseQuery?: ProductListQuery) {
  const state = parseListingParams(search);
  const query = buildProductQuery(state, baseQuery);
  const result = await getProducts(query).catch((error: unknown) => {
    if (isNotFound(error)) return null;
    throw error;
  });
  return {
    state,
    items: result?.items ?? [],
    pagination: result?.pagination ?? { count: 0, page: state.page, page_size: 0, total_pages: 0 },
  };
}

async function ListingMeta({
  searchParams,
  baseQuery,
  requireQuery,
}: Pick<CatalogListingProps, "searchParams" | "baseQuery" | "requireQuery">) {
  const search = toSearchParams(await searchParams);
  if (requireQuery && !search.get("q")) return null;
  const { pagination } = await loadListing(search, baseQuery);

  return (
    <>
      <p className="text-muted flex-1 text-[12.5px] tracking-[0.06em]" aria-live="polite">
        {tPlural("common.models", pagination.count)}
      </p>
      <div className="hidden lg:block">
        <SortSelect />
      </div>
    </>
  );
}

async function ListingBody({
  search,
  title,
  path,
  baseQuery,
  categoryMode = "param",
  activeCategory,
  structuredData = true,
}: ResolvedListingProps) {
  const [{ state, items, pagination }, filters] = await Promise.all([
    loadListing(search, baseQuery),
    getProductFilters(activeCategory),
  ]);
  const offset = (pagination.page - 1) * pagination.page_size;

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-11">
      <aside aria-label={t("catalog.filters.title")} className="hidden w-60 shrink-0 lg:block">
        <FiltersPanel filters={filters} categoryMode={categoryMode} activeCategory={activeCategory} />
      </aside>
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <MobileFilters filters={filters} categoryMode={categoryMode} activeCategory={activeCategory} />
        <SortSelect />
      </div>
      <section aria-label={t("catalog.results")} className="flex min-w-0 flex-1 flex-col gap-10">
        {items.length > 0 ? (
          <>
            <ProductGrid products={items} columns={3} priorityCount={3} />
            <Pagination
              page={state.page}
              totalPages={pagination.total_pages}
              hrefForPage={(page) => listingHref(path, search, page)}
              className="pt-5"
            />
            {structuredData ? (
              <JsonLd<ItemList> data={itemListJsonLd(t("catalog.listName", { title }), items, offset)} />
            ) : null}
          </>
        ) : (
          <EmptyState
            title={t("catalog.empty.title")}
            text={t("catalog.empty.text")}
            action={
              <ButtonLink href={path} variant="outline">
                {t("catalog.empty.action")}
              </ButtonLink>
            }
          />
        )}
      </section>
    </div>
  );
}

async function ListingResults(props: Omit<CatalogListingProps, "breadcrumbs" | "header">) {
  const search = toSearchParams(await props.searchParams);
  if (props.requireQuery && !search.get("q")) {
    return <p className="text-muted py-14 text-center text-[13px]">{props.emptyPrompt}</p>;
  }
  return <ListingBody {...props} search={search} />;
}

export function ListingSkeleton() {
  return (
    <div className="flex gap-11" aria-hidden>
      <div className="hidden w-60 shrink-0 flex-col gap-6 lg:flex">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="bg-sand/70 h-24 animate-pulse" />
        ))}
      </div>
      <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-5">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex flex-col gap-3.5">
            <div className="bg-sand aspect-[316/430] animate-pulse" />
            <div className="bg-sand/70 h-4 w-3/4" />
            <div className="bg-sand/70 h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CatalogListing({ breadcrumbs, header, ...props }: CatalogListingProps) {
  return (
    <div className="container-page pb-[90px]">
      <JsonLd
        data={breadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.label, path: item.href ?? props.path })),
        )}
      />
      <div className="flex flex-col gap-[18px] pt-8 pb-8 lg:pt-11 lg:pb-[34px]">
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h1 className="font-serif text-[40px] leading-tight font-light sm:text-[52px]">{props.title}</h1>
          <Suspense fallback={<span className="flex-1" />}>
            <ListingMeta
              searchParams={props.searchParams}
              baseQuery={props.baseQuery}
              requireQuery={props.requireQuery}
            />
          </Suspense>
        </div>
        {header ? <Suspense fallback={<div className="h-14" />}>{header}</Suspense> : null}
      </div>
      <Suspense fallback={<ListingSkeleton />}>
        <ListingResults {...props} />
      </Suspense>
    </div>
  );
}
