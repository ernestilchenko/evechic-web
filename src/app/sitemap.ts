import type { MetadataRoute } from "next";

import { routes } from "@/data/routes";
import { flattenCategories, getCategories, getProducts } from "@/features/catalog";
import type { ProductCard } from "@/lib/api/types";
import { absoluteUrl } from "@/lib/seo";

const SITEMAP_PAGE_SIZE = 100;

async function getAllProducts() {
  const first = await getProducts({ page_size: SITEMAP_PAGE_SIZE, page: 1 });
  const rest = await Promise.all(
    Array.from({ length: first.pagination.total_pages - 1 }, (_, index) =>
      getProducts({ page_size: SITEMAP_PAGE_SIZE, page: index + 2 }),
    ),
  );
  return [first, ...rest].flatMap((page) => page.items as ProductCard[]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl(routes.home), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl(routes.catalog), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl(routes.newArrivals), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl(routes.sale), changeFrequency: "daily", priority: 0.8 },
    ...[routes.about, routes.delivery, routes.returns, routes.sizeGuide, routes.care, routes.faq].map(
      (path) => ({
        url: absoluteUrl(path),
        changeFrequency: "monthly" as const,
        priority: 0.4,
      }),
    ),
  ];

  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getAllProducts().catch(() => []),
  ]);

  return [
    ...staticPages,
    ...flattenCategories(categories)
      .filter((category) => category.products_count > 0)
      .map((category) => ({
        url: absoluteUrl(routes.category(category.slug)),
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
    ...products.map((product) => ({
      url: absoluteUrl(routes.product(product.slug)),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(product.main_image ? { images: [product.main_image] } : {}),
    })),
  ];
}
