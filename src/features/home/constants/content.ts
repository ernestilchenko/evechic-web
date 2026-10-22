import type { MessageKey } from "@/lib/i18n";

export const featuredCategories = [
  { slug: "outerwear", image: "/images/home/category-outerwear.jpg" },
  { slug: "suits", image: "/images/home/category-suits.jpg" },
  { slug: "dresses", image: "/images/home/category-dresses.jpg" },
  { slug: "jeans", image: "/images/home/category-jeans.jpg" },
] as const;

export const benefits: { number: string; titleKey: MessageKey; textKey: MessageKey }[] = [
  { number: "01", titleKey: "home.benefits.official.title", textKey: "home.benefits.official.text" },
  { number: "02", titleKey: "home.benefits.returns.title", textKey: "home.benefits.returns.text" },
  { number: "03", titleKey: "home.benefits.cod.title", textKey: "home.benefits.cod.text" },
  { number: "04", titleKey: "home.benefits.reviews.title", textKey: "home.benefits.reviews.text" },
];

export const instagramImages = [
  "/images/home/instagram-1.jpg",
  "/images/home/instagram-2.jpg",
  "/images/home/product-bodysuit.jpg",
  "/images/home/category-jeans.jpg",
  "/images/home/category-suits.jpg",
] as const;
