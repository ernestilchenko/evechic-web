"use client";

import Link from "next/link";

import { t } from "@/lib/i18n";

import { useOpenAdminMenu } from "./AdminMenuContext";

type AdminPageHeaderProps = {
  title: string;
  back?: { href: string; label: string };
  meta?: React.ReactNode;
  children?: React.ReactNode;
};

export function AdminPageHeader({ title, back, meta, children }: AdminPageHeaderProps) {
  const openMenu = useOpenAdminMenu();

  return (
    <header className="border-admin-line flex min-h-[78px] flex-wrap items-center gap-x-4 gap-y-3 border-b bg-white px-4 py-4 sm:px-[34px]">
      <button
        type="button"
        onClick={openMenu}
        aria-label={t("admin.nav.open")}
        className="border-admin-line -ml-1 flex size-10 items-center justify-center rounded border lg:hidden"
      >
        <span aria-hidden className="flex w-4 flex-col gap-[4px]">
          <span className="bg-ink h-px w-full" />
          <span className="bg-ink h-px w-full" />
          <span className="bg-ink h-px w-full" />
        </span>
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {back ? (
          <Link href={back.href} className="text-placeholder hover:text-ink text-[11px]">
            ← {back.label}
          </Link>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[17px] font-semibold">{title}</h1>
          {meta}
        </div>
      </div>
      {children ? (
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:gap-4">{children}</div>
      ) : null}
    </header>
  );
}

export function AdminPageBody({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 px-4 pt-[26px] pb-[34px] sm:px-[34px]">{children}</div>;
}
