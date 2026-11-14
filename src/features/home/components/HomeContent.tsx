import { getHomeContent } from "@/features/content";

import { BenefitsSection } from "./BenefitsSection";
import { DeliveryBanner } from "./DeliveryBanner";
import { HeroSection } from "./HeroSection";
import { InstagramFeed } from "./InstagramFeed";
import { NewArrivals } from "./NewArrivals";
import { PaymentBanner } from "./PaymentBanner";

export async function HomeContent() {
  const content = await getHomeContent();

  return (
    <>
      {content.hero ? <HeroSection banner={content.hero} /> : null}
      <NewArrivals />
      <PaymentBanner />
      <DeliveryBanner />
      <BenefitsSection />
      {content.instagram.length > 0 ? <InstagramFeed posts={content.instagram} /> : null}
    </>
  );
}
