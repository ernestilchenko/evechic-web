import type { BreadcrumbList, ClothingStore, WebSite, WithContext } from "schema-dts";

import { routes } from "@/data/routes";
import { siteConfig } from "@/data/site";

import { absoluteUrl } from "./seo";

export function organizationJsonLd(): WithContext<ClothingStore> {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl("/icon"),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    sameAs: Object.values(siteConfig.socials),
    address: { "@type": "PostalAddress", addressCountry: "UA", addressLocality: "Львів" },
    currenciesAccepted: "UAH",
    paymentAccepted: "Card, Cash on delivery",
  };
}

export function websiteJsonLd(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl(routes.search)}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    } as WebSite["potentialAction"],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
