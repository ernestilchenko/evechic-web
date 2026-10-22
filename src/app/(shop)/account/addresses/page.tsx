import type { Metadata } from "next";

import { AddressesSection } from "@/features/account";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("account.meta.addressesTitle"),
  description: t("account.meta.addressesDescription"),
  path: routes.accountAddresses,
  noIndex: true,
});

export default function AccountAddressesPage() {
  return <AddressesSection />;
}
