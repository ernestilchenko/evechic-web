import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { CheckoutHeader } from "@/features/checkout";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <CheckoutHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
