import type { Metadata } from "next";

import { routes } from "@/data/routes";
import { CartView } from "@/features/cart";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("cart.meta.title"),
  description: t("cart.meta.description"),
  path: routes.cart,
  noIndex: true,
});

export default function CartPage() {
  return <CartView />;
}
