import { notFound } from "next/navigation";

import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import { getCategories } from "../../services/catalogService";
import type { ListingSearchParams } from "../../types";
import { findCategory } from "../../utils/flattenCategories";

import { CatalogListing } from "./CatalogListing";

type CategoryCatalogProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<ListingSearchParams>;
};

export async function CategoryCatalog({ params, searchParams }: CategoryCatalogProps) {
  const { category: slug } = await params;
  const category = findCategory(await getCategories(), slug);
  if (!category) notFound();

  return (
    <CatalogListing
      title={category.name}
      path={routes.category(category.slug)}
      breadcrumbs={[
        { label: t("catalog.breadcrumbs.home"), href: routes.home },
        { label: t("catalog.breadcrumbs.catalog"), href: routes.catalog },
        { label: category.name },
      ]}
      searchParams={searchParams}
      baseQuery={{ category: category.slug }}
      categoryMode="link"
      activeCategory={category.slug}
    />
  );
}
