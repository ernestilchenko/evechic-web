import type { Metadata } from "next";

import { ProductEditor } from "@/features/admin-products";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.productNew") };

export default function Page() {
  return <ProductEditor id={null} />;
}
