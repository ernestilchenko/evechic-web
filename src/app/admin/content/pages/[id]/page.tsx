import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingBlock } from "@/features/admin";
import { PageEditor } from "@/features/admin-content";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.contentPage") };

async function ContentPageRoute({ params }: { params: PageProps<"/admin/content/pages/[id]">["params"] }) {
  const { id } = await params;
  return <PageEditor id={Number(id)} />;
}

export default function Page({ params }: PageProps<"/admin/content/pages/[id]">) {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <ContentPageRoute params={params} />
    </Suspense>
  );
}
