import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { routes } from "@/data/routes";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

import { getCategories, getProduct } from "../services/catalogService";
import type { ListingSearchParams } from "../types";

import { findCategory } from "./flattenCategories";
import { canonicalPath, parseListingParams, toSearchParams } from "./listingParams";
import { productImages } from "./productText";

type ListingMetadataInput = {
  title: string;
  description: string;
  path: string;
  searchParams: Promise<ListingSearchParams>;
  noIndex?: boolean;
};

export async function buildListingMetadata({
  title,
  description,
  path,
  searchParams,
  noIndex,
}: ListingMetadataInput): Promise<Metadata> {
  const { page } = parseListingParams(toSearchParams(await searchParams));
  const pageTitle = page > 1 ? `${title} — ${t("catalog.meta.pageSuffix", { page })}` : title;
  return buildMetadata({ title: pageTitle, description, path: canonicalPath(path, page), noIndex });
}

export async function buildCategoryMetadata(
  params: Promise<{ category: string }>,
  searchParams: Promise<ListingSearchParams>,
): Promise<Metadata> {
  const { category: slug } = await params;
  const category = findCategory(await getCategories(), slug);
  if (!category) notFound();
  return buildListingMetadata({
    title: t("catalog.meta.categoryTitle", { name: category.name }),
    description: t("catalog.meta.categoryDescription", { name: category.name }),
    path: routes.category(category.slug),
    searchParams,
    noIndex: category.products_count === 0,
  });
}

export async function buildProductMetadata(params: Promise<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const images = productImages(product).slice(0, 1);
  return buildMetadata({
    title: product.name,
    description: t("productPage.meta.descriptionTemplate", {
      name: product.name,
      price: formatPrice(product.price),
    }),
    path: routes.product(product.slug),
    images: images.length ? images : undefined,
  });
}
