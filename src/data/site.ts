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
  freeDeliveryThreshold: 2000,
  returnDays: 14,
  installments: { enabled: false, minAmount: 1000, parts: 3 },
} as const;
