"use client";

import { createContext, useContext } from "react";

import type { AdminUser } from "../types";

const AdminUserContext = createContext<AdminUser | null>(null);

export function AdminUserProvider({ user, children }: { user: AdminUser; children: React.ReactNode }) {
  return <AdminUserContext value={user}>{children}</AdminUserContext>;
}

export function useAdminUser() {
  const user = useContext(AdminUserContext);
  if (!user) throw new Error("useAdminUser must be used inside AdminUserProvider");
  return { ...user, isOwner: user.role === "owner" };
}
