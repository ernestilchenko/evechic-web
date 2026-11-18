import { env } from "@/lib/env";

export const siteConfig = {
  name: "EVECHIC",
  legalName: "ФОП Ільченко Єва Вячеславівна",
  taxId: "3954103928",
  city: "Харків",
  url: env.siteUrl,
  locale: "uk_UA",
  language: "uk",
  phone: "+380682774401",
  phoneDisplay: "+380 (68) 277-44-01",
  email: "hello@evechic.info",
  instagramHandle: "@evechic_store",
  socials: {
    instagram: "https://www.instagram.com/evechic_store/",
    telegram: "https://t.me/evechic_store",
    tiktok: "https://www.tiktok.com/@evechic_store",
  },
  googleClientId: "589403387980-8f8c6thnghlr33d260putgjhsmqsa3ua.apps.googleusercontent.com",
  googleAds: { tagId: "AW-18575251017", purchaseLabel: "AW-18575251017/OhtHCLes87gdEMmsr5lF" },
  freeDeliveryMinItems: 5,
  returnDays: 14,
} as const;
