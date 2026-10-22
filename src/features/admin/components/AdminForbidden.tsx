import Link from "next/link";

import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import { LogoutButton } from "./LogoutButton";

export function AdminForbidden() {
  return (
    <main
      id="main"
      className="bg-admin-bg flex min-h-dvh flex-col items-center justify-center gap-5 px-4 text-center"
    >
      <p className="text-gold font-serif text-[96px] leading-none font-light">403</p>
      <h1 className="text-[20px] font-semibold">{t("admin.forbidden.title")}</h1>
      <p className="text-muted max-w-md text-[13px]">{t("admin.forbidden.text")}</p>
      <div className="flex flex-wrap items-center justify-center gap-5">
        <Link
          href={routes.home}
          className="bg-ink text-cream rounded px-[18px] py-3 text-[10px] font-semibold tracking-[0.14em] uppercase"
        >
          {t("admin.forbidden.home")}
        </Link>
        <LogoutButton className="text-ink hover:text-gold" />
      </div>
    </main>
  );
}
