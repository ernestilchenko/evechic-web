import { ButtonLink } from "@/components/ui/Button";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

type EmptyCartProps = {
  title?: string;
  text?: string;
  cta?: string;
};

export function EmptyCart({ title, text, cta }: EmptyCartProps) {
  return (
    <div className="border-line flex flex-col items-center gap-4 border-t px-4 py-20 text-center">
      <h2 className="font-serif text-[32px] font-light sm:text-[40px]">{title ?? t("cart.empty.title")}</h2>
      <p className="text-muted max-w-md text-[13px] leading-[1.75]">{text ?? t("cart.empty.text")}</p>
      <ButtonLink href={routes.catalog} className="mt-4">
        {cta ?? t("cart.empty.cta")}
      </ButtonLink>
    </div>
  );
}
