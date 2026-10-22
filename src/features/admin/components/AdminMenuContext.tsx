"use client";

import { createContext, useContext } from "react";

export const AdminMenuContext = createContext<() => void>(() => undefined);

export function useOpenAdminMenu() {
  return useContext(AdminMenuContext);
}
