import { routes } from "@/data/routes";
import { buildListingMetadata, CatalogListing } from "@/features/catalog";
import { t } from "@/lib/i18n";

export function generateMetadata({ searchParams }: PageProps<"/catalog">) {
  return buildListingMetadata({
    title: t("catalog.meta.title"),
    description: t("catalog.meta.description"),
    path: routes.catalog,
    searchParams,
  });
}

export default function CatalogPage({ searchParams }: PageProps<"/catalog">) {
  return (
    <CatalogListing
      title={t("catalog.titles.all")}
      path={routes.catalog}
      breadcrumbs={[
        { label: t("catalog.breadcrumbs.home"), href: routes.home },
        { label: t("catalog.breadcrumbs.catalog") },
      ]}
      searchParams={searchParams}
    />
  );
}
