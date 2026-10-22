import type { Metadata } from "next";

import { AddressesSection, ProfileForm } from "@/features/account";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("account.meta.profileTitle"),
  description: t("account.meta.profileDescription"),
  path: routes.accountProfile,
  noIndex: true,
});

export default function AccountProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <ProfileForm />
      <AddressesSection />
    </div>
  );
}
