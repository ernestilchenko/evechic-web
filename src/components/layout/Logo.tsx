import Link from "next/link";

import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href={routes.home}
      aria-label={t("layout.logoHome")}
      className={cn("font-serif text-[26px] font-light tracking-[0.32em] sm:text-[30px]", className)}
    >
      EVECHIC
    </Link>
  );
}
