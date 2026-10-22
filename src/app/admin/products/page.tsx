import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingBlock } from "@/features/admin";
import { ProductsList } from "@/features/admin-products";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.products") };

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <ProductsList />
    </Suspense>
  );
}
