import type { Metadata } from "next";

import { routes } from "@/data/routes";
import { TrackOnMount } from "@/features/analytics";
import { CheckoutView } from "@/features/checkout";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: t("checkout.meta.title"),
    description: t("checkout.meta.description"),
    path: routes.checkout,
  }),
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <TrackOnMount kind="checkout_start" />
      <CheckoutView />
    </>
  );
}
