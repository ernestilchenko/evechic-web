import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingBlock } from "@/features/admin";
import { OrderDetail } from "@/features/admin-orders";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.order") };

async function OrderRoute({ params }: { params: PageProps<"/admin/orders/[number]">["params"] }) {
  const { number } = await params;
  return <OrderDetail number={Number(number)} />;
}

export default function Page({ params }: PageProps<"/admin/orders/[number]">) {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <OrderRoute params={params} />
    </Suspense>
  );
}
