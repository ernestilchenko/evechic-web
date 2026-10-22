import type { Metadata } from "next";

import {
  BenefitsSection,
  CategoryTiles,
  HeroSection,
  InstagramFeed,
  LookbookBanner,
  NewArrivals,
} from "@/features/home";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("home.meta.title"),
  description: t("home.meta.description"),
  path: "/",
  absoluteTitle: true,
  images: [{ url: "/images/home/hero.jpg", alt: t("home.hero.imageAlt") }],
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryTiles />
      <NewArrivals />
      <LookbookBanner />
      <BenefitsSection />
      <InstagramFeed />
    </>
  );
}
