import type { Metadata } from "next";

import { PageEditor } from "@/features/admin-content";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.contentPageNew") };

export default function Page() {
  return <PageEditor id={null} />;
}
