import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingBlock } from "@/features/admin";
import { CustomerDetailView } from "@/features/admin-customers";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.customer") };

async function CustomerRoute({ params }: { params: PageProps<"/admin/customers/[id]">["params"] }) {
  const { id } = await params;
  return <CustomerDetailView id={Number(id)} />;
}

export default function Page({ params }: PageProps<"/admin/customers/[id]">) {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <CustomerRoute params={params} />
    </Suspense>
  );
}
