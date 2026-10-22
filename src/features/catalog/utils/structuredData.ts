import type { ItemList, Product, WithContext } from "schema-dts";

import { routes } from "@/data/routes";
import { siteConfig } from "@/data/site";
import type { ProductCard, ProductDetail } from "@/lib/api/types";
import { absoluteUrl } from "@/lib/seo";

export function itemListJsonLd(name: string, products: ProductCard[], offset = 0): WithContext<ItemList> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: offset + index + 1,
      url: absoluteUrl(routes.product(product.slug)),
      name: product.name,
    })),
  };
}

export function productJsonLd(product: ProductDetail, description: string): WithContext<Product> {
  const images = product.images.length
    ? product.images.map((image) => image.url)
    : product.main_image
      ? [product.main_image]
      : [];
  const ratingCount = product.rating.count;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description,
    image: images,
    category: product.category.name,
    brand: { "@type": "Brand", name: siteConfig.name },
    color: product.colors.map((color) => color.name).join(", ") || undefined,
    size: product.sizes.join(", ") || undefined,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(routes.product(product.slug)),
      price: Number(product.price).toFixed(2),
      priceCurrency: "UAH",
      availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: siteConfig.name },
    },
    ...(ratingCount > 0 && product.rating.average
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(product.rating.average),
            reviewCount: ratingCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}
