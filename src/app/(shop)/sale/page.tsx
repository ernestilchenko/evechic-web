import { routes } from "@/data/routes";
import { buildListingMetadata, CatalogListing } from "@/features/catalog";
import { t } from "@/lib/i18n";

export function generateMetadata({ searchParams }: PageProps<"/sale">) {
  return buildListingMetadata({
    title: t("catalog.meta.saleTitle"),
    description: t("catalog.meta.saleDescription"),
    path: routes.sale,
    searchParams,
  });
}

export default function SalePage({ searchParams }: PageProps<"/sale">) {
  return (
    <CatalogListing
      title={t("catalog.titles.sale")}
      path={routes.sale}
      breadcrumbs={[
        { label: t("catalog.breadcrumbs.home"), href: routes.home },
        { label: t("catalog.titles.sale") },
      ]}
      searchParams={searchParams}
      baseQuery={{ sale: true }}
    />
  );
}
