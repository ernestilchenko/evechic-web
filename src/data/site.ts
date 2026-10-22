import { env } from "@/lib/env";

export const siteConfig = {
  name: "EVECHIC",
  legalName: "ФОП EVECHIC",
  url: env.siteUrl,
  locale: "uk_UA",
  language: "uk",
  phone: "+380730000000",
  phoneDisplay: "+380 (73) 000-00-00",
  email: "hello@evechic.info",
  instagramHandle: "@evechic_store",
  socials: {
    instagram: "https://www.instagram.com/evechic_store/",
    telegram: "https://t.me/evechic_store",
    tiktok: "https://www.tiktok.com/@evechic_store",
  },
  freeDeliveryThreshold: 2000,
  returnDays: 14,
} as const;
