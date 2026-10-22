export const catalogCacheTags = {
  products: "products",
  categories: "categories",
  product: (slug: string) => `product:${slug}`,
} as const;
