import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingBlock } from "@/features/admin";
import { ProductEditor } from "@/features/admin-products";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.product") };

async function ProductRoute({ params }: { params: PageProps<"/admin/products/[id]">["params"] }) {
  const { id } = await params;
  return <ProductEditor id={Number(id)} />;
}

export default function Page({ params }: PageProps<"/admin/products/[id]">) {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <ProductRoute params={params} />
    </Suspense>
  );
}
