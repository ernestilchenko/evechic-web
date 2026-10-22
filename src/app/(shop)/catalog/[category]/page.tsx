import { Suspense } from "react";

import {
  buildCategoryMetadata,
  CategoryCatalog,
  flattenCategories,
  getCategories,
  ListingSkeleton,
} from "@/features/catalog";
import { STATIC_PARAMS_PLACEHOLDER } from "@/lib/staticParams";

export async function generateStaticParams() {
  const categories = flattenCategories(await getCategories().catch(() => []));
  return categories.length > 0
    ? categories.map((category) => ({ category: category.slug }))
    : [{ category: STATIC_PARAMS_PLACEHOLDER }];
}

export function generateMetadata({ params, searchParams }: PageProps<"/catalog/[category]">) {
  return buildCategoryMetadata(params, searchParams);
}

export default function CategoryPage({ params, searchParams }: PageProps<"/catalog/[category]">) {
  return (
    <Suspense
      fallback={
        <div className="container-page pt-[140px] pb-[90px]">
          <ListingSkeleton />
        </div>
      }
    >
      <CategoryCatalog params={params} searchParams={searchParams} />
    </Suspense>
  );
}
