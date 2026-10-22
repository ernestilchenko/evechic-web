import { Suspense } from "react";

import {
  buildProductMetadata,
  getProducts,
  ProductDetails,
  ProductDetailsSkeleton,
} from "@/features/catalog";
import { STATIC_PARAMS_PLACEHOLDER } from "@/lib/staticParams";
import { FavoriteButton } from "@/features/favorites";
import { ProductReviews } from "@/features/reviews";

export async function generateStaticParams() {
  const { items } = await getProducts({ sort: "popular" }).catch(() => ({ items: [] }));
  return items.length > 0
    ? items.map((product) => ({ slug: product.slug }))
    : [{ slug: STATIC_PARAMS_PLACEHOLDER }];
}

export function generateMetadata({ params }: PageProps<"/product/[slug]">) {
  return buildProductMetadata(params);
}

export default function ProductPage({ params }: PageProps<"/product/[slug]">) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetails
        params={params}
        renderFavorite={(product) => <FavoriteButton productId={product.id} productSlug={product.slug} />}
        renderReviews={(product) => (
          <Suspense fallback={null}>
            <ProductReviews slug={product.slug} sizes={product.sizes} />
          </Suspense>
        )}
      />
    </Suspense>
  );
}
