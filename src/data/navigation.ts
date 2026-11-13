import type { MessageKey } from "@/lib/i18n";

import { routes } from "./routes";

export type NavItem = { href: string; labelKey: MessageKey; accent?: boolean };

export const mainNavigation: NavItem[] = [
  { href: routes.newArrivals, labelKey: "layout.nav.new" },
  { href: routes.catalog, labelKey: "layout.nav.clothing" },
  { href: routes.category("outerwear"), labelKey: "layout.nav.outerwear" },
  { href: routes.category("dresses"), labelKey: "layout.nav.dresses" },
  { href: routes.sale, labelKey: "layout.nav.sale", accent: true },
];

export const footerShopLinks: NavItem[] = [
  { href: routes.newArrivals, labelKey: "footer.links.new" },
  { href: routes.category("outerwear"), labelKey: "footer.links.outerwear" },
  { href: routes.category("suits"), labelKey: "footer.links.suits" },
  { href: routes.category("dresses"), labelKey: "footer.links.dresses" },
  { href: routes.category("jeans"), labelKey: "footer.links.jeans" },
  { href: routes.sale, labelKey: "footer.links.sale" },
];

export const footerHelpLinks: NavItem[] = [
  { href: routes.delivery, labelKey: "footer.links.delivery" },
  { href: routes.returns, labelKey: "footer.links.returns" },
  { href: routes.sizeGuide, labelKey: "footer.links.sizeGuide" },
  { href: routes.care, labelKey: "footer.links.care" },
  { href: routes.faq, labelKey: "footer.links.faq" },
];
