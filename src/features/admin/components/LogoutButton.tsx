"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { logout } from "../services/dashboardService";

export function LogoutButton({ className }: { className?: string }) {
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await logout().catch(() => null);
        queryClient.clear();
        window.location.assign(routes.login);
      }}
      className={cn("text-[11px] font-semibold tracking-[0.1em] uppercase disabled:opacity-50", className)}
    >
      {t("admin.user.logout")}
    </button>
  );
}
