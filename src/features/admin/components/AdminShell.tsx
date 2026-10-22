"use client";

import { useEffect, useState } from "react";

import { t } from "@/lib/i18n";

import type { AdminUser } from "../types";
import { AdminMenuContext } from "./AdminMenuContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminToaster } from "./AdminToaster";
import { AdminUserProvider } from "./AdminUserContext";

type AdminShellProps = {
  user: AdminUser;
  children: React.ReactNode;
};

export function AdminShell({ user, children }: AdminShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <AdminUserProvider user={user}>
      <AdminToaster>
        <AdminMenuContext value={() => setMenuOpen(true)}>
          <div className="bg-admin-bg text-ink min-h-dvh font-sans lg:flex">
            <AdminSidebar user={user} className="sticky top-0 hidden h-dvh w-[248px] shrink-0 lg:flex" />
            {menuOpen ? (
              <div
                className="fixed inset-0 z-50 lg:hidden"
                role="dialog"
                aria-modal="true"
                aria-label={t("admin.nav.label")}
              >
                <button
                  type="button"
                  aria-label={t("admin.common.close")}
                  className="bg-ink/50 absolute inset-0"
                  onClick={() => setMenuOpen(false)}
                />
                <AdminSidebar
                  user={user}
                  onNavigate={() => setMenuOpen(false)}
                  className="relative h-full w-[min(280px,85vw)]"
                />
              </div>
            ) : null}
            <main id="main" className="min-w-0 flex-1">
              {children}
            </main>
          </div>
        </AdminMenuContext>
      </AdminToaster>
    </AdminUserProvider>
  );
}
