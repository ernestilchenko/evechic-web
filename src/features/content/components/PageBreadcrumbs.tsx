import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { breadcrumbJsonLd } from "@/lib/structuredData";

type PageBreadcrumbsProps = {
  title: string;
  path: string;
  className?: string;
};

export function PageBreadcrumbs({ title, path, className }: PageBreadcrumbsProps) {
  const home = t("contentPages.home");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: home, path: routes.home },
          { name: title, path },
        ])}
      />
      <Breadcrumbs items={[{ label: home, href: routes.home }, { label: title }]} className={className} />
    </>
  );
}
