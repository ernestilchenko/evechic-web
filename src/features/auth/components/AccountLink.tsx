"use client";

import Link from "next/link";

import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import { useSession } from "../hooks/useSession";

export function AccountLink({ className }: { className?: string }) {
  const { isAuthenticated } = useSession();

  return (
    <Link href={isAuthenticated ? routes.account : routes.login} className={className}>
      {t("layout.actions.profile")}
    </Link>
  );
}
