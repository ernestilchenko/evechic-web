import type { Metadata } from "next";

import { FavoritesGrid } from "@/features/favorites";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("account.meta.favoritesTitle"),
  description: t("account.meta.favoritesDescription"),
  path: routes.accountFavorites,
  noIndex: true,
});

export default function AccountFavoritesPage() {
  return <FavoritesGrid columns={3} />;
}
