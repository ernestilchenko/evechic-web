export const reviewsCacheTags = {
  all: "reviews",
  product: (slug: string) => `reviews:${slug}`,
} as const;
