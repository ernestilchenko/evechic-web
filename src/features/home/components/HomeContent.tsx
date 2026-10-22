import { getHomeContent } from "@/features/content";

import { BenefitsSection } from "./BenefitsSection";
import { CategoryTiles } from "./CategoryTiles";
import { HeroSection } from "./HeroSection";
import { InstagramFeed } from "./InstagramFeed";
import { LookbookBanner } from "./LookbookBanner";
import { NewArrivals } from "./NewArrivals";

export async function HomeContent() {
  const content = await getHomeContent();

  return (
    <>
      {content.hero ? <HeroSection banner={content.hero} /> : null}
      <CategoryTiles />
      <NewArrivals />
      {content.lookbook ? <LookbookBanner banner={content.lookbook} /> : null}
      <BenefitsSection />
      {content.instagram.length > 0 ? <InstagramFeed posts={content.instagram} /> : null}
    </>
  );
}
