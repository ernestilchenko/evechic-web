import { routes } from "@/data/routes";
import { buildListingMetadata, CatalogListing } from "@/features/catalog";
import { t } from "@/lib/i18n";

export function generateMetadata({ searchParams }: PageProps<"/new">) {
  return buildListingMetadata({
    title: t("catalog.meta.newTitle"),
    description: t("catalog.meta.newDescription"),
    path: routes.newArrivals,
    searchParams,
  });
}

export default function NewArrivalsPage({ searchParams }: PageProps<"/new">) {
  return (
    <CatalogListing
      title={t("catalog.titles.new")}
      path={routes.newArrivals}
      breadcrumbs={[
        { label: t("catalog.breadcrumbs.home"), href: routes.home },
        { label: t("catalog.titles.new") },
      ]}
      searchParams={searchParams}
      baseQuery={{ new: true }}
    />
  );
}
