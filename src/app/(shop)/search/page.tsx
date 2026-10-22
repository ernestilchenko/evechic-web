import { routes } from "@/data/routes";
import { CatalogListing, SearchBox } from "@/features/catalog";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: t("search.meta.title"),
  description: t("search.meta.description"),
  path: routes.search,
  noIndex: true,
});

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <CatalogListing
      title={t("search.title")}
      path={routes.search}
      breadcrumbs={[
        { label: t("catalog.breadcrumbs.home"), href: routes.home },
        { label: t("search.breadcrumb") },
      ]}
      searchParams={searchParams}
      header={<SearchBox />}
      requireQuery
      emptyPrompt={t("search.prompt")}
      structuredData={false}
    />
  );
}
